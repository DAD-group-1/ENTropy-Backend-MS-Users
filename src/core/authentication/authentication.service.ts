import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { LoginResponseDto } from '@dad-group-1/backend-common';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

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

  login(user: Partial<User>): LoginResponseDto {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      email: email,
      password: hashedPassword,
      is_active: true,
    });

    return this.usersRepository.save(newUser);
  }
}
