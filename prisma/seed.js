import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // 👉 테스트용 비밀번호 (5자리)
  const TEST_PASSWORD_1 = 'ab12345';
  const TEST_PASSWORD_2 = 'cd54321';

  // 👉 해싱
  const hashedPassword1 = await argon2.hash(TEST_PASSWORD_1);
  const hashedPassword2 = await argon2.hash(TEST_PASSWORD_2);

  await prisma.background.createMany({
    data: [
      { name: 'green', imageUrl: '/images/green.png' },
      { name: 'yellow', imageUrl: '/images/yellow.png' },
      { name: 'blue', imageUrl: '/images/blue.png' },
      { name: 'pink', imageUrl: '/images/pink.png' },
      { name: 'workspace', imageUrl: '/images/workspace.png' },
      { name: 'desk', imageUrl: '/images/desk.png' },
      { name: 'pattern', imageUrl: '/images/pattern.png' },
      { name: 'leaf', imageUrl: '/images/leaf.png' },
    ],
  });

  const greenBackground = await prisma.background.findFirst({
    where: { name: 'green' },
  });

  const blueBackground = await prisma.background.findFirst({
    where: { name: 'blue' },
  });

  if (!greenBackground || !blueBackground) {
    throw new Error('Background 데이터를 찾을 수 없습니다.');
  }

  // Study 1
  await prisma.study.create({
    data: {
      nickname: '열공러',
      name: '프론트엔드 스터디',
      description: '매일 꾸준히 공부하는 프론트엔드 스터디',
      password: hashedPassword1, // ✅ 해싱 적용
      backgroundId: greenBackground.id,

      point: {
        create: {
          totalPoint: 0,
        },
      },

      habits: {
        create: [
          { name: '알고리즘 1문제 풀기' },
          { name: 'TIL 작성하기' },
          { name: '강의 1개 듣기' },
        ],
      },

      emojiReactions: {
        create: [
          { emoji: '🔥', count: 2 },
          { emoji: '👏', count: 1 },
          { emoji: '💪', count: 4 },
        ],
      },
    },
  });

  // Study 2
  await prisma.study.create({
    data: {
      nickname: '집중왕',
      name: '백엔드 스터디',
      description: '서버와 데이터베이스를 공부하는 백엔드 스터디',
      password: hashedPassword2, // ✅ 해싱 적용
      backgroundId: blueBackground.id,

      point: {
        create: {
          totalPoint: 10,
        },
      },

      habits: {
        create: [{ name: 'SQL 연습하기' }, { name: 'API 구현하기' }],
      },

      emojiReactions: {
        create: [
          { emoji: '🚀', count: 5 },
          { emoji: '👍', count: 3 },
        ],
      },
    },
  });

  console.log('🌱 Seed 완료');
  console.log('🔐 테스트 비밀번호');
  console.log('Study1:', TEST_PASSWORD_1);
  console.log('Study2:', TEST_PASSWORD_2);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
