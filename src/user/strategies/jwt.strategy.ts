import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from '../entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { envs } from 'src/config/envs';

@Injectable() //esto se hace para que la estrategia sea utilizable en cualkquier lugar
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User, //esto se hace para poder acceder al modelo de usuario
    private readonly configService: ConfigService, //esto se hace para poder acceder a las variables de entorno
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET') || envs.jwt_secret, //esto se hace para poder acceder a la variable de entorno JWT_SECRET que es la que se utiliza para validar el token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //esto se hace para poder extraer el token del header de la peticion
    });
  }

  async validate(payload: JwtPayload) {
    console.log('Validating JWT payload...');
    console.log('Payload received:', payload);
    const { id } = payload;

    console.log('Validating user with ID:', id);

    const user = await this.userModel.findOne({
      where: {
        id: id,
      },
    });
    console.log('User found:', user);

    if (!user) {
      throw new UnauthorizedException('Token is not valid');
    }

    if (!user.dataValues.status) {
      throw new UnauthorizedException('User is not active, talk to the admin');
    }

    return user;
  }
}
