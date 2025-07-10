import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Appointment } from './entities/appointment.entity';
import { UserModule } from 'src/user/user.module';
import { PetModule } from 'src/pet/pet.module';

@Module({
  imports: [SequelizeModule.forFeature([Appointment]), UserModule, PetModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
