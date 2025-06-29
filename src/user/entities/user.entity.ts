import { ApiProperty } from '@nestjs/swagger';
import {
  AutoIncrement,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

type UserRole = 'ADMIN' | 'CLIENT' | 'DOCTOR';

@Table
export class User extends Model {
  @ApiProperty({
    example: '1',
    description: 'id of user',
  })
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @ApiProperty({
    example: 'luis miguel avendaño',
    description: 'name of user',
  })
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  fullname: string;

  @ApiProperty({
    example: 'luis@mail.com',
    description: 'Email of user',
    uniqueItems: true,
  })
  @Column({
    type: DataType.STRING(70),
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password: string;

  @ApiProperty({
    example: '3158526974',
    description: 'phone number of user',
  })
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  phone_number: string;

  @ApiProperty({
    example: 'http://mifoto.es',
    description: 'photo of user',
  })
  @Column({
    type: DataType.STRING(250),
    allowNull: true,
  })
  photo_url: string;

  @ApiProperty({
    example: 'CLIENT',
    description: 'password of user',
    enum: ['CLIENT', 'ADMIN', 'DOCTOR'],
  })
  @Default('CLIENT')
  @Column({
    type: DataType.ENUM('CLIENT', 'ADMIN', 'DOCTOR'),
    allowNull: false,
  })
  rol: UserRole;

  @ApiProperty({
    example: 'true',
    description: 'status of user',
  })
  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  status: boolean;
}
