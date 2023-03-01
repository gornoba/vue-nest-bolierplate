import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.access_token;
        },
      ]),
      secretOrKey: configService.get('jwt.access_key'),
      algorithms: configService.get('jwt.verify_algorithm'),
      issuer: configService.get('jwt.issuer'),
      audience: configService.get('jwt.audience'),
      clockTolerance: 30,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<unknown> {
    const user = { data: true }; // 쿼리 이용해 확인

    if (!user) {
      throw new UnauthorizedException('접근 오류');
    }

    return user;
  }
}
