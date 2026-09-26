import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomBytes } from "crypto";
import { PrismaService } from "../prisma.service";
import { NotifyService } from "../notify/notify.service";

/**
 * Nitu5 QR check-in: Scan → Match → Confirm → Start (PRD §20).
 * Driver shows one code per trip; each rider scans it for their booking.
 * Two failed scans block the session and raise a safety flag.
 */
@Injectable()
export class QrService {
  constructor(
    private readonly db: PrismaService,
    private readonly notify: NotifyService,
  ) {}

  async createSession(driverId: string, tripId: string) {
    const trip = await this.db.trip.findFirst({ where: { id: tripId, driverId } });
    if (!trip) throw new NotFoundException("Trip not found");
    const existing = await this.db.qrSession.findFirst({
      where: { tripId, verdict: { in: ["PENDING", "PASSED"] }, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
    if (existing) return { sessionId: existing.id, code: `N5-${existing.nonce}` };
    const nonce = randomBytes(4).toString("hex");
    const session = await this.db.qrSession.create({
      data: {
        tripId,
        nonce,
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
      },
    });
    return { sessionId: session.id, code: `N5-${nonce}` };
  }

  async verify(userId: string, code: string, bookingId: string) {
    const nonce = code.startsWith("N5-") ? code.slice(3) : code;
    const booking = await this.db.booking.findUnique({
      where: { id: bookingId },
      include: { trip: true },
    });
    if (!booking || booking.riderId !== userId) throw new NotFoundException("Booking not found");

    // Two strikes (15 min) on one booking = locked until safety reviews.
    const since = new Date(Date.now() - 15 * 60 * 1000);
    const strikes = await this.db.qrAttempt.count({ where: { bookingId, createdAt: { gte: since } } });
    if (strikes >= 2) {
      throw new BadRequestException("Blocked after 2 failed scans — safety team notified");
    }

    const session = await this.db.qrSession.findUnique({ where: { nonce } });
    const fail = async (reason: string) => {
      await this.db.qrAttempt.create({ data: { bookingId } });
      const total = strikes + 1;
      if (total >= 2) {
        const open = await this.db.safetyReport.findFirst({
          where: { tripId: booking.tripId, reporterId: userId, category: "QR_MISMATCH", status: "OPEN" },
        });
        if (!open) {
          await this.db.safetyReport.create({
            data: {
              tripId: booking.tripId,
              reporterId: userId,
              category: "QR_MISMATCH",
              severity: "high",
              slaDueAt: new Date(Date.now() + 5 * 60 * 1000),
            },
          });
          await this.notify.notify(userId, "QR_BLOCKED", { bookingId, tripId: booking.tripId });
        }
        throw new BadRequestException("Blocked after 2 failed scans — safety team notified");
      }
      throw new BadRequestException(reason);
    };

    if (!session) return fail("Wrong QR — ask the driver to show the trip code again");
    if (session.expiresAt < new Date()) return fail("This QR expired — driver should make a new one");
    if (session.tripId !== booking.tripId) return fail("This QR is for a different trip");
    if (booking.status !== "CONFIRMED") return fail(`Booking is ${booking.status} — nothing to check in`);

    await this.db.qrSession.update({ where: { id: session.id }, data: { verdict: "PASSED" } });
    const updated = await this.db.booking.update({ where: { id: bookingId }, data: { status: "QR_VERIFIED" } });
    return { checkedIn: true, booking: updated };
  }

  async driverConfirm(driverId: string, bookingId: string) {
    const booking = await this.db.booking.findUnique({
      where: { id: bookingId },
      include: { trip: true },
    });
    if (!booking || booking.trip.driverId !== driverId) {
      throw new ForbiddenException("Not your trip");
    }
    if (booking.status !== "CONFIRMED") throw new BadRequestException(`Booking is ${booking.status}`);
    return this.db.booking.update({ where: { id: bookingId }, data: { status: "QR_VERIFIED" } });
  }
}
