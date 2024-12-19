import { PickType } from '@nestjs/mapped-types';
import { Stock } from '../entities/stock.entity';

export class UpdateStockDto extends PickType(Stock, ['price']) {}
