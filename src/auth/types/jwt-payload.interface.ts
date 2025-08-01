export interface JwtPayload {
  sub: number; // user ID
  email: string;
  role: string; // user role/permission
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
