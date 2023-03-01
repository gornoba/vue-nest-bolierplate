import { Module } from '@nestjs/common';
import { TemplateService } from './services/template.service';
import { TemplateController } from './controllers/template.controller';
import { LocalStrategy } from './auth/local/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt/jwt.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [JwtModule.register({}), HttpModule],
  providers: [TemplateService, LocalStrategy, JwtStrategy],
  controllers: [TemplateController],
})
export class TemplateModule {}
