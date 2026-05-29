import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import {
  LoginDto,
  LogoutDto,
  LogoutResponseDto,
  RefreshTokenDto,
  TokenResponseDto,
} from '@dad-group-1/backend-common';

@Controller('authentication')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() data: LoginDto): Promise<TokenResponseDto> {
    const user = await this.authService.validateUser(data.email, data.password);
    return this.authService.login(user);
  }

  @MessagePattern({ cmd: 'refresh_token' })
  async refreshToken(
    @Payload() refreshToken: RefreshTokenDto,
  ): Promise<TokenResponseDto> {
    return await this.authService.refreshTokens(refreshToken);
  }

  @MessagePattern({ cmd: 'logout' })
  async logout(@Payload() refreshToken: LogoutDto): Promise<LogoutResponseDto> {
    return await this.authService.logout(refreshToken);
  }
}
