import express from 'express';
import { translateText } from '../controllers/translate.controller.js';
import { translateLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/translate', translateLimiter, translateText);

export default router;
