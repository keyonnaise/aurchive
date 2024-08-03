import { Router } from 'express';
import { Timestamp } from 'firebase-admin/firestore';
import { EditStorySchema, GetStoriesSchema, GetStorySchema } from './schema';
import collections from '../../collections/collections';
import { NetworkError } from '../../errors';
import authentication from '../../middlewares/authentication';
import admin from '../../service';
import asyncRequestHandler from '../../utils/asyncRequestHandler';
import uniqueId from '../../utils/uniqueId';
import validateRequest from '../../utils/validateRequest';

const stories = Router();

/**
 * GET /api/stories
 */
stories.get(
  '/',
  asyncRequestHandler(async (req, res) => {
    const { query } = await validateRequest(req, GetStoriesSchema);
    const { author, page, limit, sort } = query;

    const fQuery = collections.stories.orderBy('created_at', sort).where('author', '==', author);
    const total = await fQuery.get();

    // 조회된 데이터가 없으면 빈 데이터를 반환합니다.
    if (total.size === 0) {
      return res.send({
        list: [],
        pageCount: 1,
      });
    }

    const pageCount = Math.ceil(total.size / limit);
    const cursor = total.docs[(page - 1) * limit];

    const snapshot = await fQuery.startAt(cursor).limit(limit).get();
    const list = snapshot.docs.map((doc) => doc.data());

    return res.send({ list, pageCount });
  }),
);

/**
 * GET /api/stories/:author
 */
stories.get(
  '/:author',
  asyncRequestHandler(async (req, res) => {
    const { author } = req.params;
    const { query } = await validateRequest(req, GetStorySchema);

    const fQuery = collections.stories.where('author', '==', author).where('slug', '==', query.slug);
    const snapshot = await fQuery.get();
    const list = snapshot.docs.map((doc) => doc.data());

    return res.send(list[0]);
  }),
);

/**
 * POST /api/stories
 */
stories.post(
  '/',
  authentication,
  asyncRequestHandler(async (req, res) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1] || '';
    const { body: data } = await validateRequest(req, EditStorySchema);

    const { uid } = await admin.auth().verifyIdToken(idToken);
    const slug = await ensureUniqueSlug(data.slug);

    const currentTime = Timestamp.now().toMillis();

    const documentRef = collections.stories.doc();
    const { id } = documentRef;

    await documentRef.set({
      ...data,
      id,
      slug,
      author: uid,
      createdAt: currentTime,
      updatedAt: currentTime,
    });

    return res.send(id);
  }),
);

/**
 * PUT /api/stories/:id
 */
stories.put(
  '/:id',
  authentication,
  asyncRequestHandler(async (req, res) => {
    const { id } = req.params;
    const { body: data } = await validateRequest(req, EditStorySchema);

    const currentTime = Timestamp.now().toMillis();

    const documentRef = collections.stories.doc(id);

    await documentRef.set(
      {
        ...data,
        updatedAt: currentTime,
      },
      { merge: true },
    );

    return res.send(data.slug);
  }),
);

/**
 * DELETE /api/stories/:id
 */
stories.delete(
  '/:id',
  authentication,
  asyncRequestHandler(async (req, res) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1] || '';
    const { id } = req.params;

    const { uid } = await admin.auth().verifyIdToken(idToken);

    const documentRef = collections.stories.doc(id);
    const document = await documentRef.get();
    const data = document.data();

    if (data === undefined) {
      throw new NetworkError(404, '요청하신 스토리를 찾을 수 없습니다.');
    }

    if (uid !== data.author) {
      throw new NetworkError(401, '스토리에 대한 삭제 권한이 없습니다.');
    }

    const postsSnapshot = await collections.posts.where('story', '==', id).get();
    const promises = postsSnapshot.docs.map(async (doc) => {
      const documentRef = doc.ref;

      await documentRef.set({ story: null }, { merge: true });
    });

    await Promise.all([...promises, documentRef.delete()]);

    return res.end();
  }),
);

// Utils
async function ensureUniqueSlug(defaultSlug: string) {
  const MAX_RETRIES = 10;

  let suffix: string | undefined;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    const slug = suffix !== undefined ? `${defaultSlug}-${suffix}` : defaultSlug;

    const fQuery = collections.stories.where('slug', '==', slug);
    const total = await fQuery.get();

    if (total.size === 0) {
      return slug;
    }

    suffix = uniqueId();
    retries++;
  }

  throw new NetworkError(500, '재시도 횟수를 초과하여 고유 슬러그를 생성하지 못했습니다.');
}

export default stories;
