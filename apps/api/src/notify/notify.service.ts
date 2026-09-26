import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

/** In-app alerts. Push/SMS plug in later — the list already works. */
@Injectable()
export class NotifyService {
  constructor(private readonly db: PrismaService) {}

  async notify(userId: string, template: string, payload: Record<string, unknown> = {}): Promise<void> {
    await this.db.notification.create({
      data: { userId, channel: "IN_APP", template, payload: payload as never },
    });
  }
}
