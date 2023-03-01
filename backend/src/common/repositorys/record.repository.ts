import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { RecordRog } from '../entities/record.entity';
import { session } from '../config/env.config';

@Injectable()
export class RecordRepository {
  constructor(
    @InjectRepository(RecordRog)
    private recordRepository: Repository<RecordRog>,
  ) {}

  async insertData(payload) {
    const { method, url, latency, status, message, result, session } = payload;

    const record = this.recordRepository.create({
      method,
      url,
      latency,
      status: status ? status : 200,
      message,
      result,
      session,
    });
    await this.recordRepository.save(record);
  }
}
