import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as functions from 'firebase-functions';
import { NetworkError } from './errors';
import router from './routes';

const corsOptions = {
  origin: true,
  credentials: true,
  exposedHeaders: ['Authorization'],
};

const app = express();

app.use(compression());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.raw());

// 토큰 설정 미들웨어
app.use((req, res, next) => {
  const idToken = req.headers.authorization;

  if (idToken !== undefined) {
    res.setHeader('Authorization', idToken);
  }

  next();
});

// 라우터 미들웨어
app.use('/', router);

// 에러 처리 미들웨어
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof NetworkError) {
    res.status(error.code).send(error.message);
  } else {
    res.status(500).send(error.message);
  }
});

export const api = functions.region('asia-northeast3').https.onRequest(app);
