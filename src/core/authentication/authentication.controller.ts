import { Controller, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(AuthenticationController.name);
  constructor(private authService: AuthenticationService) {}

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() data: LoginDto): Promise<TokenResponseDto> {
    this.logger.log(`Login attempt for email: ${data.email}`);
    return this.authService.login(data.email, data.password);
  }

  @MessagePattern({ cmd: 'refresh_token' })
  async refreshToken(
    @Payload() refreshToken: RefreshTokenDto,
  ): Promise<TokenResponseDto> {
    this.logger.log(`Refreshing token for user`);
    return await this.authService.refreshTokens(refreshToken);
  }

  @MessagePattern({ cmd: 'logout' })
  async logout(@Payload() refreshToken: LogoutDto): Promise<LogoutResponseDto> {
    this.logger.log(`Logout attempt for user`);
    return await this.authService.logout(refreshToken);
  }
}
