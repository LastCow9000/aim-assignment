import { PickType } from '@nestjs/mapped-types';
import { Stock } from '../entities/stock.entity';

export class CreateStockDto extends PickType(Stock, [
  'code',
  'name',
  'price',
]) {}
