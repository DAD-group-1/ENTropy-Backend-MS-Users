import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, IsNull, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { RefreshToken } from './entities/refresh_token.entity';
import {
  LogoutDto,
  LogoutResponseDto,
  RefreshTokenDto,
  TokenResponseDto,
} from '@dad-group-1/backend-common';
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
    private dataSource: DataSource,
  ) {}

  async refreshTokens(token: RefreshTokenDto): Promise<TokenResponseDto> {
    let payload: { sub: string; email: string; data?: { roles: string[] } };

    try {
      payload = this.jwtService.verify<{
        sub: string;
        email: string;
        data?: { roles: string[] };
      }>(token.refresh_token);
    } catch {
      throw new RpcException({
        message: 'Invalid or expired refresh token',
        code: HttpStatus.UNAUTHORIZED,
      });
    }

    if (isNaN(Number(payload.sub))) {
      throw new RpcException({
        message: 'Invalid token payload',
        code: HttpStatus.BAD_REQUEST,
      });
    }

    // Start the atomic transaction
    return await this.dataSource.transaction(async (manager) => {
      const activeToken = await manager.findOne(RefreshToken, {
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
        lock: { mode: 'pessimistic_write' }, // Prevents concurrent 'refresh' attacks
      });

      if (!activeToken) {
        throw new RpcException({
          message: 'Refresh token revoked or missing',
          code: HttpStatus.UNAUTHORIZED,
        });
      }

      await manager.remove(activeToken);

      // Re-fetch the user with roles to keep the token up-to-date
      const userEntity = await manager.findOne(User, {
        where: { id: Number(payload.sub) },
        relations: { role: true },
      });

      if (!userEntity) {
        throw new RpcException({
          message: 'User not found',
          code: HttpStatus.UNAUTHORIZED,
        });
      }

      const newPayload = {
        sub: payload.sub,
        email: payload.email,
        data: { role: userEntity.role.name },
      };

      const accessToken = this.jwtService.sign(newPayload);
      const refreshToken = this.jwtService.sign(newPayload, {
        expiresIn: this.configService.getOrThrow(
          'JWT_REFRESH_TOKEN_EXPIRES_IN',
        ),
      });

      const expiresInMs = ms(
        this.configService.getOrThrow<string>(
          'JWT_REFRESH_TOKEN_EXPIRES_IN',
        ) as ms.StringValue,
      );
      const expiresAt = new Date(Date.now() + expiresInMs);

      const newTokenEntity = manager.create(RefreshToken, {
        user_id: Number(payload.sub),
        token: refreshToken,
        expires_at: expiresAt,
      });

      await manager.save(newTokenEntity);

      return {
        user_id: Number(payload.sub),
        email: payload.email,
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    });
  }

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
      relations: { role: true },
    });

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

    return user;
  }

  async login(email: string, password: string): Promise<TokenResponseDto> {
    const userEntity = await this.validateUser(email, password);
    if (!userEntity) {
      throw new RpcException({
        message: 'Invalid credentials',
        code: HttpStatus.UNAUTHORIZED,
      });
    }

    const payload = {
      sub: userEntity.id,
      email: userEntity.email,
      data: { role: userEntity.role.name },
    };
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
        user_id: payload.sub,
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

    return {
      user_id: payload.sub,
      email: payload.email,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async logout(refreshToken: LogoutDto): Promise<LogoutResponseDto> {
    try {
      const refresh_token = await this.refreshTokenRepository.findOneBy({
        token: refreshToken.refresh_token,
      });

      if (!refresh_token) {
        throw new RpcException({
          message: 'Refresh token expired or not found',
          code: HttpStatus.UNAUTHORIZED,
        });
      }

      await this.refreshTokenRepository.remove(refresh_token);
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Failed to delete refresh token',
        code: error.code || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
    return { message: 'Logged out successfully' };
  }
}
