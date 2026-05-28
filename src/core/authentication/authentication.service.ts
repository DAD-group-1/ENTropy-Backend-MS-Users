import { HttpStatus, Injectable } from '@nestjs/common';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { RefreshToken } from './entities/refresh_token.entity';
import { RefreshTokenDto, TokenResponseDto } from '@dad-group-1/backend-common';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async refreshTokens(token: RefreshTokenDto): Promise<TokenResponseDto> {
    const payload = this.jwtService.verify<{ sub: string; email: string }>(
      token.refresh_token,
    );

    if (isNaN(Number(payload.sub))) {
      throw new RpcException({
        message: 'Invalid token payload',
        code: HttpStatus.BAD_REQUEST,
      });
    }

    const activeToken = await this.refreshTokenRepository.findOne({
      where: [
        {
          token: token.refresh_token,
          user_id: Number(payload.sub),
          revoked_at: IsNull(),
          expires_at: MoreThan(new Date()),
        },
        {
          token: token.refresh_token,
          user_id: Number(payload.sub),
          revoked_at: MoreThan(new Date()),
          expires_at: MoreThan(new Date()),
        },
      ],
    });

    if (!activeToken) {
      throw new RpcException({
        message: 'Refresh token revoked or missing',
        code: HttpStatus.UNAUTHORIZED,
      });
    }

    await this.refreshTokenRepository.remove(activeToken);

    const accessToken = this.jwtService.sign({
      sub: payload.sub,
      email: payload.email,
    });
    const refreshToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email },
      {
        expiresIn: this.configService.getOrThrow(
          'JWT_REFRESH_TOKEN_EXPIRES_IN',
        ),
      },
    );

    const expiresInMs = ms(
      this.configService.getOrThrow<string>(
        'JWT_REFRESH_TOKEN_EXPIRES_IN',
      ) as ms.StringValue,
    );

    const expiresAt = new Date(Date.now() + expiresInMs);

    const newTokenEntity = this.refreshTokenRepository.create({
      user_id: Number(payload.sub),
      token: refreshToken,
      expires_at: expiresAt,
    });

    await this.refreshTokenRepository.save(newTokenEntity);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async validateUser(email: string, pass: string): Promise<Partial<User>> {
    const user = await this.usersRepository.findOneBy({ email: email });

    if (
      user === null ||
      user === undefined ||
      !(await bcrypt.compare(pass, user.password))
    ) {
      throw new RpcException({
        message: 'Invalid credentials',
        code: HttpStatus.UNAUTHORIZED,
      });
    }

    const { password, ...result } = user;
    return result;
  }

  async login(user: Partial<User>): Promise<TokenResponseDto> {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRES_IN'),
    });

    const expiresInMs = ms(
      this.configService.getOrThrow<string>(
        'JWT_REFRESH_TOKEN_EXPIRES_IN',
      ) as ms.StringValue,
    );

    const expiresAt = new Date(Date.now() + expiresInMs);

    try {
      const refreshTokenEntity = this.refreshTokenRepository.create({
        user_id: user.id,
        token: refreshToken,
        expires_at: expiresAt,
      });

      await this.refreshTokenRepository.save(refreshTokenEntity);
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Failed to create refresh token',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return { access_token: accessToken, refresh_token: refreshToken };
  }
}
