export interface JwtPayload {
  sub: string; // user ID
  email: string;
  fullName?: string; // optional
  // add other properties if needed, e.g., role?: string
}
