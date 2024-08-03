import { Router } from 'express';
import collections from '../../collections/collections';
import asyncRequestHandler from '../../utils/asyncRequestHandler';
import pipe from '../../utils/pipe';

interface SitemapLink {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

const DOMAIN = 'https://aurchive.com';
const ITEMS_PER_PAGE = 2500;

const sitemaps = Router();

/**
 * GET /api/sitemaps/index.xml
 */
sitemaps.get(
  '/index.xml',
  asyncRequestHandler(async (_, res) => {
    const urls = await Promise.all([getLocations('users'), getLocations('posts')]);
    const sitemaps = [...urls.flat(), `${DOMAIN}/sitemaps/general.xml`]
      .map((loc) => `<sitemap><loc>${loc}</loc></sitemap>`)
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemaps}</sitemapindex>`;

    res.setHeader('Content-Type', 'text/xml');
    res.write(xml);
    res.end();
  }),
);

/**
 * GET /api/sitemaps/general.xml
 */
sitemaps.get(
  '/general.xml',
  asyncRequestHandler(async (_, res) => {
    const links: SitemapLink[] = [
      {
        loc: DOMAIN,
        changefreq: 'monthly',
        priority: 1,
      },
      {
        loc: `${DOMAIN}/members`,
        changefreq: 'monthly',
        priority: 1,
      },
      {
        loc: `${DOMAIN}/posts`,
        changefreq: 'monthly',
        priority: 1,
      },
    ];

    const xml = generateSitemapXml(links);

    res.setHeader('Content-Type', 'text/xml');
    res.write(xml);
    res.end();
  }),
);

/**
 * GET /api/sitemaps/users-:page.xml
 */
sitemaps.get(
  '/users-:page.xml',
  asyncRequestHandler(async (req, res) => {
    const page = pipe(
      req.params.page,
      (value) => Number(value),
      (value) => (Number.isInteger(value) && value > 1 ? value : 1),
    );

    const fQuery = collections.users.orderBy('date_joined', 'desc');
    const users = await getPaginatedData(fQuery, page, ['id', 'date_joined']);

    const links: SitemapLink[] = users
      .map((user) => [
        {
          loc: `${DOMAIN}/@${user.id}`,
          lastmod: new Date(user.dateJoined).toISOString(),
          changefreq: 'monthly',
          priority: 1,
        },
        {
          loc: `${DOMAIN}/@${user.id}/stories`,
          changefreq: 'monthly',
          priority: 1,
        },
        {
          loc: `${DOMAIN}/@${user.id}/posts`,
          changefreq: 'monthly',
          priority: 1,
        },
      ])
      .flat();

    const xml = generateSitemapXml(links);

    res.setHeader('Content-Type', 'text/xml');
    res.write(xml);
    res.end();
  }),
);

/**
 * GET /api/sitemaps/posts-:page.xml
 */
sitemaps.get(
  '/posts-:page.xml',
  asyncRequestHandler(async (req, res) => {
    const page = pipe(
      req.params.page,
      (value) => Number(value),
      (value) => (Number.isInteger(value) && value > 1 ? value : 1),
    );

    const fQuery = collections.posts.orderBy('published_at', 'desc').where('is_published', '==', true);
    const posts = await getPaginatedData(fQuery, page, ['id', 'published_at']);

    const links: SitemapLink[] = posts.map((post) => ({
      loc: `${DOMAIN}/posts/${post.id}`,
      lastmod: new Date(post.publishedAt).toISOString(),
      changefreq: 'monthly',
      priority: 1,
    }));

    const xml = generateSitemapXml(links);

    res.setHeader('Content-Type', 'text/xml');
    res.write(xml);
    res.end();
  }),
);

// Helper functions
async function getLocations(key: 'users' | 'posts') {
  const total = await collections[key].get();
  const length = Math.ceil(total.size / ITEMS_PER_PAGE);
  const urls = [...Array(length)].map((_, i) => `${DOMAIN}/sitemaps/${key}-${i + 1}.xml`);

  return urls;
}

async function getPaginatedData<T>(query: FirebaseFirestore.Query<T>, page: number, fields: string[]) {
  const total = await query.get();
  const cursor = total.docs[(page - 1) * ITEMS_PER_PAGE];
  const snapshot = await query
    .startAt(cursor)
    .limit(ITEMS_PER_PAGE)
    .select(...fields)
    .get();

  return snapshot.docs.map((doc) => doc.data());
}

function generateSitemapXml(links: SitemapLink[]) {
  const urls = links.reduce((acc, current) => {
    const properties = Object.entries(current)
      .map(([key, value]) => `<${key}>${value}</${key}>`)
      .join('');

    return acc + `<url>${properties}</url>`;
  }, '');

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

export default sitemaps;
