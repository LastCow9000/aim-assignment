import { IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/bases/base.entity';
import { Column, Entity } from 'typeorm';

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
}
