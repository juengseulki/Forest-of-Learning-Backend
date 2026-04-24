import * as pointService from '../services/point.service.js';
import { success, fail } from '../utils/response.js';

export const getPoint = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const point = await pointService.findPointByStudyId(Number(studyId));
    if (!point)
      return fail(res, 'NOT_FOUND', '포인트 정보를 찾을 수 없습니다.', 404);
    success(res, point);
  } catch (err) {
    next(err);
  }
};

export const getPointLogs = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const logs = await pointService.findPointLogsByStudyId(Number(studyId));
    success(res, logs);
  } catch (err) {
    next(err);
  }
};

export const addPoints = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const { amount: rawAmount, reason = 'ETC', focusSessionId } = req.body;
    const amount = Number(rawAmount);
    if (!Number.isInteger(amount) || amount <= 0 || amount > 10000) {
      return fail(res, 'INVALID_INPUT', 'amount는 1 이상 10000 이하의 정수여야 합니다.');
    }
    const point = await pointService.addPointsWithLog(
      Number(studyId),
      amount,
      reason,
      focusSessionId
    );
    success(res, point);
  } catch (err) {
    next(err);
  }
};