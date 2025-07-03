import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Appointment } from './entities/appointment.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [SequelizeModule.forFeature([Appointment]), UserModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
