import { Stock } from 'src/stock/entities/stock.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { BaseEntity } from 'src/common/bases/base.entity';

@Entity()
export class PortfolioStock extends BaseEntity {
  @Column()
  quantity: number;

  @Column()
  purchasePrice: number;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.portfolioStocks)
  @JoinColumn()
  portfolio: Portfolio;

  @ManyToOne(() => Stock)
  stock: Stock;
}
