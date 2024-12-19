import { PickType } from '@nestjs/mapped-types';
import { Portfolio } from '../entities/portfolio.entity';

export class CreatePortfolioDto extends PickType(Portfolio, ['riskType']) {}
