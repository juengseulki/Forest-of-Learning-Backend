import express from 'express';
import {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  upsertHabitRecord,
  getHabitRecords,
} from '../controllers/habit.controller.js';
import { numericParams } from '../middlewares/validateParams.js';
import {
  verifyStudyPasswordByStudyId,
  verifyStudyPasswordByHabitId,
} from '../middlewares/verifyPassword.js';

const router = express.Router();

router.get('/', numericParams('studyId'), getHabits);

router.post(
  '/',
  numericParams('studyId'),
  verifyStudyPasswordByStudyId,
  createHabit
);

router.get('/:studyId/records', numericParams('studyId'), getHabitRecords);

router.post(
  '/:habitId/records',
  numericParams('habitId'),
  verifyStudyPasswordByHabitId,
  upsertHabitRecord
);

router.patch(
  '/:habitId',
  numericParams('habitId'),
  verifyStudyPasswordByHabitId,
  updateHabit
);

router.delete(
  '/:habitId',
  numericParams('habitId'),
  verifyStudyPasswordByHabitId,
  deleteHabit
);

export default router;
