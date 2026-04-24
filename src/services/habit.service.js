import prisma from '../lib/prisma.js';

export const createHabit = async (data) => {
  return await prisma.habit.create({ data });
};

export const findHabitsByStudyId = async (studyId) => {
  return await prisma.habit.findMany({
    where: { studyId, isEnded: false },
    include: { habitRecords: { orderBy: { date: 'asc' } } },
    orderBy: { createdAt: 'asc' },
  });
};

export const findHabitById = async (id) => {
  return await prisma.habit.findUnique({
    where: { id },
    include: { habitRecords: true },
  });
};

export const updateHabit = async (id, data) => {
  return await prisma.habit.update({
    where: { id },
    data,
  });
};

export const deleteHabit = async (id) => {
  return await prisma.habit.delete({ where: { id } });
};

export const upsertHabitRecord = async (habitId, date, completed) => {
  return await prisma.habitRecord.upsert({
    where: { habitId_date: { habitId, date: new Date(date) } },
    create: { habitId, date: new Date(date), completed },
    update: { completed },
  });
};

export const findHabitRecords = async (studyId, weekStart, weekEnd) => {
  const habitsWithRecords = await prisma.habit.findMany({
    where: {
      studyId: studyId,
      isEnded: false,
    },
    include: {
      habitRecords: {
        where: {
          date: {
            gte: new Date(weekStart),
            lte: new Date(weekEnd),
          },
        },
      },
    },
  });

  return habitsWithRecords.map((habit) => {
    const dates = habit.habitRecords.reduce((acc, record) => {
      const dateKey = record.date.toISOString().split('T')[0];

      acc[dateKey] = record.completed;
      return acc;
    }, {});

    return {
      habitId: habit.id,
      habitName: habit.name,
      dates: dates,
    };
  });
};
