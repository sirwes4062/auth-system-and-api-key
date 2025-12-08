import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiKeysService } from '../api-keys/api-keys.service';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ApiKey } from '../api-keys/interfaces/api-key.interface';

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
  service?: ApiKey;
  authType?: 'user' | 'service';
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly apiKeysService: ApiKeysService,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    // 🔥 FIX: normalize API key header to string
    const rawApiKey = req.headers['x-api-key'];
    const apiKeyHeader = Array.isArray(rawApiKey) ? rawApiKey[0] : rawApiKey;

    // 1️⃣ API KEY CHECK
    if (apiKeyHeader) {
      const apiKey = await this.apiKeysService.validateKey(apiKeyHeader);
      if (!apiKey) {
        return res.status(401).json({ message: 'Invalid API key' });
      }

      req.authType = 'service';
      req.service = apiKey;
      return next();
    }

    // 2️⃣ JWT CHECK
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

        req.authType = 'user';
        req.user = payload;
        return next();
      } catch (error) {
        console.error('JWT verification error:', error);
        return res.status(401).json({ message: 'Invalid token' });
      }
    }

    // 3️⃣ NO AUTH
    return res.status(401).json({ message: 'No authentication provided' });
  }
}
