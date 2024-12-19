import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const isExist = await this.findStockByCode(createStockDto.code);
    if (isExist) {
      throw new ConflictException('이미 존재하는 증권 코드 입니다.');
    }

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

  async findAllStocks() {
    const stocks = await this.stockRepository.find();

    return {
      success: true,
      data: stocks,
    };
  }

  async updatePrice(code: string, updateStockDto: UpdateStockDto) {
    const stock = await this.findStockByCode(code);
    if (!stock) {
      throw new NotFoundException('해당 코드의 증권을 찾을 수 없습니다.');
    }

    stock.price = updateStockDto.price;
    await this.stockRepository.save(stock);

    return {
      success: true,
    };
  }

  async remove(code: string) {
    const stock = await this.findStockByCode(code);
    if (!stock) {
      throw new NotFoundException('해당 코드의 증권을 찾을 수 없습니다.');
    }

    await this.stockRepository.remove(stock);
    return {
      success: true,
    };
  }

  private findStockByCode(code: string) {
    return this.stockRepository.findOne({ where: { code } });
  }
}
