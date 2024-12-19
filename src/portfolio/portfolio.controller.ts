import { Controller, Post, Body, UseGuards, Param } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { JwtUserGuard } from 'src/auth/guards/jwt-user.guard';
import { User } from 'src/common/decorators/user.decorator';
import {
  AccessTokenPayload,
  AccountType,
  CreatePortfolioResponse,
  ResponseResult,
} from 'src/common/types';
import { ACCOUNT } from 'src/common/constants';

@Controller('api/v1/portfolios')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @UseGuards(JwtUserGuard)
  @Post()
  create(
    @User() user: AccessTokenPayload,
    @Body() createPortfolioDto: CreatePortfolioDto,
  ): Promise<CreatePortfolioResponse> {
    return this.portfolioService.create(user.id, createPortfolioDto);
  }

  @UseGuards(JwtUserGuard)
  @Post(':portfolio_id/execute')
  executeAdvice(
    @User() user: AccessTokenPayload,
    @Param('portfolio_id') portfolioId: number,
    accountType: AccountType = ACCOUNT.KRW,
  ): Promise<ResponseResult> {
    return this.portfolioService.executeAdvice(
      user.id,
      portfolioId,
      accountType,
    );
  }
}
