import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto, LoginDto } from './dto';
import { User } from './interfaces/user.interface';



@Injectable()
export class AuthService {
  private users: User[] = [];

  constructor(private jwt: JwtService) {}

  async signup(dto: SignupDto) {
    const userExists = this.users.find((u) => u.email === dto.email);
    if (userExists) throw new BadRequestException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);

    const newUser: User = {
      id: Date.now(),
      fullName: dto.fullName,
      email: dto.email,
      password: hashed,
    };

    this.users.push(newUser);

    return { message: 'User created successfully' };
  }

  async login(dto: LoginDto) {
    const user = this.users.find((u) => u.email === dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    };
  }
}
