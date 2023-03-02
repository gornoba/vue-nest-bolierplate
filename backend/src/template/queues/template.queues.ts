import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { TemplateService } from '../services/template.service';

@Processor('template')
export class templateQueue {
  private readonly logger = new Logger(templateQueue.name);
  constructor(private readonly templateService: TemplateService) {}

  @Process('test')
  async testQueue(job: Job) {
    const result = await this.templateService.bullTestData(job.data);
    return result;
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}
