import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Pet } from 'src/pet/entities/pet.entity';
import { User } from 'src/user/entities/user.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Table({
  tableName: 'appointment',
  timestamps: true,
})
export class Appointment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: string;

  @Column({
    type: DataType.ENUM('pending', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reason: string;

  @ForeignKey(() => Pet)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  pet_id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => Pet)
  pet: Pet;

  @BelongsTo(() => User, { as: 'doctor' })
  user: User;
}
