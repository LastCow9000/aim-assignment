import { Controller, Post, Body, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResponse, LoginUserResponse } from 'src/common/types';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    return this.userService.create(createUserDto);
  }

  @Post('/login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginUserResponse> {
    const accessToken = await this.userService.login(loginUserDto);
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.cookie('access_token', accessToken, { httpOnly: true });

    return {
      success: true,
      data: { accessToken },
    };
  }
}