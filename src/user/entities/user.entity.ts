import { ApiProperty } from '@nestjs/swagger';
import {
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Pet } from 'src/pet/entities/pet.entity';

type UserRole = 'ADMIN' | 'CLIENT' | 'DOCTOR';

@Table({
  tableName: 'user',
  timestamps: true,
})
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
  @Default(['CLIENT'])
  @Column({
    type: DataType.ARRAY(DataType.ENUM('CLIENT', 'ADMIN', 'DOCTOR')),
    allowNull: false,
  })
  rol: UserRole[];

  @ApiProperty({
    example: 'true',
    description: 'status of user',
  })
  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  status: boolean;

  @HasMany(() => Pet)
  pets: Pet[];

  @HasMany(() => Appointment)
  appointments: Appointment[];

  @BeforeCreate
  static async checkEmailBeforeCreate(user: User) {
    user.dataValues.email = user.dataValues.email.toLowerCase().trim();
  }

  @BeforeUpdate
  static checkEmailBeforeUpdate(user: User) {
    user.dataValues.email = user.dataValues.email.toLowerCase().trim();
  }
}
