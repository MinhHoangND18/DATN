import { ERole } from '@/role/enum/roles.enum';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as exc from '@base/api/exception.reslover';
import { UserService } from '@/user/user.service';
import { LoginDto, LoginUserDto, RegisterDto } from './dtos/auth.dto';
import { IJWTPayload } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.comparePassword(pass)) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(dto: LoginDto): Promise<any> {
    const { username, password } = dto;

    const user = await this.userService.findByUsername(username);

    if (!user || !user.comparePassword(password))
      throw new exc.BadExcetion({
        message: 'username or password does not exists',
      });

    if (user.role !== ERole.SUPER_ADMIN && !user.active) {
      throw new exc.BadExcetion({ message: 'Tài khoản đã bị khóa' });
    }

    const payload: IJWTPayload = {
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      ...user,
      accessToken: accessToken,
    };
  }

  async loginUser(dto: LoginUserDto): Promise<any> {
    const { email, password } = dto;

    const user = await this.userService.findByEmail(email);

    if (!user || !user.comparePassword(password))
      throw new exc.BadExcetion({
        message: 'email hoặc mật khẩu không đúng',
      });

    if (!user.active) {
      throw new exc.BadExcetion({ message: 'Tài khoản đã bị khóa' });
    }

    const payload: IJWTPayload = {
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      ...user,
      accessToken: accessToken,
    };
  }

  async register(dto: RegisterDto) {
    const user = await this.userService.register(dto);
    const payload: IJWTPayload = {
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      ...user,
      accessToken,
    };
  }
}
