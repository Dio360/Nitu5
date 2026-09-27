import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { CurrentUser } from "../auth/current-user";
import { AuthUser, JwtGuard } from "../auth/jwt.guard";
import { CounterDto, CreateBookingDto } from "./dto";

@Controller("bookings")
@UseGuards(JwtGuard)
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  /** Rider offers a price for seats. */
  @Post()
  offer(@CurrentUser() me: AuthUser, @Body() dto: CreateBookingDto) {
    return this.bookings.offer(me.userId, { ...dto });
  }

  @Get("mine")
  mine(@CurrentUser() me: AuthUser) {
    return this.bookings.riderBookings(me.userId);
  }

  @Get("offers/mine")
  offersMine(@CurrentUser() me: AuthUser) {
    return this.bookings.driverOffers(me.userId);
  }

  /** Driver accepts the rider's offer — seats reserved. */
  @Post(":id/accept")
  accept(@CurrentUser() me: AuthUser, @Param("id") id: string) {
    return this.bookings.accept(me.userId, id);
  }

  /** Rider agrees to the driver's counter — seats reserved. */
  @Post(":id/agree")
  agree(@CurrentUser() me: AuthUser, @Param("id") id: string) {
    return this.bookings.agree(me.userId, id);
  }

  @Post(":id/counter")
  counter(@CurrentUser() me: AuthUser, @Param("id") id: string, @Body() dto: CounterDto) {
    return this.bookings.counter(me.userId, id, dto.amountKobo);
  }

  @Post(":id/decline")
  decline(@CurrentUser() me: AuthUser, @Param("id") id: string) {
    return this.bookings.decline(me.userId, id);
  }

  @Post(":id/cancel")
  cancel(@CurrentUser() me: AuthUser, @Param("id") id: string) {
    return this.bookings.riderCancel(me.userId, id);
  }

  @Get(":id/history")
  history(@Param("id") id: string) {
    return this.bookings.history(id);
  }
}
