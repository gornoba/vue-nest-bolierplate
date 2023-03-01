import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TemplateService } from 'src/template/services/template.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly templateService: TemplateService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    // 이 부분 repository에서 username만으로 login user 정보 가져와야 함
    const user = await this.templateService.localStrategyLogiin(
      username,
      password,
    );
    if (!user) {
      throw new UnauthorizedException('아이디가 없습니다.');
    }

    // 이어서 비밀번호 bycrypt compare false면 err
    // true이면 user 정보 return

    return user;
  }
}
