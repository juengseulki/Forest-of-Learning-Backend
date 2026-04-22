import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { fail } from '../utils/response.js';

function extractToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.slice(7);
}

export const verifyStudyPasswordByStudyId = (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return fail(
        res,
        'UNAUTHORIZED',
        '스터디 비밀번호 인증이 필요합니다.',
        401
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studyId = Number(req.params.studyId);

    if (decoded.type !== 'study-auth' || decoded.studyId !== studyId) {
      return fail(
        res,
        'UNAUTHORIZED',
        '스터디 비밀번호 인증이 필요합니다.',
        401
      );
    }

    next();
  } catch (err) {
    return fail(res, 'UNAUTHORIZED', '스터디 비밀번호 인증이 필요합니다.', 401);
  }
};

export const verifyStudyPasswordByHabitId = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return fail(
        res,
        'UNAUTHORIZED',
        '스터디 비밀번호 인증이 필요합니다.',
        401
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const habitId = Number(req.params.habitId);
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
      select: { studyId: true },
    });

    if (!habit) {
      return fail(res, 'NOT_FOUND', '습관을 찾을 수 없습니다.', 404);
    }

    if (decoded.type !== 'study-auth' || decoded.studyId !== habit.studyId) {
      return fail(
        res,
        'UNAUTHORIZED',
        '스터디 비밀번호 인증이 필요합니다.',
        401
      );
    }

    next();
  } catch (err) {
    return fail(res, 'UNAUTHORIZED', '스터디 비밀번호 인증이 필요합니다.', 401);
  }
};
