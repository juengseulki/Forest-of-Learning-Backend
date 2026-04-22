import * as habitService from '../services/habit.service.js';
import { success, fail } from '../utils/response.js';

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const isValidDate = (str) => {
  if (!ISO_DATE_RE.test(str)) return false;
  const [y, m, d] = str.split('-').map(Number);
  if (m < 1 || m > 12 || d < 1) return false;
  const daysInMonth = new Date(y, m, 0).getDate();
  return d <= daysInMonth;
};

export const createHabit = async (req, res, next) => {
  try {
    const { studyId, name } = req.body;
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    if (!trimmedName)
      return fail(res, 'INVALID_INPUT', '습관 이름을 입력해주세요.');
    if (trimmedName.length > 50)
      return fail(res, 'INVALID_INPUT', '습관 이름은 50자 이하여야 합니다.');
    const habit = await habitService.createHabit({
      studyId: Number(studyId),
      name: trimmedName,
    });
    success(res, habit, 'created', 201);
  } catch (err) {
    next(err);
  }
};

export const getHabits = async (req, res, next) => {
  try {
    const { studyId } = req.query;
    const items = await habitService.findHabitsByStudyId(Number(studyId));
    success(res, { items });
  } catch (err) {
    next(err);
  }
};

export const updateHabit = async (req, res, next) => {
  try {
    const { habitId } = req.params;
    const { name, isEnded } = req.body;
    const updateData = {};
    if (name !== undefined) {
      const trimmedName = typeof name === 'string' ? name.trim() : '';
      if (!trimmedName)
        return fail(res, 'INVALID_INPUT', '습관 이름을 입력해주세요.');
      if (trimmedName.length > 50)
        return fail(res, 'INVALID_INPUT', '습관 이름은 50자 이하여야 합니다.');
      updateData.name = trimmedName;
    }
    if (isEnded !== undefined) {
      if (typeof isEnded !== 'boolean')
        return fail(res, 'INVALID_INPUT', 'isEnded는 true/false여야 합니다.');
      updateData.isEnded = isEnded;
    }
    if (Object.keys(updateData).length === 0)
      return fail(res, 'INVALID_INPUT', '수정할 항목이 없습니다.');
    const habit = await habitService.updateHabit(Number(habitId), updateData);
    success(res, habit);
  } catch (err) {
    next(err);
  }
};

export const deleteHabit = async (req, res, next) => {
  try {
    const { habitId } = req.params;
    await habitService.deleteHabit(Number(habitId));
    success(res, null, 'deleted');
  } catch (err) {
    next(err);
  }
};

export const upsertHabitRecord = async (req, res, next) => {
  try {
    const { habitId } = req.params;
    const { date, completed } = req.body;
    if (!isValidDate(date))
      return fail(
        res,
        'INVALID_INPUT',
        '날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)'
      );
    if (typeof completed !== 'boolean')
      return fail(res, 'INVALID_INPUT', 'completed는 true/false여야 합니다.');
    const record = await habitService.upsertHabitRecord(
      Number(habitId),
      date,
      completed
    );
    success(res, record);
  } catch (err) {
    next(err);
  }
};

export const getHabitRecords = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const { weekStart, weekEnd } = req.query;
    if (!isValidDate(weekStart))
      return fail(
        res,
        'INVALID_INPUT',
        'weekStart 날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)'
      );
    if (!isValidDate(weekEnd))
      return fail(
        res,
        'INVALID_INPUT',
        'weekEnd 날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)'
      );
    if (new Date(weekStart) > new Date(weekEnd))
      return fail(
        res,
        'INVALID_INPUT',
        'weekStart는 weekEnd보다 이전이어야 합니다.'
      );
    const items = await habitService.findHabitRecords(
      Number(studyId),
      weekStart,
      weekEnd
    );
    success(res, { weekStart, weekEnd, items });
  } catch (err) {
    next(err);
  }
};
