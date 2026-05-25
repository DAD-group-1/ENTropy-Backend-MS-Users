import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import { LoginDto, LoginResponseDto } from '@dad-group-1/backend-common';

@Controller('authentication')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() data: LoginDto): Promise<LoginResponseDto> {
    const user = await this.authService.validateUser(data.email, data.password);
    return this.authService.login(user);
  }
}
