import { findAllBackgrounds, findBackgroundById } from '../services/background.service.js';
import { success, fail } from '../utils/response.js';

export const getBackgrounds = async (req, res, next) => {
  try {
    const items = await findAllBackgrounds();
    success(res, { items });
  } catch (err) {
    next(err);
  }
};

export const getBackgroundById = async (req, res, next) => {
  try {
    const { backgroundId } = req.params;
    const background = await findBackgroundById(Number(backgroundId));
    if (!background) return fail(res, 'NOT_FOUND', '배경을 찾을 수 없습니다.', 404);
    success(res, background);
  } catch (err) {
    next(err);
  }
};