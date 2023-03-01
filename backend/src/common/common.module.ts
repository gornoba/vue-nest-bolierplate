import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordInterceptor } from './interceptors/record.interceptor';
import { RecordRog } from './entities/record.entity';
import { RecordRepository } from './repositorys/record.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RecordRog])],
  providers: [RecordRepository],
  exports: [RecordRepository],
})
export class CommonModule {}
