import { Router } from 'express';
import auth from './auth';
import files from './files';
import posts from './posts';
import sitemaps from './sitemaps';
import stories from './stories';
import users from './users';

const router = Router();

router.use('/auth', auth);
router.use('/files', files);
router.use('/posts', posts);
router.use('/sitemaps', sitemaps);
router.use('/stories', stories);
router.use('/users', users);

export default router;
