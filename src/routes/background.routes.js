import express from 'express';
import {
  getBackgrounds,
  getBackgroundById,
} from '../controllers/background.controller.js';

const router = express.Router();

router.get('/', getBackgrounds);
router.get('/:backgroundId', getBackgroundById);

export default router;
