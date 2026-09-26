import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { CurrentUser } from "../auth/current-user";
import { AuthUser, JwtGuard } from "../auth/jwt.guard";
import { CreateVehicleDto, UpdateVehicleDto } from "./dto";

const DRIVER_ROLES = ["PRIVATE_DRIVER", "PROFESSIONAL_DRIVER"];

@Controller("me/vehicles")
@UseGuards(JwtGuard)
export class VehiclesController {
  constructor(private readonly db: PrismaService) {}

  private assertDriver(me: AuthUser): void {
    if (!DRIVER_ROLES.includes(me.role)) {
      throw new ForbiddenException("Switch to a driver account first (PATCH /me)");
    }
  }

  @Get()
  list(@CurrentUser() me: AuthUser) {
    this.assertDriver(me);
    return this.db.vehicle.findMany({ where: { driverId: me.userId }, orderBy: { createdAt: "desc" } });
  }

  @Post()
  async create(@CurrentUser() me: AuthUser, @Body() dto: CreateVehicleDto) {
    this.assertDriver(me);
    try {
      return await this.db.vehicle.create({
        data: {
          driverId: me.userId,
          make: dto.make,
          model: dto.model,
          colour: dto.colour,
          plate: dto.plate.toUpperCase(),
          category: dto.category,
          capacity: dto.seats,
          photos: dto.photos ?? [],
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("That plate number is already registered");
      }
      throw e;
    }
  }

  @Patch(":id")
  async update(@CurrentUser() me: AuthUser, @Param("id") id: string, @Body() dto: UpdateVehicleDto) {
    const vehicle = await this.db.vehicle.findFirst({ where: { id, driverId: me.userId } });
    if (!vehicle) throw new NotFoundException("Car not found");
    return this.db.vehicle.update({
      where: { id },
      data: { colour: dto.colour, capacity: dto.seats, photos: dto.photos },
    });
  }

  @Delete(":id")
  async remove(@CurrentUser() me: AuthUser, @Param("id") id: string) {
    const vehicle = await this.db.vehicle.findFirst({ where: { id, driverId: me.userId } });
    if (!vehicle) throw new NotFoundException("Car not found");
    await this.db.vehicle.delete({ where: { id } });
    return { deleted: true };
  }
}
