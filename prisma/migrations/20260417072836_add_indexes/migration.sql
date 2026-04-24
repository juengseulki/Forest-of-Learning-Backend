-- CreateIndex
CREATE INDEX "FocusSession_studyId_startedAt_idx" ON "FocusSession"("studyId", "startedAt");

-- CreateIndex
CREATE INDEX "Habit_studyId_idx" ON "Habit"("studyId");

-- CreateIndex
CREATE INDEX "HabitRecord_date_idx" ON "HabitRecord"("date");

-- CreateIndex
CREATE INDEX "Study_backgroundId_idx" ON "Study"("backgroundId");

-- CreateIndex
CREATE INDEX "Study_createdAt_idx" ON "Study"("createdAt");

-- CreateIndex
CREATE INDEX "Study_name_idx" ON "Study"("name");
