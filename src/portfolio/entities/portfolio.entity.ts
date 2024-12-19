import { BaseEntity } from 'src/common/bases/base.entity';
import { PORTFOLIO_RISK } from 'src/common/constants';
import { PortfolioRiskType } from 'src/common/types';
import { Column, Entity, OneToMany } from 'typeorm';
import { PortfolioStock } from './portfolio-stock.entity';
import { IsEnum, IsNotEmpty } from 'class-validator';

@Entity()
export class Portfolio extends BaseEntity {
  @IsEnum(PORTFOLIO_RISK)
  @IsNotEmpty()
  @Column({ type: 'enum', enum: PORTFOLIO_RISK })
  riskType: PortfolioRiskType;

  @OneToMany(() => PortfolioStock, (portfolioStock) => portfolioStock.portfolio)
  portfolioStocks: PortfolioStock[];
}
