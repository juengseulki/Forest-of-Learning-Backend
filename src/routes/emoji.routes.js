import express from 'express';
import {
  addEmojiReaction,
  getEmojiReactions,
} from '../controllers/emoji.controller.js';
import { numericParams } from '../middlewares/validateParams.js';
import { verifyStudyAuth } from '../middlewares/verifyPassword.js';

const router = express.Router();

router.get('/', numericParams('studyId'), getEmojiReactions);

router.post('/', numericParams('studyId'), addEmojiReaction);

export default router;
