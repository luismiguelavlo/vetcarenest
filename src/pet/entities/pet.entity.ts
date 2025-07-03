import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { User } from 'src/user/entities/user.entity';

@Table
export class Pet extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  weight: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: 'owner_name_unique_contraint',
  })
  name: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  status: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: 'owner_name_unique_contraint',
  })
  owner: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Appointment)
  appointments: Appointment[];
}
