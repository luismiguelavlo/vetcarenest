import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserService {
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
      console.log(error);
      throw new InternalServerErrorException('Internal Server Error');
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
      console.log(error);
      throw new InternalServerErrorException('Internal Server Error');
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
      console.log(error);
      throw new InternalServerErrorException('Internal Server Error');
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
      console.log(error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
