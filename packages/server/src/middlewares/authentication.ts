import { NextFunction, Request, Response } from 'express';
import * as functions from 'firebase-functions';
import { NetworkError } from '../errors';
import admin from '../service';

const API_KEY = functions.config().identitytoolkit.apikey;

export default async function authentication(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.cookies;
    let idToken = req.headers.authorization?.split('Bearer ')[1];

    // 쿠키 존재 여부 확인 및 유효성 검증
    if (idToken === undefined && refreshToken === undefined) {
      throw new NetworkError(401, '로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.');
    }

    // idToken 검증
    let isIdTokenVerified: boolean = false;

    if (idToken !== undefined) {
      try {
        await admin.auth().verifyIdToken(idToken, true);
        isIdTokenVerified = true;
      } catch {
        isIdTokenVerified = false;
      }
    }

    // idToken 검증 실패 시 refreshToken 사용하여 새로운 idToken 발급
    if (!isIdTokenVerified) {
      const result = await fetch(`https://securetoken.googleapis.com/v1/token?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }).toString(),
      });

      if (!result.ok) {
        throw new NetworkError(400, '유효하지 않은 refreshToken값 입니다.');
      }

      const { id_token } = await result.json();
      idToken = id_token;
    }

    idToken = `Bearer ${idToken}`;
    req.headers.authorization = idToken;
    res.setHeader('Authorization', idToken);

    next();
  } catch (error) {
    if (error instanceof NetworkError) {
      return res.status(error.code).send(error.message);
    } else {
      next(error);
    }
  }
}
