import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}
  async create(createStockDto: CreateStockDto) {
    const newStock = this.stockRepository.create({
      ...createStockDto,
    });
    const { id } = await this.stockRepository.save(newStock);

    return {
      success: true,
      data: {
        id,
      },
    };
  }

  async update(code: string, updateStockDto: UpdateStockDto) {
    return;
  }

  async remove(code: string) {
    return;
  }
}
