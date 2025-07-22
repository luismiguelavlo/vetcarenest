import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  SetMetadata,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { UserRolGuard } from './guards/user-rol/user-rol.guard';
import { RolProtected } from './decorators/rol-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';
import { ParseBoolPipe } from '@nestjs/common';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'User was created', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List Users' })
  //@Auth(ValidRoles.ADMIN, ValidRoles.DOCTOR)
  findAll(
    @Query('status', ParseBoolPipe) status?: boolean,
    @Query('id') id?: string,
  ) {
    return this.userService.findAll(status, id);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get one user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Auth()
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    return {
      id: user.dataValues.id,
      fullname: user.dataValues.fullname,
      email: user.dataValues.email,
      phone_number: user.dataValues.phone_number,
      rol: user.dataValues.rol,
    };
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Update User' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Auth(ValidRoles.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Delete User' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Auth(ValidRoles.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('route/private')
  @Auth(ValidRoles.DOCTOR, ValidRoles.CLIENT)
  privateRoute(
    @GetUser() user: User /*@GetUser('fullname') userName: string*/,
  ) {
    return {
      ok: true,
      message: 'This is a private route',
    };
  }
}
