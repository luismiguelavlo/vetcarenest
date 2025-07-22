import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');

  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel(User)
    private userModel: typeof User,

    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userModel.findOne({
      where: {
        email: email,
        status: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!bcrypt.compareSync(password, user.dataValues.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      token: this.getJwtToken({
        id: user.id,
      }),
      user: {
        id: user.id,
        fullname: user.dataValues.fullname,
        email: user.dataValues.email,
        phone_number: user.dataValues.phone_number,
        rol: user.dataValues.rol,
      },
    };
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userModel.create({
        fullname: createUserDto.fullname,
        email: createUserDto.email,
        password: bcrypt.hashSync(createUserDto.password, 12),
        phone_number: createUserDto.phone_number,
      });

      return {
        user: {
          id: newUser.id,
          fullname: newUser.dataValues.fullname,
          email: newUser.dataValues.email,
          phone_number: newUser.dataValues.phone_number,
          rol: newUser.dataValues.rol,
        },
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(status: boolean = true, id: string = '1') {
    const [users] = await this.sequelize.query(
      `SELECT * FROM "user" WHERE status = :status AND id = :id`,
      {
        replacements: {
          status: status,
          id: id,
        },
      },
    );
    return users;
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

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBException(error: any) {
    if (error?.parent?.code === '23505') {
      throw new BadRequestException(error.parent.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Something went very wrong!');
  }
}
