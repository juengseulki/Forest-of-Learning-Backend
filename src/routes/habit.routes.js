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
import { verifyStudyPasswordByHabitId } from '../middlewares/verifyPassword.js';

const router = express.Router();

router.post('/', numericParams('studyId'), createHabit);
router.get('/', numericParams('studyId'), getHabits);
router.patch('/:habitId', numericParams('habitId'), verifyStudyPasswordByHabitId, updateHabit);
router.delete('/:habitId', numericParams('habitId'), verifyStudyPasswordByHabitId, deleteHabit);
router.post('/:habitId/records', numericParams('habitId'), upsertHabitRecord);
router.get('/:studyId/records', numericParams('studyId'), getHabitRecords);

export default router;
