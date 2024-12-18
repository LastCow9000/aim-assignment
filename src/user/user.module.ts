import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AccessHistory } from './entities/access-history';

@Module({
  imports: [TypeOrmModule.forFeature([User, AccessHistory])],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
