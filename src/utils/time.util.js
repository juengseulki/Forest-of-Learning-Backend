import { AppError } from './AppError.js';

export function calculateActualMinutes(sessionData, completedAt) {
  const startedAtMs = new Date(sessionData.startedAt).getTime();
  const completedAtMs = completedAt.getTime();

  if (Number.isNaN(startedAtMs) || Number.isNaN(completedAtMs)) {
    throw new AppError('잘못된 시간 데이터입니다.', 400, 'INVALID_TIME');
  }

  const totalPausedMs = Number(sessionData.totalPausedMs ?? 0);

  if (!Number.isFinite(totalPausedMs) || totalPausedMs < 0) {
    throw new AppError(
      '잘못된 일시정지 시간입니다.',
      400,
      'INVALID_PAUSED_TIME'
    );
  }

  const actualMs = completedAtMs - startedAtMs - totalPausedMs;

  if (actualMs < 0) {
    throw new AppError(
      '집중 시간 계산 결과가 올바르지 않습니다.',
      400,
      'INVALID_DURATION'
    );
  }

  return Math.floor(actualMs / 60000);
}
