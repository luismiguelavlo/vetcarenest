import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Auth } from 'src/user/decorators/auth.decorator';
import { ValidRoles } from 'src/user/interfaces/valid-roles';

@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  @Auth()
  create(@Body() createPetDto: CreatePetDto) {
    return this.petService.create(createPetDto);
  }

  @Get()
  @Auth(ValidRoles.ADMIN, ValidRoles.DOCTOR)
  findAll() {
    return this.petService.findAll();
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.petService.findOne(+id);
  }

  @Patch(':id')
  @Auth(ValidRoles.ADMIN, ValidRoles.DOCTOR)
  update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
    return this.petService.update(+id, updatePetDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.ADMIN)
  remove(@Param('id') id: string) {
    return this.petService.remove(+id);
  }

  //TODO: endpoint para traer todas las mascotas del usuario en sessión
}
