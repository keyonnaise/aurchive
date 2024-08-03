import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as busboy from 'busboy';
import { Router } from 'express';
import { UploadImageSchema } from './schema';
import { STORAGE } from '../../constants';
import authentication from '../../middlewares/authentication';
import admin from '../../service';
import asyncRequestHandler from '../../utils/asyncRequestHandler';
import uniqueId from '../../utils/uniqueId';
import validateRequest from '../../utils/validateRequest';

const files = Router();

/**
 * POST /api/files/image
 */
files.post(
  '/image',
  authentication,
  asyncRequestHandler(async (req, res, next) => {
    const { query } = await validateRequest(req, UploadImageSchema);
    const { usedIn, directoryName } = query;

    let image: {
      filename: string;
      filepath: string;
      mimetype: string;
    };

    const bb = busboy({ headers: req.headers });

    bb.on('file', (_name, file, info) => {
      const splited = info.filename.split('.');
      const extension = splited[splited.length - 1];
      const filename = `${Date.now()}_${uniqueId()}.${extension}`;

      image = {
        filename,
        filepath: path.resolve(os.tmpdir(), filename),
        mimetype: info.mimeType,
      };

      file.pipe(fs.createWriteStream(image.filepath));
    });

    bb.on('close', async () => {
      const bucket = admin.storage().bucket();
      const { filename, filepath, mimetype } = image;
      const destination = `assets/media/${usedIn}/${directoryName}/${filename}`;

      await bucket.upload(filepath, {
        destination,
        resumable: false,
        metadata: {
          contentType: mimetype,
        },
      });

      res.send(`${STORAGE}/${destination.replace(/\//g, '%2F')}?alt=media`);
    });

    bb.on('error', next);

    bb.end(req.body);
  }),
);

export default files;
