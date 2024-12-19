import { IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/bases/base.entity';
import { Portfolio } from 'src/portfolio/entities/portfolio.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @IsString()
  @IsNotEmpty()
  @Column()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  password: string;

  @OneToOne(() => Portfolio)
  @JoinColumn()
  portfolio: Portfolio;
}
