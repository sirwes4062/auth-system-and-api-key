import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto, LoginDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // ------------------ SIGNUP ------------------
  async signup(dto: SignupDto) {
    // Check if user already exists
    const existingUser: User | null = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user in DB
    const newUser: User = await this.prisma.user.create({
      data: {
        fullName: dto.fullName, // TypeScript knows this is string
        email: dto.email,
        password: hashedPassword,
      },
    });

    // Return success message + userId
    return { message: 'User created successfully', userId: newUser.id };
  }

  // ------------------ LOGIN ------------------
  async login(dto: LoginDto) {
    // Find user in DB
    const user: User | null = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Compare password
    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    // Generate JWT (omit fullName for privacy)
    const token = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
    });

    // Return token + user info (including fullName for frontend)
    return {
      access_token: token,
      user: {
        id: user.id,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        fullName: user.fullName,
        email: user.email,
      },
    };
  }
}
