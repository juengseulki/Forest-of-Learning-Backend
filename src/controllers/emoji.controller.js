import * as emojiService from '../services/emoji.service.js';
import { success, fail } from '../utils/response.js';

export const addEmojiReaction = async (req, res, next) => {
  try {
    const { studyId, emoji } = req.body;
    if (!emoji || typeof emoji !== 'string' || emoji.trim().length === 0) {
      return fail(res, 'INVALID_INPUT', '이모지를 입력해주세요.');
    }
    if ([...emoji].length > 8) {
      return fail(res, 'INVALID_INPUT', '이모지 길이가 초과되었습니다.');
    }
    if (!/^\p{Extended_Pictographic}/u.test(emoji)) {
      return fail(res, 'INVALID_INPUT', '유효하지 않은 이모지입니다.');
    }
    const reaction = await emojiService.addEmojiReaction({
      studyId: Number(studyId),
      emoji,
    });
    success(res, reaction, 'created', 201);
  } catch (err) {
    next(err);
  }
};

export const getEmojiReactions = async (req, res, next) => {
  try {
    const { studyId } = req.query;
    const items = await emojiService.findEmojiReactionsByStudyId(Number(studyId));
    success(res, { items });
  } catch (err) {
    next(err);
  }
};
