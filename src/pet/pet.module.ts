import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Pet } from './entities/pet.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [PetController],
  providers: [PetService],
  imports: [SequelizeModule.forFeature([Pet]), UserModule],
  exports: [PetService],
})
export class PetModule {}
