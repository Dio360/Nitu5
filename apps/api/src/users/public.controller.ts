import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

/** Public trust profile — visible before anyone books (PRD §24). */
@Controller("users")
export class PublicUsersController {
  constructor(private readonly db: PrismaService) {}

  @Get(":id")
  async profile(@Param("id") id: string) {
    const user = await this.db.user.findUnique({
      where: { id },
      select: {
        firstName: true,
        rating: true,
        tripsCompleted: true,
        verificationTier: true,
        driverType: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException("User not found");
    return { ...user, memberSince: user.createdAt };
  }
}
