import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { resolve } from 'path';
import { AppService } from './app.service';
import * as fs from 'fs';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(@Res() res: Response): void {
    if (fs.existsSync(resolve('front'))) {
      res.sendFile(resolve('front/index.html'));
    }
    res.send(this.appService.getHello());
    // return ;
  }

  @Get('config')
  configTest() {
    return this.configService.get('main.cors');
  }
}
