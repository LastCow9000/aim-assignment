import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { JwtUserGuard } from 'src/auth/guards/jwt-user.guard';
import { User } from 'src/common/decorators/user.decorator';
import { AccessTokenPayload, CreatePortfolioResponse } from 'src/common/types';

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
}
