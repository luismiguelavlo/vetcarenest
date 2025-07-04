import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config/envs';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '3h',
          },
        };
      },
    }),
    /*JwtModule.register({
      secret: envs.jwt_secret,
      signOptions: { expiresIn: '3h' },
    }),*/
  ],
  exports: [
    UserService,
    SequelizeModule,
    PassportModule,
    JwtModule,
    JwtStrategy,
  ],
})
export class UserModule {}
