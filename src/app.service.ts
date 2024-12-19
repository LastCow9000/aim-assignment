import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './stock/entities/stock.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  async onModuleInit() {
    try {
      const newStocks = [
        this.stockRepository.create({
          code: 'sa123',
          name: '삼성전자',
          price: 90000,
        }),
        this.stockRepository.create({
          code: 'sk456',
          name: 'SK하이닉스',
          price: 200000,
        }),
        this.stockRepository.create({
          code: 'lg123',
          name: 'LG에너지솔루션',
          price: 300000,
        }),
        this.stockRepository.create({
          code: 'hd123',
          name: 'HD현대일렉트릭',
          price: 390000,
        }),
        this.stockRepository.create({
          code: 'inv233',
          name: '2차전지 3배 인버스',
          price: 30000,
        }),
        this.stockRepository.create({
          code: 'ka123',
          name: '카카오뱅크',
          price: 70000,
        }),
        this.stockRepository.create({
          code: 'lf123',
          name: '앨엔에프',
          price: 200000,
        }),
        this.stockRepository.create({
          code: 'tsll',
          name: '테슬라 2배 레버리지',
          price: 67000,
        }),
        this.stockRepository.create({
          code: 'conl',
          name: '코인베이스 2배 레버리지',
          price: 75000,
        }),
        this.stockRepository.create({
          code: 'jepi',
          name: '제이피모건 커버드콜 옵션',
          price: 90000,
        }),
      ];

      await this.stockRepository.save(newStocks);
      console.log('초기 증권 데이터 10개 생성 완료');
    } catch (e) {
      console.warn('초기 데이터가 이미 등록됨');
    }
  }
}
