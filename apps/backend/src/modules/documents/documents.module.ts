import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DriverDocument } from './entities/driver-document.entity';
import { DriverProfile } from '../drivers/entities/driver-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriverDocument, DriverProfile])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
