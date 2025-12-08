import type { Request } from 'express';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import type { ApiKey } from '../api-keys/interfaces/api-key.interface';

export interface AuthRequest extends Request {
  authType?: 'user' | 'service';
  user?: JwtPayload | null;
  service?: ApiKey | null;
}
