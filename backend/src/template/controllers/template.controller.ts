import {
  Body,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Res,
  Sse,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { Roles } from 'src/common/decorators/role.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/local/local-auth.guard';
import { RolesGuard } from '../auth/role/role.guard';
import { TemplateService } from '../services/template.service';
import { Cache } from 'cache-manager';
import { AccessToken } from 'src/common/decorators/accesstoken.decorator';
import { Role } from 'src/common/enum/role.enum';
import { interval, lastValueFrom, map, Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { AxiosRequestConfig } from '../../../node_modules/axios/index.d';
import { templateQueue } from '../queues/template.queues';

@ApiTags('template')
@Roles(Role.Admin)
@Controller('template')
export class TemplateController {
  constructor(
    private readonly templateService: TemplateService,
    @Inject(CACHE_MANAGER) private cacheManage: Cache,
    private readonly httpService: HttpService,
    @InjectQueue('template') private templateQueue: Queue,
  ) {}

  @ApiOperation({
    summary: '회원가입시',
    description: '회원을 가입시키고 refresh token을 발급',
  })
  @Post('join')
  async join(@Req() req: Request): Promise<string> {
    const userData = { email: 'xx@naer.com' };
    const refreshToken = await this.templateService.refreshTokenSign(userData);

    // 원래는 DB에 저장하고 {success:true} 만 return
    return refreshToken;
  }

  @ApiOperation({
    summary: '로그인',
    description: '로그인 하면 access token을 발급하고 cookie에 넣어줌',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // jwt access token
    const accessToken = await this.templateService.accessTokenSign(req.user);
    // access token cookie setting
    await this.templateService.setAccessTokenCookie(res, accessToken);
    return req.user;
  }

  @ApiOperation({
    summary: 'jwt guard 테스트용',
  })
  @Roles(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('just')
  async justRequest(@Req() req: Request) {
    return req.user;
  }

  @ApiOperation({
    summary:
      'cache에 저장된 결과에 따라 서비스를 동적으로 불러와 data get. 실시간업데이트',
  })
  @UseGuards(JwtAuthGuard)
  @Sse('dynamic_modal/:id/:customer')
  async modalSse(
    @AccessToken() access_token: string,
    @Param() param: { id: string },
  ): Promise<Observable<MessageEvent>> {
    try {
      // params에서 api와 고객코드를 불러온다.
      const params = param.id.replace(/-/g, '/');
      const headers: AxiosRequestConfig['headers'] = {
        Cookie: `access_token=${access_token}`,
      };
      const result: Observable<AxiosResponse<any[]>> = this.httpService.get(
        'http://localhost:8000/api/' + params,
        { headers },
      );
      const response: AxiosResponse<any[]> = await lastValueFrom(result);

      return interval(5000).pipe(
        map((_) => ({ ...response.data['data'] } as MessageEvent)),
      );
    } catch (error) {
      throw new UnauthorizedException('SSE ERROR');
    }
  }

  @Get('indata')
  async indata(@Req() req) {
    return this.templateService.initData();
  }

  @Post('bulltest')
  async bulltest(@Body() body) {
    return await this.templateQueue.add('test', body);
  }
}
