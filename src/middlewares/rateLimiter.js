import rateLimit from 'express-rate-limit';

// 비밀번호 5회 실패 시 5분간 차단 (성공 요청은 카운트 제외)
export const passwordLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: { code: 'TOO_MANY_REQUESTS', message: '비밀번호를 5회 이상 틀렸습니다. 5분 후 다시 시도해주세요.' },
  },
});
