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
import { BookingsController } from "./bookings/bookings.controller";
import { BookingsService } from "./bookings/bookings.service";
import { QrController } from "./qr/qr.controller";
import { QrService } from "./qr/qr.service";
import { SafetyController } from "./safety/safety.controller";
import { WalletController } from "./wallet/wallet.controller";
import { EarningsController } from "./earnings/earnings.controller";
import { RatingsController } from "./ratings/ratings.controller";
import { PublicUsersController } from "./users/public.controller";
import { NotifyService } from "./notify/notify.service";
import { NotificationsController } from "./notify/notifications.controller";
import { DisputesController } from "./disputes/disputes.controller";
import { SupportController } from "./support/support.controller";
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
    BookingsController,
    QrController,
    SafetyController,
    WalletController,
    EarningsController,
    RatingsController,
    PublicUsersController,
    NotificationsController,
    DisputesController,
    SupportController,
  ],
  providers: [PrismaService, OtpService, AuthService, S3Service, GeocodeService, BookingsService, QrService, NotifyService],
})
export class AppModule {}
