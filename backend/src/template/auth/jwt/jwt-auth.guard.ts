import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';

import { TemplateService } from 'src/template/services/template.service';
import { session } from '../../../common/config/env.config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly templateService: TemplateService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    const isReq = context.getType();
    const res = context.switchToHttp().getResponse();
    const req = context.switchToHttp().getRequest();
    let errorName: string;
    let accessToken: string;

    try {
      const user = req?.user;

      if (!user) {
        errorName = context.getArgs()[0]?.authInfo?.name;
        accessToken = context.getArgs()[0]?.cookies?.access_token;
      }

      // accesstoken을 만료기간없이 verify, 이후 refresh token 검증 후 accesstoken cookie에 넣기
      if (accessToken && errorName && errorName === 'TokenExpiredError') {
        const verifyIgnoreAccessToken =
          await this.templateService.accessTokenIgnoreExpire(
            req.cookies.access_token,
          );

        const refreshToken = '123'; // repository를 이용하여 DB에서 refresh token 가져오기
        const verifyRefreshToken =
          this.templateService.refreshTokenVerify(refreshToken);

        if (!verifyRefreshToken) {
          throw new Error('refresh token error');
        }

        const newAccessToken =
          this.templateService.accessTokenSign(verifyRefreshToken);
        res.cookie('access_token', newAccessToken, {
          httpOnly: true,
          secure: true,
        });
      }

      return result;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ) {
    return user;
  }
}
