import { BaseEntity } from 'src/common/bases/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Stock extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column()
  price: number;
}
