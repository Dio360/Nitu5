import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Controller()
export class AppController {
  constructor(private readonly db: PrismaService) {}

  @Get("health")
  health(): { ok: boolean; service: string } {
    return { ok: true, service: "nitu5-api" };
  }

  @Get("ready")
  async ready(): Promise<{ ok: boolean; db: boolean }> {
    await this.db.$queryRaw`SELECT 1`;
    return { ok: true, db: true };
  }
}
