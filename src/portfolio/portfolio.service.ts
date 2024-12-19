import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
    private readonly dataSource: DataSource,
  ) {}
  async create(id: number, { riskType }: CreatePortfolioDto) {
    return this.dataSource.manager.transaction(async (entityManager) => {
      const user = await entityManager
        .getRepository(User)
        .findOne({ where: { id }, relations: ['portfolio'] });
      if (user.portfolio) {
        throw new ConflictException('이미 포트폴리오를 가지고 있습니다.');
      }

      const newPortfolio = entityManager.getRepository(Portfolio).create({
        riskType,
      });
      const savedPortfolio = await entityManager.save(newPortfolio);

      user.portfolio = savedPortfolio;
      await entityManager.save(user);

      return {
        success: true,
        data: {
          id: savedPortfolio.id,
        },
      };
    });
  }

  findAll() {
    return `This action returns all portfolio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} portfolio`;
  }
}
