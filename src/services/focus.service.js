import prisma from '../lib/prisma.js';
import { AppError } from '../utils/AppError.js';
import { calculateActualMinutes } from '../utils/time.util.js';
import { calculateFocusRewardPoint } from '../utils/point.util.js';
import { POINT_REASONS } from '../utils/pointReason.js';
import { addPointsWithLog } from './point.service.js';

export async function findFocusByStudyId(studyId) {
  const study = await prisma.study.findUnique({
    where: { id: studyId },
    include: {
      point: true,
      focusSessions: {
        orderBy: { completedAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!study) {
    throw new AppError('해당 스터디를 찾을 수 없습니다.', 404, 'NOT_FOUND');
  }

  return {
    latestSession: study.focusSessions[0] || null,
    totalPoint: study.point?.totalPoint ?? 0,
  };
}

export async function createFocusSessionByStudyId(
  studyId,
  { sessionData, completedAt }
) {
  const study = await prisma.study.findUnique({
    where: { id: studyId },
    select: { id: true },
  });

  if (!study) {
    throw new AppError('해당 스터디를 찾을 수 없습니다.', 404, 'NOT_FOUND');
  }

  const serverCompletedAt = completedAt ? new Date(completedAt) : new Date();

  const durationMinutes = sessionData.durationMinutes;
  const actualMinutes = calculateActualMinutes(sessionData, serverCompletedAt);

  const { totalEarned } = calculateFocusRewardPoint({
    durationMinutes,
    actualMinutes,
  });

  const result = await prisma.$transaction(async (tx) => {
    const focusSession = await tx.focusSession.create({
      data: {
        studyId,
        duration: sessionData.totalTargetSeconds,
        earnedPoint: totalEarned,
        startedAt: new Date(sessionData.startedAt),
        completedAt: serverCompletedAt,
      },
    });

    const point = await addPointsWithLog(
      studyId,
      totalEarned,
      POINT_REASONS.FOCUS_SESSION_COMPLETE,
      focusSession.id,
      tx
    );

    return {
      focusSession,
      totalPoint: point.totalPoint,
    };
  });

  return result;
}
