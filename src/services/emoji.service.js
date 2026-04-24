import prisma from '../lib/prisma.js';

export const addEmojiReaction = async (data) => {
  const { studyId, emoji } = data;

  return await prisma.emojiReaction.upsert({
    where: {
      studyId_emoji: {
        studyId: Number(studyId),
        emoji: emoji,
      },
    },
    update: { count: { increment: 1 } },
    create: {
      studyId: Number(studyId),
      emoji: emoji,
      count: 1,
    },
  });
};

export const findEmojiReactionsByStudyId = async (studyId) => {
  return await prisma.emojiReaction.findMany({
    where: { studyId },
    orderBy: { count: 'desc' },
  });
};
