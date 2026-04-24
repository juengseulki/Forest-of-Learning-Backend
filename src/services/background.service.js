import prisma from '../lib/prisma.js';

const toAbsoluteUrl = (imageUrl) => {
  const base = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${base}${imageUrl}`;
};

export const findAllBackgrounds = async () => {
  const items = await prisma.background.findMany({
    orderBy: { createdAt: 'asc' },
  });
  return items.map((b) => ({ ...b, imageUrl: toAbsoluteUrl(b.imageUrl) }));
};

export const findBackgroundById = async (id) => {
  const background = await prisma.background.findUnique({ where: { id } });
  if (!background) return null;
  return { ...background, imageUrl: toAbsoluteUrl(background.imageUrl) };
};