import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Auth } from 'src/user/decorators/auth.decorator';
import { ValidRoles } from 'src/user/interfaces/valid-roles';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @Auth(ValidRoles.CLIENT)
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @GetUser() user: User,
  ) {
    return this.appointmentService.create(createAppointmentDto, user);
  }

  @Get()
  @Auth(ValidRoles.ADMIN, ValidRoles.DOCTOR)
  findAll(@Query('status') status?: string) {
    return this.appointmentService.findAll(status);
  }

  @Get(':id')
  @Auth(ValidRoles.ADMIN, ValidRoles.DOCTOR)
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }

  @Patch(':id')
  @Auth(ValidRoles.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(+id, updateAppointmentDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.ADMIN)
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }

  //TODO: crear un endpoint para obtener todas las citas de las mascotas del usuario en sessión
}
