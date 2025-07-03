import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  @MinLength(20)
  reason: string;

  @IsNumber()
  @IsPositive()
  petId: number;

  @IsNumber()
  @IsPositive()
  userId: number;
}
