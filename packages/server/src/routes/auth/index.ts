import { CookieOptions, Router } from 'express';
import { Timestamp } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import { EditProfileSchema } from './schema';
import collections from '../../collections/collections';
import { IUser, SnakeToCamelCaseNested } from '../../collections/types';
import { NetworkError } from '../../errors';
import authentication from '../../middlewares/authentication';
import admin from '../../service';
import asyncRequestHandler from '../../utils/asyncRequestHandler';
import validateRequest from '../../utils/validateRequest';

const API_KEY = functions.config().identitytoolkit.apikey;

const BASE_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
};

const auth = Router();

/**
 * GET /api/auth/authentication
 */
auth.get(
  '/authentication',
  authentication,
  asyncRequestHandler(async (req, res) => {
    const accessToken = req.headers.authorization?.split('Bearer ')[1] || '';
    const { uid } = await admin.auth().verifyIdToken(accessToken);

    const documentRef = collections.users.doc(uid);
    const document = await documentRef.get();
    const data = document.data();

    if (data === undefined) {
      throw new NetworkError(404, '사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    return res.send(data);
  }),
);

/**
 * POST /api/auth/login
 */
auth.post(
  '/login',
  asyncRequestHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    if (!result.ok) {
      throw new NetworkError(400, '로그인 처리 도중 오류가 발생했습니다. 이메일/비밀번호를 확인해 주세요.');
    }

    const { localId, idToken, refreshToken } = await result.json();

    res.setHeader('Authorization', `Bearer ${idToken}`);
    res.cookie('refreshToken', refreshToken, BASE_COOKIE_OPTIONS);

    const currentDate = Timestamp.now().toMillis();

    const documentRef = collections.users.doc(localId);
    const document = await documentRef.get();
    const data = document.data();

    if (data !== undefined) {
      // 사용자 데이터가 저장되어 있는 경우
      // 사용자 데이터의 last_login 값을 현재 시간으로 업데이트 한 후 사용자 계정 정보를 반환 합니다.
      await documentRef.set({ lastLogin: currentDate }, { merge: true });

      const { profile, setting, ...account } = data;

      return res.send(account);
    } else {
      // 사용자 데이터가 저장되어 있지 않은 경우
      // 초기 사용자 데이터를 저장 후 사용자 계정 정보를 반환 합니다.
      const initialData: SnakeToCamelCaseNested<IUser> = {
        email,
        id: localId,
        role: 'user',
        displayName: '뉴비',
        photoUrl: null,
        dateJoined: currentDate,
        lastLogin: currentDate,
        membership: {
          level: 1,
          name: '뉴비',
        },
        profile: {
          bio: null,
          about: null,
          githubUrl: null,
          linkedinUrl: null,
          instagramUrl: null,
          twitterUrl: null,
        },
        setting: {},
        emailVerified: false,
        isAgreeToTerms: false,
      };

      await documentRef.set(initialData);

      return res.send(initialData);
    }
  }),
);

/**
 * PUT /api/auth/profile
 */
auth.put(
  '/profile',
  authentication,
  asyncRequestHandler(async (req, res) => {
    const accessToken = req.headers.authorization?.split('Bearer ')[1] || '';
    const { body } = await validateRequest(req, EditProfileSchema);

    const { uid } = await admin.auth().verifyIdToken(accessToken);
    const { displayName, photoUrl, ...profile } = body;

    const documentRef = collections.users.doc(uid);

    await documentRef.set({ displayName, photoUrl, profile }, { merge: true });

    return res.end();
  }),
);

export default auth;
