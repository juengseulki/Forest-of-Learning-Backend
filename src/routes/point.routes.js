import express from 'express';
import {
  getPoint,
  addPoints,
  getPointLogs,
} from '../controllers/point.controller.js';
import { numericParams } from '../middlewares/validateParams.js';
import { verifyStudyAuth } from '../middlewares/verifyPassword.js';

const router = express.Router();

router.get('/:studyId/logs', numericParams('studyId'), getPointLogs);
router.get('/:studyId', numericParams('studyId'), getPoint);

router.patch('/:studyId', numericParams('studyId'), verifyStudyAuth, addPoints);

export default router;
