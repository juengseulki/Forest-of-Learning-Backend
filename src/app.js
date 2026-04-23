import express from 'express';
import cors from 'cors';
import session from 'express-session';
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

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : [];

if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (!isProduction || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'forest-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
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
app.use(translateRouter);

app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: '요청한 경로를 찾을 수 없습니다.',
    },
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
