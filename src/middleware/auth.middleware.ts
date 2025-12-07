import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiKeysService } from '../api-keys/api-keys.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly apiKeysService: ApiKeysService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'];
    const apiKeyHeader = req.headers['x-api-key'];

    // API Key First
    if (apiKeyHeader) {
      const apiKey = await this.apiKeysService.validateKey(apiKeyHeader);
      if (!apiKey) return res.status(401).json({ message: 'Invalid API key' });

      req.authType = 'service';
      req.service = apiKey;
      return next();
    }

    // JWT Token
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const payload = await this.jwtService.verifyAsync(token);

        req.authType = 'user';
        req.user = payload;
        return next();
      } catch {
        return res.status(401).json({ message: 'Invalid token' });
      }
    }

    return res.status(401).json({ message: 'No authentication provided' });
  }
}
