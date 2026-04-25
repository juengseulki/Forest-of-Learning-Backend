import express from 'express';
import {
  getFocusByStudyId,
  createFocusSession,
} from '../controllers/focus.controller.js';
import { numericParams } from '../middlewares/validateParams.js';
import { verifyStudyAuth } from '../middlewares/verifyPassword.js';

const router = express.Router();

router.get('/:studyId', numericParams('studyId'), getFocusByStudyId);

router.post(
  '/:studyId',
  numericParams('studyId'),
  verifyStudyAuth,
  createFocusSession
);

export default router;
