import { Module } from '@nestjs/common';
import { TemplateService } from './services/template.service';
import { TemplateController } from './controllers/template.controller';
import { LocalStrategy } from './auth/local/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt/jwt.strategy';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { templateQueue } from './queues/template.queues';

@Module({
  imports: [
    JwtModule.register({}),
    HttpModule,
    BullModule.registerQueue({
      name: 'template',
    }),
  ],
  providers: [TemplateService, LocalStrategy, JwtStrategy, templateQueue],
  controllers: [TemplateController],
})
export class TemplateModule {}
