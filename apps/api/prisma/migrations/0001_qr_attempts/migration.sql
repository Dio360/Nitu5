-- CreateTable
CREATE TABLE "QrAttempt" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QrAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QrAttempt_bookingId_createdAt_idx" ON "QrAttempt"("bookingId", "createdAt");
