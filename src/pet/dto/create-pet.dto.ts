import {
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePetDto {
  @IsNumber()
  @IsPositive()
  weight: number;

  @IsString()
  @MaxLength(100)
  @MinLength(2)
  name: string;

  @IsNumber()
  @IsPositive()
  owner: string;
}
