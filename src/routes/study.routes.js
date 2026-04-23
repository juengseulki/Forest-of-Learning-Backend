import express from 'express';
import {
  createStudy,
  getStudies,
  getStudyById,
  verifyStudyPassword,
  checkStudySession,
  updateStudy,
  deleteStudy,
} from '../controllers/study.controller.js';
import {
  validateCreateStudy,
  validateUpdateStudy,
  validateDeleteStudy,
} from '../middlewares/validateStudy.js';
import { passwordLimiter } from '../middlewares/rateLimiter.js';
import { numericParams } from '../middlewares/validateParams.js';
import { verifyStudyPasswordByStudyId } from '../middlewares/verifyPassword.js';

const router = express.Router();

router.post('/', validateCreateStudy, createStudy);
router.get('/', getStudies);

router.get(
  '/:studyId/verify-session',
  numericParams('studyId'),
  checkStudySession
);

router.get('/:studyId', numericParams('studyId'), getStudyById);

router.post(
  '/:studyId/verify-password',
  numericParams('studyId'),
  passwordLimiter,
  verifyStudyPassword
);

router.patch(
  '/:studyId',
  numericParams('studyId'),
  verifyStudyPasswordByStudyId,
  validateUpdateStudy,
  updateStudy
);

router.delete(
  '/:studyId',
  numericParams('studyId'),
  passwordLimiter,
  validateDeleteStudy,
  deleteStudy
);

export default router;
