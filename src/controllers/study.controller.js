import jwt from 'jsonwebtoken';
import * as studyService from '../services/study.service.js';
import { success, fail } from '../utils/response.js';

export const createStudy = async (req, res, next) => {
  try {
    const {
      nickname,
      name,
      description,
      backgroundId,
      password,
      passwordConfirm,
    } = req.body;

    if (!nickname || !name || !backgroundId || !password || !passwordConfirm) {
      return fail(res, 'VALIDATION_ERROR', '필수 항목이 누락되었습니다.', 400);
    }

    if (password !== passwordConfirm) {
      return fail(
        res,
        'VALIDATION_ERROR',
        '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
        400
      );
    }

    const study = await studyService.createStudy({
      nickname,
      name,
      description,
      backgroundId: Number(backgroundId),
      password,
    });

    success(res, study, 'created', 201);
  } catch (err) {
    next(err);
  }
};

const VALID_ORDERS = ['latest', 'oldest', 'pointDesc', 'pointAsc'];
const MAX_LIMIT = 1000;

export const getStudies = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, keyword = '', order = 'latest' } = req.query;

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      return fail(
        res,
        'VALIDATION_ERROR',
        'page는 1 이상의 정수여야 합니다.',
        400
      );
    }
    if (
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1 ||
      parsedLimit > MAX_LIMIT
    ) {
      return fail(
        res,
        'VALIDATION_ERROR',
        `limit는 1~${MAX_LIMIT} 사이여야 합니다.`,
        400
      );
    }

    const resolvedOrder = order || 'latest';
    if (!VALID_ORDERS.includes(resolvedOrder)) {
      return fail(
        res,
        'VALIDATION_ERROR',
        `order는 ${VALID_ORDERS.join(', ')} 중 하나여야 합니다.`,
        400
      );
    }

    const result = await studyService.findAllStudies({
      page: parsedPage,
      limit: parsedLimit,
      keyword,
      order: resolvedOrder,
    });

    success(res, result);
  } catch (err) {
    next(err);
  }
};

export const getStudyById = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const study = await studyService.findStudyById(Number(studyId));

    if (!study) {
      return fail(res, 'NOT_FOUND', '해당 스터디를 찾을 수 없습니다.', 404);
    }

    success(res, study);
  } catch (err) {
    next(err);
  }
};

export const verifyStudyPassword = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const { password } = req.body;

    if (!password) {
      return fail(res, 'VALIDATION_ERROR', '비밀번호를 입력해주세요.', 400);
    }

    const numericStudyId = Number(studyId);

    const result = await studyService.verifyStudyPassword(
      numericStudyId,
      password
    );

    if (result?.error === 'NOT_FOUND') {
      return fail(res, 'NOT_FOUND', '스터디가 존재하지 않습니다.', 404);
    }

    if (result?.error === 'INVALID_PASSWORD') {
      return fail(
        res,
        'VALIDATION_ERROR',
        '비밀번호가 일치하지 않습니다.',
        400
      );
    }

    const token = jwt.sign(
      {
        type: 'study-auth',
        studyId: numericStudyId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    success(res, { verified: true, token }, '비밀번호 확인 성공');
  } catch (err) {
    next(err);
  }
};

export const checkStudySession = (req, res) => {
  const studyId = Number(req.params.studyId);
  const verified = req.session.verifiedStudies?.includes(studyId) ?? false;
  return success(res, { verified });
};

export const updateStudy = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const { nickname, name, description, backgroundId } = req.body;

    if (!nickname || !name || !backgroundId) {
      return fail(res, 'VALIDATION_ERROR', '필수 항목이 누락되었습니다.', 400);
    }

    const result = await studyService.updateStudy(Number(studyId), {
      nickname,
      name,
      description,
      backgroundId,
    });

    if (result?.error === 'NOT_FOUND') {
      return fail(res, 'NOT_FOUND', '스터디가 존재하지 않습니다.', 404);
    }

    success(res, result, '스터디가 수정되었습니다.');
  } catch (err) {
    next(err);
  }
};

export const deleteStudy = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const { password } = req.body;

    if (!password) {
      return fail(res, 'VALIDATION_ERROR', '비밀번호를 입력해주세요.', 400);
    }

    const result = await studyService.deleteStudy(Number(studyId), password);

    if (result?.error === 'NOT_FOUND') {
      return fail(res, 'NOT_FOUND', '스터디가 존재하지 않습니다.', 404);
    }

    if (result?.error === 'INVALID_PASSWORD') {
      return fail(
        res,
        'VALIDATION_ERROR',
        '비밀번호가 일치하지 않습니다.',
        400
      );
    }

    success(res, null, 'deleted');
  } catch (err) {
    next(err);
  }
};
