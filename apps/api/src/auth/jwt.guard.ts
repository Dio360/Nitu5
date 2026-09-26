import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

export interface AuthUser {
  userId: string;
  phone: string;
  role: string;
}

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{ headers: Record<string, string>; user?: AuthUser }>();
    const header = req.headers.authorization ?? "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      throw new UnauthorizedException("Log in first (missing token)");
    }
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; phone: string; role: string }>(token);
      req.user = { userId: payload.sub, phone: payload.phone, role: payload.role };
      return true;
    } catch {
      throw new UnauthorizedException("Log in again (bad token)");
    }
  }
}
