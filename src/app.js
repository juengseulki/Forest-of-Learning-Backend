import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import errorHandler from './middlewares/errorHandler.js';
import backgroundRouter from './routes/background.routes.js';
import studyRouter from './routes/study.routes.js';
import habitRouter from './routes/habit.routes.js';
import focusRouter from './routes/focus.routes.js';
import emojiRouter from './routes/emoji.routes.js';
import pointRouter from './routes/point.routes.js';
import translateRouter from './routes/translate.router.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const isProduction = process.env.NODE_ENV === 'production';

const PgSession = connectPgSimple(session);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : [];

// 프록시 환경(Render 등)에서 secure cookie 인식
if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!isProduction || !origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: 'session',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'forest-dev-secret',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use('/images', express.static(join(__dirname, 'public/images')));

app.get('/', (_req, res) => {
  res.json({ message: 'Backend server is running.' });
});

app.get('/api/test', (_req, res) => {
  res.json({ message: 'API 연결 성공' });
});

app.use('/backgrounds', backgroundRouter);
app.use('/studies', studyRouter);
app.use('/habits', habitRouter);
app.use('/focuses', focusRouter);
app.use('/emojis', emojiRouter);
app.use('/points', pointRouter);
app.use('/translate', translateRouter);

app.use((_req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: '요청한 경로를 찾을 수 없습니다.' },
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
