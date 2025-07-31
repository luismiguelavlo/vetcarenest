import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [UserModule],
})
export class FilesModule {}
