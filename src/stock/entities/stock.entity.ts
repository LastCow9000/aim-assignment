import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { BaseEntity } from 'src/common/bases/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Stock extends BaseEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ unique: true })
  code: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  @Column()
  price: number;
}
