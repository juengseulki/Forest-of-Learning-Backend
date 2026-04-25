import { AppError } from './AppError.js';

export function calculateFocusRewardPoint({ durationMinutes, actualMinutes }) {
  if (
    !Number.isFinite(durationMinutes) ||
    !Number.isFinite(actualMinutes) ||
    durationMinutes < 0 ||
    actualMinutes < 0
  ) {
    throw new AppError(
      '포인트 계산에 필요한 시간이 올바르지 않습니다.',
      400,
      'INVALID_POINT_TIME'
    );
  }

  const firstRewardPoint =
    actualMinutes >= durationMinutes ? 3 + Math.floor(durationMinutes / 10) : 0;

  const overtimeMinutes = Math.max(actualMinutes - durationMinutes, 0);
  const overtimePoint = Math.floor(overtimeMinutes / 10);

  return {
    firstRewardPoint,
    overtimePoint,
    totalEarned: firstRewardPoint + overtimePoint,
  };
}
