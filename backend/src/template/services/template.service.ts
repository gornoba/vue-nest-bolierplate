import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import {
  ignoreExpirationVerifyAccessTokenOptions,
  signAccessTokenOptions,
  signRefreshTokenOptions,
  verifyRefreshTokenOptions,
  verifyAccessTokenOptions,
} from 'src/common/config/jwt.config';

export type User = any;

@Injectable()
export class TemplateService {
  private readonly users = [
    {
      userId: 1,
      username: 'liting',
      password: '1',
      role: 'admin',
    },
    {
      userId: 2,
      username: 'labs',
      password: '2',
      role: 'user',
    },
  ];
  private logger = new Logger(TemplateService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async localStrategyLogiin(username: string, password: string): Promise<any> {
    const user = this.users.find((user) => user.username === username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async accessTokenSign(userData) {
    return this.jwtService.sign(
      userData,
      signAccessTokenOptions(this.configService),
    );
  }

  async accessTokenVerify(token) {
    return this.jwtService.verify(
      token,
      verifyAccessTokenOptions(this.configService),
    );
  }

  async accessTokenIgnoreExpire(token) {
    return this.jwtService.verify(
      token,
      ignoreExpirationVerifyAccessTokenOptions(this.configService),
    );
  }

  async refreshTokenSign(userData) {
    return this.jwtService.sign(
      userData,
      signRefreshTokenOptions(this.configService),
    );
  }

  async refreshTokenVerify(token) {
    return this.jwtService.verify(
      token,
      verifyRefreshTokenOptions(this.configService),
    );
  }

  async setAccessTokenCookie(res: Response, token: string): Promise<void> {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
    });
  }

  async initData() {
    return { data: 'example' };
  }

  async bullTestData(data) {
    data.queue = true;
    return data;
  }
}
