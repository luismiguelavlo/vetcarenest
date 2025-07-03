import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userModel.create({
        fullname: createUserDto.fullname,
        email: createUserDto.email,
        password: createUserDto.password,
        phone_number: createUserDto.phone_number,
      });

      return newUser;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll() {
    try {
      return await this.userModel.findAll({
        where: {
          status: true,
        },
      });
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findOne(id: number) {
    const user = await this.userModel.findOne({
      where: {
        status: true,
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    try {
      await user.update({
        fullname: updateUserDto.fullname,
        email: updateUserDto.email,
        phone_number: updateUserDto.phone_number,
      });
      return user;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    try {
      await user.update({
        status: false,
      });
      return user;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    if (error?.parent?.code === '23505') {
      throw new BadRequestException(error.parent.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Something went very wrong!');
  }
}
