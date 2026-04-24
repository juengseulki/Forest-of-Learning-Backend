import prisma from '../lib/prisma.js';

export const findPointByStudyId = async (studyId) => {
  return await prisma.point.findUnique({ where: { studyId } });
};

export const findPointLogsByStudyId = async (studyId) => {
  return await prisma.pointLog.findMany({
    where: { studyId },
    include: {
      focusSession: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const addPointsWithLog = async (
  studyId,
  amount,
  reason = 'ETC',
  focusSessionId = null
) => {
  return await prisma.$transaction(async (tx) => {
    const point = await tx.point.upsert({
      where: { studyId },
      create: { studyId, totalPoint: amount },
      update: { totalPoint: { increment: amount } },
    });

    await tx.pointLog.create({
      data: {
        studyId,
        amount,
        reason,
        focusSessionId: focusSessionId ? Number(focusSessionId) : null,
      },
    });

    return point;
  });
};
