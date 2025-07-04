import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { envs } from './config/envs';
import { PetModule } from './pet/pet.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    UserModule,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
