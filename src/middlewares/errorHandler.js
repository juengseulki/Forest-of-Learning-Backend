import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError.js';

export default (err, _req, res, _next) => {
  // Prisma 에러 분기
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          error: { code: 'DUPLICATE', message: '이미 존재하는 데이터입니다.' },
        });
      case 'P2025':
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: '데이터를 찾을 수 없습니다.' },
        });
      case 'P2003':
        return res.status(400).json({
          error: { code: 'FOREIGN_KEY_VIOLATION', message: '참조하는 데이터가 존재하지 않습니다.' },
        });
      default:
        if (process.env.NODE_ENV !== 'production') {
          console.error('[Prisma Known Error]', err.code, err.message);
        }
        return res.status(500).json({
          error: { code: 'DB_ERROR', message: '데이터베이스 오류가 발생했습니다.' },
        });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: '잘못된 요청 데이터입니다.' },
    });
  }

  // AppError 분기
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message },
    });
  }

  // 그 외 알 수 없는 에러
  if (process.env.NODE_ENV !== 'production') {
    console.error('[Unhandled Error]', err);
  }

  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다.' },
  });
};
