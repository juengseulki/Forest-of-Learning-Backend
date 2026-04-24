import express from 'express';
import {
  getPoint,
  addPoints,
  getPointLogs,
} from '../controllers/point.controller.js';
import { numericParams } from '../middlewares/validateParams.js';

const router = express.Router();

router.get('/:studyId', numericParams('studyId'), getPoint);
router.get('/:studyId/logs', numericParams('studyId'), getPointLogs);
router.patch('/:studyId', numericParams('studyId'), addPoints);

export default router;
