import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthUser } from "../auth/jwt.guard";

const STAFF = ["ADMIN", "SUPPORT"];

/** Staff only — your account needs an ADMIN or SUPPORT role. */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{ headers: Record<string, string>; user?: AuthUser }>();
    const [scheme, token] = (req.headers.authorization ?? "").split(" ");
    if (scheme !== "Bearer" || !token) throw new ForbiddenException("Staff login needed");
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; phone: string; role: string }>(token);
      if (!STAFF.includes(payload.role)) throw new Error("not staff");
      req.user = { userId: payload.sub, phone: payload.phone, role: payload.role };
      return true;
    } catch {
      throw new ForbiddenException("Staff only");
    }
  }
}
