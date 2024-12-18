import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
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
}
