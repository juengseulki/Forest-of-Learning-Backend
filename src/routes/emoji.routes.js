import express from 'express';
import {
  addEmojiReaction,
  getEmojiReactions,
} from '../controllers/emoji.controller.js';
import { numericParams } from '../middlewares/validateParams.js';

const router = express.Router();

router.post('/', numericParams('studyId'), addEmojiReaction);
router.get('/', numericParams('studyId'), getEmojiReactions);

export default router;
