import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AppController } from "./app.controller";
import { PrismaService } from "./prisma.service";
import { OtpService } from "./auth/otp.service";
import { AuthService } from "./auth/auth.service";
import { AuthController } from "./auth/auth.controller";
import { UsersController } from "./users/users.controller";
import { VehiclesController } from "./vehicles/vehicles.controller";
import { UploadsController } from "./uploads/uploads.controller";
import { S3Service } from "./uploads/s3.service";
import { TripsController } from "./trips/trips.controller";
import { GeocodeService } from "./trips/geocode.service";
import { VerificationController } from "./verification/verification.controller";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? "dev-secret-change-me",
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    VehiclesController,
    UploadsController,
    TripsController,
    VerificationController,
  ],
  providers: [PrismaService, OtpService, AuthService, S3Service, GeocodeService],
})
export class AppModule {}
