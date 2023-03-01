import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/role.decorator';
import { JwtService } from '@nestjs/jwt';
import { verifyAccessTokenOptions } from 'src/common/config/jwt.config';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/common/enum/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndMerge<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    let cookie: string;

    if (!requiredRoles) {
      return true;
    }

    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    cookie = req.cookies?.access_token;

    const accessToken = this.jwtService.verify(
      cookie,
      verifyAccessTokenOptions(this.configService),
    );

    return accessToken
      ? requiredRoles.some((a) => a === accessToken.role)
      : false;
  }
}
