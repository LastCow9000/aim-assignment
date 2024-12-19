import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Account } from 'src/account/entities/account.entity';
import { AccountHistory } from 'src/account/entities/account-history.entity';
import {
  MIN_STOCK_COUNT,
  TRANSACTION,
  PORTFOLIO_RISK,
  MIN_DISTRIBUTION_COUNT,
} from 'src/common/constants';
import { AccountType, PortfolioRiskType } from 'src/common/types';
import { PortfolioStock } from './entities/portfolio-stock.entity';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    private readonly dataSource: DataSource,
  ) {}

  async create(userId: number, { riskType }: CreatePortfolioDto) {
    const newPortfolio = this.portfolioRepository.create({
      riskType,
      isProgressed: false,
      user: { id: userId },
    });
    const savedPortfolio = await this.portfolioRepository.save(newPortfolio);

    return {
      success: true,
      data: {
        id: savedPortfolio.id,
      },
    };
  }

  async findAll(userId: number) {
    const portfolios = await this.portfolioRepository.find({
      where: { user: { id: userId } },
    });

    return {
      success: true,
      data: portfolios,
    };
  }

  async findDetail(userId: number, portfolioId: number) {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId, user: { id: userId } },
      relations: ['portfolioStocks.stock'],
    });
    if (!portfolio) {
      throw new NotFoundException('해당 포트폴리오가 존재하지 않습니다.');
    }

    const data = portfolio.portfolioStocks.map(
      ({ stock: { code, name }, quantity, purchasePrice, createdAt }) => ({
        code,
        name,
        quantity,
        purchasePrice,
        purchaseDate: createdAt,
      }),
    );

    return { success: true, data };
  }

  async executeAdvice(
    userId: number,
    portfolioId: number,
    accountType: AccountType,
  ) {
    const availableStocks = await this.stockRepository.find();
    if (availableStocks.length < MIN_STOCK_COUNT) {
      throw new BadRequestException(
        '증권 수가 부족하여 자문 요청을 진행할 수 없습니다.',
      );
    }

    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId },
    });
    if (!portfolio) {
      throw new NotFoundException('먼저 위험도를 선택해주세요.');
    }
    if (portfolio.isProgressed) {
      throw new BadRequestException(
        '이미 자문 요청으로 구성된 포트폴리오가 있습니다.',
      );
    }

    const account = await this.accountRepository.findOne({
      where: { type: accountType, user: { id: userId } },
    });
    const investmentAmount = this.caculateInvestmentAmount(
      account.amount,
      portfolio.riskType,
    );
    const { resultPortfolio, totalUsedAmount } = this.startInvestment(
      investmentAmount,
      availableStocks,
    );

    const lowestPriceStock = this.getSortedStocksByDesc(availableStocks).pop();
    if (investmentAmount < lowestPriceStock.price) {
      throw new BadRequestException(
        '자문 요청을 수행하기 위한 잔고가 부족합니다.',
      );
    }

    await this.startTransaction({
      resultPortfolio,
      portfolio,
      account,
      totalUsedAmount,
    });

    return {
      success: true,
    };
  }

  private startTransaction({
    resultPortfolio,
    portfolio,
    account,
    totalUsedAmount,
  }: {
    resultPortfolio: {
      code: string;
      quantity: number;
    }[];
    portfolio: Portfolio;
    account: Account;
    totalUsedAmount: number;
  }) {
    return this.dataSource.manager.transaction(async (entityManager) => {
      for (const purchasedStock of resultPortfolio) {
        const stock = await entityManager.getRepository(Stock).findOne({
          where: { code: purchasedStock.code },
        });

        const portfolioStock = await entityManager
          .getRepository(PortfolioStock)
          .findOne({
            where: {
              stock,
              portfolio,
            },
          });
        if (portfolioStock) {
          portfolioStock.quantity += purchasedStock.quantity;
          await entityManager.save(portfolioStock);
        } else {
          const newPortfolioStock = entityManager
            .getRepository(PortfolioStock)
            .create({
              stock,
              quantity: purchasedStock.quantity,
              purchasePrice: stock.price,
              portfolio,
            });
          await entityManager.save(newPortfolioStock);
        }
      }

      account.amount -= totalUsedAmount;
      await entityManager.save(account);

      const newAccountHistory = entityManager
        .getRepository(AccountHistory)
        .create({
          account,
          amount: totalUsedAmount,
          type: TRANSACTION.WITHDRAWAL,
          description: '자문요청으로 인한 출금',
        });
      await entityManager.save(newAccountHistory);

      portfolio.isProgressed = true;
      await entityManager.save(portfolio);
    });
  }

  private startInvestment(investmentAmount: number, availableStocks: Stock[]) {
    const resultPortfolio: { code: string; quantity: number }[] = [];
    let availableAmount = investmentAmount;
    const sortedStocks = this.getSortedStocksByDesc(availableStocks);

    /**
     * 가중치로 사용할 속성이 없으므로 가격 높은 기준 top5 종목을 넣는 그리디 알고리즘 사용
     */
    const targetAmount = Math.floor(investmentAmount / MIN_DISTRIBUTION_COUNT); // 한 종목 당 투자할 분산 금액
    for (let i = 0; i < MIN_DISTRIBUTION_COUNT; i++) {
      const stock = sortedStocks[i];
      const quantity = Math.floor(targetAmount / stock.price);

      if (quantity > 0) {
        resultPortfolio.push({ code: stock.code, quantity });
        availableAmount -= stock.price * quantity;
      }
    }

    /**
     * 남은 금액이 있을 경우 가격 높은 종목부터 모든 종목을 탐색하며 남은 금액 최대한 사용
     */
    let idx = 0;
    while (availableAmount > 0 && idx < sortedStocks.length) {
      const stock = sortedStocks[idx];
      const quantity = Math.floor(availableAmount / stock.price);

      if (quantity > 0) {
        const existedStock = resultPortfolio.find(
          (item) => item.code === stock.code,
        );
        if (existedStock) {
          existedStock.quantity += quantity;
        } else {
          resultPortfolio.push({ code: stock.code, quantity });
        }

        availableAmount -= stock.price * quantity;
      }

      idx++;
    }

    return {
      resultPortfolio,
      totalUsedAmount: investmentAmount - availableAmount,
    };
  }

  private getSortedStocksByDesc(stocks: Stock[]) {
    return [...stocks].sort((a, b) => b.price - a.price);
  }

  private caculateInvestmentAmount(
    amount: number,
    riskType: PortfolioRiskType,
  ) {
    switch (riskType) {
      case PORTFOLIO_RISK.AGGRESSIVE:
        return amount * 0.95;
      case PORTFOLIO_RISK.MODERATE:
        return amount * 0.5;
      default:
        throw new BadRequestException('유효하지 않은 위험도 입니다.');
    }
  }
}
