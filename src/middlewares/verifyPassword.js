import prisma from '../lib/prisma.js';
import { fail } from '../utils/response.js';

export const verifyStudyPasswordByStudyId = (req, res, next) => {
  const studyId = Number(req.params.studyId);

  if (Number.isNaN(studyId)) {
    return fail(res, 'VALIDATION_ERROR', '유효한 studyId가 아닙니다.', 400);
  }

  if (req.session?.verifiedStudies?.includes(studyId)) {
    return next();
  }

  return fail(res, 'UNAUTHORIZED', '스터디 비밀번호 인증이 필요합니다.', 401);
};

export const verifyStudyPasswordByHabitId = async (req, res, next) => {
  try {
    const habitId = Number(req.params.habitId);

    if (Number.isNaN(habitId)) {
      return fail(res, 'VALIDATION_ERROR', '유효한 habitId가 아닙니다.', 400);
    }

    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
      select: { studyId: true },
    });

    if (!habit) {
      return fail(res, 'NOT_FOUND', '습관을 찾을 수 없습니다.', 404);
    }

    if (req.session?.verifiedStudies?.includes(habit.studyId)) {
      return next();
    }

    return fail(res, 'UNAUTHORIZED', '스터디 비밀번호 인증이 필요합니다.', 401);
  } catch (err) {
    next(err);
  }
};
