import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload } from 'src/common/types';
import { AccessHistory } from './entities/access-history';
import { ACCESS } from 'src/common/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AccessHistory)
    private readonly accessHistoryRepository: Repository<AccessHistory>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { userId, password, name } = createUserDto;

    const isExist = await this.userRepository.existsBy({ userId });
    if (isExist) {
      throw new ConflictException('이미 존재하는 아이디입니다.');
    }

    const salt = parseInt(this.configService.get('SALT'), 10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const { id } = await this.userRepository.save({
      userId,
      password: hashedPassword,
      name,
    });

    return {
      success: true,
      data: {
        id,
      },
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { userId, password } = loginUserDto;

    const findedUser = await this.userRepository.findOne({ where: { userId } });
    if (!findedUser) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    const isCorrectPassword = await bcrypt.compare(
      password,
      findedUser.password,
    );
    if (!isCorrectPassword) {
      throw new UnauthorizedException('잘못된 비밀번호입니다.');
    }

    await this.accessHistoryRepository.save({
      user: findedUser,
      type: ACCESS.LOGIN,
    });

    return this.getAccessToken(findedUser);
  }

  async logout({ id }: AccessTokenPayload) {
    await this.accessHistoryRepository.save({
      user: { id },
      type: ACCESS.LOGOUT,
    });
  }

  private getAccessToken({ id, userId, name }: User) {
    const payload: AccessTokenPayload = {
      id,
      userId,
      name,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '600000',
    });
  }
}
