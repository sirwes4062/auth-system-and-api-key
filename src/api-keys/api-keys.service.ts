import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  async createKey(userId: string, serviceName: string) {
    const key = crypto.randomBytes(32).toString('hex');

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const apiKey = await this.prisma.apiKey.create({
      data: {
        key,
        userId,
        serviceName,
        expiresAt,
        revoked: false,
      },
    });

    return { apiKey: apiKey.key };
  }

  async validateKey(key: string) {
    const apiKey = await this.prisma.apiKey.findUnique({ where: { key } });

    if (!apiKey || apiKey.revoked) return null;
    if (apiKey.expiresAt < new Date()) return null;

    return apiKey;
  }

  async revokeKey(key: string) {
    const apiKey = await this.prisma.apiKey.findUnique({ where: { key } });

    if (!apiKey) return { message: 'Key not found' };

    await this.prisma.apiKey.update({
      where: { key },
      data: { revoked: true },
    });

    return { message: 'Key revoked' };
  }
}
