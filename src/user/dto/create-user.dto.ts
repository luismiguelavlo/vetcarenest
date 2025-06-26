import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;

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

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  phone_number: string;
}
