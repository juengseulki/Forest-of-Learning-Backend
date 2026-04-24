import { fail } from '../utils/response.js';

// 비밀번호 규칙: 5~20자, 영문+숫자 조합
const PASSWORD_MIN = 5;
const PASSWORD_MAX = 20;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{5,20}$/;

const isValidPassword = (password) =>
  typeof password === 'string' && PASSWORD_REGEX.test(password);

export const validateCreateStudy = (req, res, next) => {
  const { nickname, name, backgroundId, password, passwordConfirm } = req.body;

  if (!nickname || !name || !backgroundId || !password || !passwordConfirm) {
    return fail(
      res,
      'VALIDATION_ERROR',
      '필수 항목이 누락되었습니다. (nickname, name, backgroundId, password, passwordConfirm)',
      400
    );
  }

  if (!isValidPassword(password)) {
    return fail(
      res,
      'VALIDATION_ERROR',
      `비밀번호는 ${PASSWORD_MIN}~${PASSWORD_MAX}자이며 영문과 숫자를 각각 하나 이상 포함해야 합니다.`,
      400
    );
  }

  if (password !== passwordConfirm) {
    return fail(
      res,
      'VALIDATION_ERROR',
      '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
      400
    );
  }

  next();
};

export const validateUpdateStudy = (req, res, next) => {
  const { nickname, name, backgroundId } = req.body;

  if (!nickname || !name || !backgroundId) {
    return fail(
      res,
      'VALIDATION_ERROR',
      '필수 항목이 누락되었습니다. (nickname, name, backgroundId)',
      400
    );
  }

  next();
};

export const validateDeleteStudy = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return fail(res, 'VALIDATION_ERROR', '비밀번호를 입력해 주세요.', 400);
  }

  next();
};
