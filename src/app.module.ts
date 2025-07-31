import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { envs } from './config/envs';
import { PetModule } from './pet/pet.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    UserModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 2000,
        },
      ],
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: envs.database_host,
      port: envs.database_port,
      username: envs.database_username,
      password: envs.database_password,
      database: envs.database_name,
      autoLoadModels: true,
      synchronize: true,
      //sync: { force: true },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }),
    PetModule,
    AppointmentModule,
    FilesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
