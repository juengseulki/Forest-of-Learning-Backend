import express from 'express';
import {
  getBackgrounds,
  getBackgroundById,
} from '../controllers/background.controller.js';
import { numericParams } from '../middlewares/validateParams.js';

const router = express.Router();

router.get('/', getBackgrounds);

router.get('/:backgroundId', numericParams('backgroundId'), getBackgroundById);

export default router;
