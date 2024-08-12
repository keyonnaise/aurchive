import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import functions from 'firebase-functions';
import { renderer } from './src/entry-server';

const app = express();
const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(compression());

app.get('*', renderer);

export const render = functions.region('asia-northeast3').https.onRequest(app);
