export interface ApiKey {
  id: string;
  key: string;
  userId: string;
  serviceName: string;
  revoked: boolean;
  expiresAt: Date;
  createdAt: Date;
}
