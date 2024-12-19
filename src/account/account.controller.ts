import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccessTokenPayload, AccountType } from 'src/common/types';
import { JwtUserGuard } from 'src/auth/guards/jwt-user.guard';
import { User } from 'src/common/decorators/user.decorator';

@Controller('api/v1/accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(JwtUserGuard)
  @Get(':type')
  findAccount(
    @User() user: AccessTokenPayload,
    @Param('type') type: AccountType,
  ) {
    return this.accountService.findAccount(user, type);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }
}
