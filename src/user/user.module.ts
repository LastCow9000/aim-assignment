import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AccessHistory } from './entities/access-history';
import { JwtUserStrategy } from 'src/auth/strategies/jwt-user.strategy';
import { Account } from 'src/account/entities/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AccessHistory, Account]),
    JwtModule.register({}),
  ],
  controllers: [UserController],
  providers: [UserService, JwtUserStrategy],
})
export class UserModule {}
