import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Pet } from './entities/pet.entity';

@Module({
  controllers: [PetController],
  providers: [PetService],
  imports: [SequelizeModule.forFeature([Pet])],
})
export class PetModule {}
