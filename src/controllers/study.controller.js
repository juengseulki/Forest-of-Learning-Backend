import * as studyService from '../services/study.service.js';
import { success, fail } from '../utils/response.js';

const VALID_ORDERS = ['latest', 'oldest', 'pointDesc', 'pointAsc'];

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

    return success(res, study, 'created', 201);
  } catch (err) {
    next(err);
  }
};

export const getStudies = async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const keyword =
      typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '';
    const order = VALID_ORDERS.includes(req.query.order)
      ? req.query.order
      : 'latest';

    if (!Number.isInteger(page) || page < 1) {
      return fail(
        res,
        'VALIDATION_ERROR',
        'page는 1 이상의 정수여야 합니다.',
        400
      );
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return fail(
        res,
        'VALIDATION_ERROR',
        'limit은 1 이상 100 이하의 정수여야 합니다.',
        400
      );
    }

    const data = await studyService.findAllStudies({
      page,
      limit,
      keyword,
      order,
    });

    return success(res, data);
  } catch (err) {
    next(err);
  }
};

export const getStudyById = async (req, res, next) => {
  try {
    const studyId = Number(req.params.studyId);

    if (Number.isNaN(studyId)) {
      return fail(res, 'VALIDATION_ERROR', '유효한 studyId가 아닙니다.', 400);
    }

    const study = await studyService.findStudyById(studyId);

    if (!study) {
      return fail(res, 'NOT_FOUND', '스터디를 찾을 수 없습니다.', 404);
    }

    return success(res, study);
  } catch (err) {
    next(err);
  }
};

export const verifyStudyPassword = async (req, res, next) => {
  try {
    const studyId = Number(req.params.studyId);
    const { password } = req.body;

    console.log('[verifyStudyPassword] start', { studyId });

    if (Number.isNaN(studyId)) {
      return fail(res, 'VALIDATION_ERROR', '유효한 studyId가 아닙니다.', 400);
    }

    if (!password) {
      return fail(res, 'VALIDATION_ERROR', '비밀번호를 입력해주세요.', 400);
    }

    const study = await studyService.findStudyById(studyId);
    console.log('[verifyStudyPassword] study found:', !!study);

    if (!study) {
      return fail(res, 'NOT_FOUND', '스터디를 찾을 수 없습니다.', 404);
    }

    const result = await studyService.verifyStudyPassword(studyId, password);
    console.log('[verifyStudyPassword] verify result:', result);

    if (result?.error === 'NOT_FOUND') {
      return fail(res, 'NOT_FOUND', '스터디를 찾을 수 없습니다.', 404);
    }

    if (result?.error === 'INVALID_PASSWORD') {
      return fail(res, 'UNAUTHORIZED', '비밀번호가 일치하지 않습니다.', 401);
    }

    req.session.verifiedStudies = req.session.verifiedStudies || [];

    if (!req.session.verifiedStudies.includes(studyId)) {
      req.session.verifiedStudies.push(studyId);
    }

    console.log(
      '[verifyStudyPassword] before session.save',
      req.session.verifiedStudies
    );

    req.session.save((err) => {
      if (err) {
        console.error('[verifyStudyPassword] session save error:', err);
        return next(err);
      }

      console.log('[verifyStudyPassword] session saved');
      return success(
        res,
        { studyId, verified: true },
        '비밀번호 인증에 성공했습니다.',
        200
      );
    });
  } catch (err) {
    console.error('[verifyStudyPassword] catch error:', err);
    next(err);
  }
};

export const checkStudySession = async (req, res, next) => {
  try {
    const studyId = Number(req.params.studyId);

    if (Number.isNaN(studyId)) {
      return fail(res, 'VALIDATION_ERROR', '유효한 studyId가 아닙니다.', 400);
    }

    const verified =
      Array.isArray(req.session?.verifiedStudies) &&
      req.session.verifiedStudies.includes(studyId);

    return success(res, { studyId, verified });
  } catch (err) {
    next(err);
  }
};

export const updateStudy = async (req, res, next) => {
  try {
    const studyId = Number(req.params.studyId);

    if (Number.isNaN(studyId)) {
      return fail(res, 'VALIDATION_ERROR', '유효한 studyId가 아닙니다.', 400);
    }

    const data = {
      nickname: req.body.nickname,
      name: req.body.name,
      description: req.body.description,
      backgroundId: req.body.backgroundId,
    };

    const updated = await studyService.updateStudy(studyId, data);

    if (updated?.error === 'NOT_FOUND') {
      return fail(res, 'NOT_FOUND', '스터디를 찾을 수 없습니다.', 404);
    }

    return success(res, updated);
  } catch (err) {
    next(err);
  }
};

export const deleteStudy = async (req, res, next) => {
  try {
    const studyId = Number(req.params.studyId);
    const { password } = req.body;

    if (Number.isNaN(studyId)) {
      return fail(res, 'VALIDATION_ERROR', '유효한 studyId가 아닙니다.', 400);
    }

    if (!password) {
      return fail(res, 'VALIDATION_ERROR', '비밀번호를 입력해주세요.', 400);
    }

    const result = await studyService.deleteStudy(studyId, password);

    if (result?.error === 'NOT_FOUND') {
      return fail(res, 'NOT_FOUND', '스터디를 찾을 수 없습니다.', 404);
    }

    if (result?.error === 'INVALID_PASSWORD') {
      return fail(res, 'UNAUTHORIZED', '비밀번호가 일치하지 않습니다.', 401);
    }

    if (Array.isArray(req.session?.verifiedStudies)) {
      req.session.verifiedStudies = req.session.verifiedStudies.filter(
        (id) => id !== studyId
      );
    }

    req.session.save((err) => {
      if (err) return next(err);
      return success(res, null, 'deleted', 200);
    });
  } catch (err) {
    next(err);
  }
};
