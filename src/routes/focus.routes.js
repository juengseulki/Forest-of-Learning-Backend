import express from 'express';
import {
  getFocusByStudyId,
  createFocusSession,
} from '../controllers/focus.controller.js';
import { verifyStudyPasswordByStudyId } from '../middlewares/verifyPassword.js';

const router = express.Router();

router.get('/:studyId', getFocusByStudyId);
router.post('/:studyId', verifyStudyPasswordByStudyId, createFocusSession);

export default router;
