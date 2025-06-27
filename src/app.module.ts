import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    UserModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'ep-flat-flower-a5khg3mq-pooler.us-east-2.aws.neon.tech',
      port: 5432,
      username: 'vetcaredb_owner',
      password: 'npg_CuOX8ZUoWGs3',
      database: 'vetcaredb',
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
