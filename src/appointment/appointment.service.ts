import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AppointmentService {
  private logger = new Logger('AppointmentService');

  constructor(
    @InjectModel(Appointment)
    private appointmentModel: typeof Appointment,
    private readonly userService: UserService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const user = await this.userService.findOne(createAppointmentDto.userId);

    if (user.dataValues.rol !== 'DOCTOR') {
      throw new BadRequestException(
        'The user is not a doctor, cannot create an appointment.',
      );
    }

    await this.findApppointmentByDoctorAndDate(
      createAppointmentDto.userId,
      createAppointmentDto.date,
    );

    await this.findApppointmentByPetAndDate(
      createAppointmentDto.petId,
      createAppointmentDto.date,
    );

    try {
      const appointment = await this.appointmentModel.create({
        date: createAppointmentDto.date,
        reason: createAppointmentDto.reason,
        pet_id: createAppointmentDto.petId,
        user_id: createAppointmentDto.userId,
        status: createAppointmentDto.status || AppointmentStatus.PENDING,
      });

      return appointment;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(status: string = 'all') {
    if (
      status !== AppointmentStatus.PENDING &&
      status !== AppointmentStatus.CANCELLED &&
      status !== AppointmentStatus.COMPLETED &&
      status !== 'all'
    ) {
      throw new BadRequestException('Invalid appointment status');
    }

    let whereCondition: any = {};

    if (status !== 'all') {
      whereCondition.status = status;
    } else {
      whereCondition.status = [
        AppointmentStatus.PENDING,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.COMPLETED,
      ];
    } //El else es opcional para este caso pero lo dejamos para documentacion

    return await this.appointmentModel.findAll({
      where: whereCondition,
    });
  }

  async findOne(id: number, status?: string) {
    let whereCondition: any = {
      id: id,
    };

    if (status) {
      whereCondition.status = status;
    }

    const appointment = await this.appointmentModel.findOne({
      where: whereCondition,
    });

    if (!appointment) {
      throw new BadRequestException(`Appointment with id: ${id} not found`);
    }

    return appointment;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.findOne(id, AppointmentStatus.PENDING);

    try {
      await appointment.update({
        date: updateAppointmentDto.date,
        reason: updateAppointmentDto.reason,
        status: updateAppointmentDto.status || appointment.status,
      });

      return {
        message: `Appointment with id: ${id} updated successfully`,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const appointment = await this.findOne(id, AppointmentStatus.PENDING);

    try {
      await appointment.update({
        status: AppointmentStatus.CANCELLED,
      });

      return {
        message: `Appointment with id: ${id} cancelled successfully`,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private async findApppointmentByPetAndDate(petId: number, date: Date) {
    const appointmnet = await this.appointmentModel.findOne({
      where: {
        pet_id: petId,
        date: date,
      },
    });

    if (appointmnet) {
      throw new BadRequestException(
        `There is already an appointment for this pet on ${date.toISOString()}`,
      );
    }
  }

  private async findApppointmentByDoctorAndDate(userId: number, date: Date) {
    const appointment = await this.appointmentModel.findOne({
      where: {
        user_id: userId,
        date: date,
      },
    });

    if (appointment) {
      throw new BadRequestException(
        `There is already an appointment for this doctor on ${date.toISOString()}`,
      );
    }
  }

  private handleDBException(error: any) {
    if (error?.parent?.code === '23505') {
      throw new BadRequestException(error.parent.detail);
    }

    this.logger?.error(error);
    throw new InternalServerErrorException('Something went very wrong!');
  }
}
