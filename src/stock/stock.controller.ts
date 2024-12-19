import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import {
  CreateStockResponse,
  FindStocksResponse,
  ResponseResult,
} from 'src/common/types';

@Controller('api/v1/stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  create(@Body() createStockDto: CreateStockDto): Promise<CreateStockResponse> {
    return this.stockService.create(createStockDto);
  }

  @Get()
  findAllStocks(): Promise<FindStocksResponse> {
    return this.stockService.findAllStocks();
  }

  @Patch(':code')
  updatePrice(
    @Param('code') code: string,
    @Body() updateStockDto: UpdateStockDto,
  ): Promise<ResponseResult> {
    return this.stockService.updatePrice(code, updateStockDto);
  }

  @Delete(':code')
  remove(@Param('code') code: string): Promise<ResponseResult> {
    return this.stockService.remove(code);
  }
}
