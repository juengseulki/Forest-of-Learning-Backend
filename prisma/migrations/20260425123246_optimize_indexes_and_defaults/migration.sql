-- DropIndex
DROP INDEX "FocusSession_studyId_startedAt_idx";

-- DropIndex
DROP INDEX "PointLog_studyId_idx";

-- AlterTable
ALTER TABLE "EmojiReaction" ALTER COLUMN "count" SET DEFAULT 0;

-- CreateIndex
CREATE INDEX "FocusSession_studyId_completedAt_idx" ON "FocusSession"("studyId", "completedAt");

-- CreateIndex
CREATE INDEX "PointLog_studyId_createdAt_idx" ON "PointLog"("studyId", "createdAt");
