import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Fullname of user',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({
    description:
      'the password must be a least 8 characters and must be a least one lowercase and uppercase, and must have a least on character special: (@$!%*?&)',
    nullable: false,
  })
  @IsString()
  @MinLength(8, { message: 'The password must be a least 8 characters' })
  @Matches(/(?=.*[a-z])/, {
    message: 'The password must be a least one lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'The password must be a least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'La contraseña debe tener al menos un número',
  })
  @Matches(/(?=.*[@$!%*?&])/, {
    message: 'La contraseña debe tener al menos un carácter especial (@$!%*?&)',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  phone_number: string;
}
