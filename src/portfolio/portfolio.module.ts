import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioStock } from './entities/portfolio-stock.entity';
import { Account } from 'src/account/entities/account.entity';
import { Stock } from 'src/stock/entities/stock.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Portfolio, User, PortfolioStock, Account, Stock]),
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
