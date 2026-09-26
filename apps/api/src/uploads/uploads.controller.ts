import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/current-user";
import { AuthUser, JwtGuard } from "../auth/jwt.guard";
import { S3Service } from "./s3.service";

@Controller("uploads")
@UseGuards(JwtGuard)
export class UploadsController {
  constructor(private readonly s3: S3Service) {}

  /** Get a short-lived link to upload one photo (car, ID, evidence). */
  @Get("presigned")
  presigned(@CurrentUser() me: AuthUser, @Query("filename") filename: string) {
    return this.s3.presignedUpload(me.userId, filename || "photo.jpg");
  }
}
