import argon2 from 'argon2';
import prisma from '../lib/prisma.js';

const toAbsoluteUrl = (imageUrl) => {
  const base =
    process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${base}${imageUrl}`;
};

const normalizeBackground = (background) =>
  background
    ? { ...background, imageUrl: toAbsoluteUrl(background.imageUrl) }
    : null;

export const createStudy = async (data) => {
  const hashedPassword = await argon2.hash(data.password);

  const study = await prisma.study.create({
    data: {
      nickname: data.nickname,
      name: data.name,
      description: data.description,
      backgroundId: Number(data.backgroundId),
      password: hashedPassword,
      point: { create: {} },
    },
    select: {
      id: true,
      nickname: true,
      name: true,
      description: true,
      background: {
        select: { id: true, name: true, imageUrl: true },
      },
      createdAt: true,
    },
  });
  return { ...study, background: normalizeBackground(study.background) };
};

export const findAllStudies = async ({ page, limit, keyword, order }) => {
  const skip = (page - 1) * limit;

  let orderBy;

  switch (order) {
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'latest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'pointDesc':
      orderBy = { point: { totalPoint: 'desc' } };
      break;
    case 'pointAsc':
      orderBy = { point: { totalPoint: 'asc' } };
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }

  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { nickname: { contains: keyword, mode: 'insensitive' } },
        ],
      }
    : {};

  const totalCount = await prisma.study.count({ where });

  const items = await prisma.study.findMany({
    where,
    select: {
      id: true,
      nickname: true,
      name: true,
      description: true,
      createdAt: true,
      background: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
    orderBy,
    skip,
    take: limit,
  });

  return {
    items: items.map((s) => ({
      ...s,
      background: normalizeBackground(s.background),
    })),
    totalCount,
    page,
    limit,
  };
};

export const findStudyById = async (id) => {
  const study = await prisma.study.findUnique({
    where: { id },
    select: {
      id: true,
      nickname: true,
      name: true,
      description: true,
      background: {
        select: { id: true, name: true, imageUrl: true },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!study) return null;
  return { ...study, background: normalizeBackground(study.background) };
};

export const verifyStudyPassword = async (id, password) => {
  const study = await prisma.study.findUnique({
    where: { id },
    select: {
      id: true,
      password: true,
    },
  });

  if (!study) {
    return { error: 'NOT_FOUND' };
  }

  const isMatch = await argon2.verify(study.password, password);

  if (!isMatch) {
    return { error: 'INVALID_PASSWORD' };
  }

  return { verified: true };
};

export const updateStudy = async (id, data) => {
  const study = await prisma.study.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });

  if (!study) {
    return { error: 'NOT_FOUND' };
  }

  const updateData = {
    ...(data.nickname !== undefined && { nickname: data.nickname }),
    ...(data.name !== undefined && { name: data.name }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.backgroundId !== undefined && {
      backgroundId: Number(data.backgroundId),
    }),
  };

  const updated = await prisma.study.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      nickname: true,
      name: true,
      description: true,
      background: {
        select: { id: true, name: true, imageUrl: true },
      },
      updatedAt: true,
    },
  });
  return { ...updated, background: normalizeBackground(updated.background) };
};

export const deleteStudy = async (id, password) => {
  const study = await prisma.study.findUnique({
    where: { id },
    select: {
      id: true,
      password: true,
    },
  });

  if (!study) {
    return { error: 'NOT_FOUND' };
  }

  const isMatch = await argon2.verify(study.password, password);
  if (!isMatch) {
    return { error: 'INVALID_PASSWORD' };
  }

  return await prisma.study.delete({
    where: { id },
  });
};
