import { fail } from '../utils/response.js';

export const numericParams =
  (...names) =>
  (req, res, next) => {
    for (const name of names) {
      const value = req.params?.[name] ?? req.body?.[name] ?? req.query?.[name];
      if (value === undefined || value === null || value === '') {
        return fail(res, 'BAD_REQUEST', `${name}가 필요합니다.`, 400);
      }
      if (Number.isNaN(Number(value))) {
        return fail(res, 'BAD_REQUEST', `${name}는 숫자여야 합니다.`, 400);
      }
    }
    next();
  };
