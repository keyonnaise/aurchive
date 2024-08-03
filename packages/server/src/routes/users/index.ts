import { Router } from 'express';
import { GetUsersSchema } from './schema';
import collections from '../../collections/collections';
import { NetworkError } from '../../errors';
import asyncRequestHandler from '../../utils/asyncRequestHandler';
import validateRequest from '../../utils/validateRequest';

const users = Router();

/**
 * GET /api/users
 */
users.get(
  '/',
  asyncRequestHandler(async (req, res) => {
    const { query } = await validateRequest(req, GetUsersSchema);
    const { limit, page, sort } = query;

    const fQuery = collections.users.orderBy('date_joined', sort);
    const total = await fQuery.get();

    if (total.size === 0) {
      return res.send({
        list: [],
        pageCount: 1,
      });
    }

    const pageCount = Math.ceil(total.size / limit);
    const cursor = total.docs[(page - 1) * limit];

    const snapshot = await fQuery.startAt(cursor).limit(limit).get();
    const list = snapshot.docs.map((doc) => {
      const { id, role, email, displayName, photoUrl, profile } = doc.data();

      return { id, role, email, displayName, photoUrl, profile };
    });

    return res.send({ list, pageCount });
  }),
);

/**
 * GET /api/users/:id
 */
users.get(
  '/:id',
  asyncRequestHandler(async (req, res) => {
    const { id } = req.params;

    const document = await collections.users.doc(id).get();
    const data = document.data();

    if (data === undefined) {
      throw new NetworkError(404, '요청하신 회원을 찾을 수 없습니다.');
    }

    return res.send(data);
  }),
);

export default users;
