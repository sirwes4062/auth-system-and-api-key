export interface ApiKey {
  id: number;
  key: string;
  serviceName: string;
  expiresAt: Date;
  revoked: boolean;
}
