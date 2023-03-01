import { ConfigService } from '@nestjs/config';
import { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

export const signAccessTokenOptions = (
  configService: ConfigService,
): JwtSignOptions => ({
  secret: configService.get('jwt.access_key'),
  algorithm: configService.get('jwt.sign_algorithm'),
  expiresIn: '8h',
  issuer: configService.get('jwt.issuer'),
  audience: configService.get('jwt.audience'),
});

export const verifyAccessTokenOptions = (
  configService: ConfigService,
): JwtVerifyOptions => ({
  secret: configService.get('jwt.access_key'),
  algorithms: configService.get('jwt.verify_algorithm'),
  issuer: configService.get('jwt.issuer'),
  audience: configService.get('jwt.audience'),
  clockTolerance: 30,
  ignoreExpiration: false,
});

export const ignoreExpirationVerifyAccessTokenOptions = (
  configService: ConfigService,
): JwtVerifyOptions => ({
  secret: configService.get('jwt.access_key'),
  algorithms: configService.get('jwt.verify_algorithm'),
  issuer: configService.get('jwt.issuer'),
  audience: configService.get('jwt.audience'),
  clockTolerance: 30,
  ignoreExpiration: true,
});

export const signRefreshTokenOptions = (
  configService: ConfigService,
): JwtSignOptions => ({
  secret: configService.get('jwt.refresh_key'),
  algorithm: configService.get('jwt.sign_algorithm'),
  // expiresIn: '1y',
  issuer: configService.get('jwt.issuer'),
  audience: configService.get('jwt.audience'),
});

export const verifyRefreshTokenOptions = (
  configService: ConfigService,
): JwtVerifyOptions => ({
  secret: configService.get('jwt.refresh_key'),
  algorithms: configService.get('jwt.verify_algorithm'),
  issuer: configService.get('jwt.issuer'),
  audience: configService.get('jwt.audience'),
  clockTolerance: 30,
  ignoreExpiration: false,
});
