import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ApiKey } from './interfaces/api-key.interface';

@Injectable()
export class ApiKeysService {
  private keys: ApiKey[] = [];

  async createKey(serviceName: string) {
    const key = crypto.randomBytes(32).toString('hex');

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const apiKey: ApiKey = {
      id: Date.now(),
      key,
      serviceName,
      expiresAt,
      revoked: false,
    };

    this.keys.push(apiKey);

    return { apiKey: apiKey.key };
  }

  async validateKey(key: string) {
    const found = this.keys.find((k) => k.key === key);

    if (!found || found.revoked) return null;
    if (found.expiresAt < new Date()) return null;

    return found;
  }

  async revokeKey(key: string) {
    const found = this.keys.find((k) => k.key === key);

    if (!found) return { message: 'Key not found' };

    found.revoked = true;
    return { message: 'Key revoked' };
  }
}
