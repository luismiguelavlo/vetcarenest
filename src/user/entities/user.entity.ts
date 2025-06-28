import { Column, DataType, Default, Model, Table } from 'sequelize-typescript';

type UserRole = 'ADMIN' | 'CLIENT' | 'DOCTOR';

@Table
export class User extends Model {
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  fullname: string;

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

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  phone_number: string;

  @Column({
    type: DataType.STRING(250),
    allowNull: true,
  })
  photo_url: string;

  @Default('CLIENT')
  @Column({
    type: DataType.ENUM('CLIENT', 'ADMIN', 'DOCTOR'),
    allowNull: false,
  })
  rol: UserRole;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  status: boolean;
}
