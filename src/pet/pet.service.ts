import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/entities/user.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';

@Injectable()
export class PetService {
  private readonly logger = new Logger('PetService');

  constructor(
    @InjectModel(Pet)
    private petModel: typeof Pet,
  ) {}

  async create(createPetDto: CreatePetDto) {
    try {
      //buscar la mascota

      //si existe y su estado es true: devolver un error que la mascota ya existe

      //si existe y su estado es false: cambiar su estado a true

      //si no existe..

      const newPet = await this.petModel.create({
        weight: createPetDto.weight,
        name: createPetDto.name,
        owner: createPetDto.owner,
      });

      return newPet;
    } catch (error) {
      this.handleDBException('Something went very wrong!');
    }
  }

  async findAll() {
    try {
      return await this.petModel.findAll({
        where: {
          status: true,
        },
        include: [
          {
            model: User,
            attributes: ['id', 'fullname', 'email', 'phone_number'],
          },
          {
            model: Appointment,
            attributes: ['id', 'date', 'reason'],
            include: [
              {
                model: User,
                as: 'doctor',
                attributes: ['id', 'fullname', 'email', 'phone_number'],
              },
            ],
          },
        ],
      });
    } catch (error) {
      this.handleDBException('Something went very wrong!');
    }
  }

  async findOne(id: number) {
    const pet = await this.petModel.findOne({
      where: {
        id: id,
      },
    });

    if (!pet) {
      throw new NotFoundException(`Pet whit id: ${id} not found`);
    }

    return pet;
  }

  async update(id: number, updatePetDto: UpdatePetDto) {
    const pet = await this.findOne(id);

    try {
      await pet.update({
        weight: updatePetDto.weight,
        name: updatePetDto.name,
        owner: updatePetDto.owner,
      });

      return {
        message: 'pet updated successfully',
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const pet = await this.findOne(id);

    try {
      await pet.update({
        status: false,
      });

      return {
        message: 'Pet deleted successfully',
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    if (error?.parent?.code === '23505') {
      throw new BadRequestException(error.parent.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Something went very wrong!');
  }
}
