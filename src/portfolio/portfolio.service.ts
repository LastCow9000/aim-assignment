import { Injectable } from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Account } from 'src/account/entities/account.entity';

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
}
