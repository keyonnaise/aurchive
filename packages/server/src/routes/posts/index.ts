import { Router } from 'express';
import { Timestamp } from 'firebase-admin/firestore';
import { EditPostSchema, GetPostsSchema } from './schema';
import collections from '../../collections/collections';
import { NetworkError } from '../../errors';
import authentication from '../../middlewares/authentication';
import admin from '../../service';
import asyncRequestHandler from '../../utils/asyncRequestHandler';
import validateRequest from '../../utils/validateRequest';

const posts = Router();

/**
 * GET /api/posts
 */
posts.get(
  '/',
  asyncRequestHandler(async (req, res) => {
    const { query } = await validateRequest(req, GetPostsSchema);
    const { author, story, keyword, published, limit, page, sort } = query;

    let fQuery = collections.posts.orderBy('published_at', sort).where('is_published', '==', published);

    if (author !== undefined) fQuery = fQuery.where('author', '==', author);
    if (story !== undefined) fQuery = fQuery.where('story', '==', story);
    if (keyword !== undefined) fQuery = fQuery.where('keyword', '==', keyword);

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
    const posts = snapshot.docs.map((doc) => doc.data());

    const list = await Promise.all(
      posts.map(async ({ author, ...rest }) => {
        const userRef = await collections.users.doc(author).get();
        const user = userRef.data();

        return { ...rest, author: user };
      }),
    );

    return res.send({ list, pageCount });
  }),
);

/**
 * GET /api/posts/:id
 */
posts.get(
  '/:id',
  asyncRequestHandler(async (req, res) => {
    const { id } = req.params;

    const postRef = await collections.posts.doc(id).get();
    const post = postRef.data();

    if (post === undefined) {
      throw new NetworkError(404, '요청하신 게시글을 찾을 수 없습니다.');
    }

    const userRef = await collections.users.doc(post.author).get();
    const user = userRef.data();

    return res.send({ ...post, author: user });
  }),
);

/**
 * POST /api/posts
 */
posts.post(
  '/',
  authentication,
  asyncRequestHandler(async (req, res) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1] || '';

    const { body } = await validateRequest(req, EditPostSchema);
    const { author, ...data } = body;

    const { uid } = await admin.auth().verifyIdToken(idToken);

    if (uid !== author) {
      throw new NetworkError(401, '게시글에 대한 작성 권한이 없습니다.');
    }

    const currentTime = Timestamp.now().toMillis();

    const documentRef = collections.posts.doc();
    const { id } = documentRef;

    await documentRef.set({
      id,
      author,
      publishedAt: null,
      updatedAt: null,
      title: '',
      tags: [],
      story: null,
      cover: null,
      thumbnail: null,
      body: '',
      lastHistory: {
        ...data,
        savedAt: currentTime,
      },
      isPrivate: false,
      isPublished: false,
    });

    return res.send(id);
  }),
);

/**
 * PUT /api/posts/:id
 */
posts.put(
  '/:id',
  authentication,
  asyncRequestHandler(async (req, res) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1] || '';
    const { id } = req.params;

    const { body } = await validateRequest(req, EditPostSchema);
    const { author, ...data } = body;

    const { uid } = await admin.auth().verifyIdToken(idToken);

    if (uid !== author) {
      throw new NetworkError(401, '게시글에 대한 작성 권한이 없습니다.');
    }

    const currentTime = Timestamp.now().toMillis();

    const documentRef = collections.posts.doc(id);

    await documentRef.set(
      {
        ...data,
        updatedAt: currentTime,
        lastHistory: null,
      },
      { merge: true },
    );

    return res.send(id);
  }),
);

/**
 * PUT /api/posts/:id/save
 */
posts.put(
  '/:id/save',
  authentication,
  asyncRequestHandler(async (req, res) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1] || '';
    const { id } = req.params;

    const { body } = await validateRequest(req, EditPostSchema);
    const { author, ...data } = body;

    const { uid } = await admin.auth().verifyIdToken(idToken);

    if (uid !== author) {
      throw new NetworkError(401, '게시글에 대한 작성 권한이 없습니다.');
    }

    const currentTime = Timestamp.now().toMillis();

    const documentRef = collections.posts.doc(id);

    await documentRef.set(
      {
        lastHistory: {
          ...data,
          savedAt: currentTime,
        },
      },
      { merge: true },
    );

    return res.send(id);
  }),
);

/**
 * PUT /api/posts/:id/publish
 */
posts.put(
  '/:id/publish',
  authentication,
  asyncRequestHandler(async (req, res) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1] || '';
    const { id } = req.params;

    const { body } = await validateRequest(req, EditPostSchema);
    const { author, ...data } = body;

    const { uid } = await admin.auth().verifyIdToken(idToken);

    if (uid !== author) {
      throw new NetworkError(401, '게시글에 대한 작성 권한이 없습니다.');
    }

    const currentTime = Timestamp.now().toMillis();

    const documentRef = collections.posts.doc(id);

    await documentRef.set(
      {
        ...data,
        publishedAt: currentTime,
        updatedAt: currentTime,
        isPublished: true,
      },
      { merge: true },
    );

    return res.send(id);
  }),
);

/**
 * DELETE /api/posts/:id
 */
posts.delete(
  '/:id',
  authentication,
  asyncRequestHandler(async (req, res) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1] || '';
    const { id } = req.params;

    const { uid } = await admin.auth().verifyIdToken(idToken);

    const documentRef = collections.posts.doc(id);
    const document = await documentRef.get();
    const data = document.data();

    const bucket = admin.storage().bucket();

    if (data === undefined) {
      throw new NetworkError(404, '요청하신 게시글을 찾을 수 없습니다.');
    }

    if (uid !== data.author) {
      throw new NetworkError(401, '게시글에 대한 삭제 권한이 없습니다.');
    }

    await documentRef.delete();
    await bucket.deleteFiles({ prefix: `assets/media/post/${id}` });

    return res.end();
  }),
);

export default posts;
