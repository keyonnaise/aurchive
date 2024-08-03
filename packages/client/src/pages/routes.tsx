import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import BaseTemplate from '~components/template/BaseTemplate';
import useEffectOnce from '~hooks/useEffectOnce';
import useSystemStore from '~store/useSystemStore';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const PATH_TO_PAGE_MAP = {
  '/home': lazy(() => import('~pages/home')),
  '/members': lazy(() => import('~pages/members')),
  '/posts': lazy(() => import('~pages/posts')),
  '/posts/post': lazy(() => import('~pages/posts/post')),
  '/saves': lazy(() => import('~pages/saves')),
  '/user': lazy(() => import('~pages/user')),
  '/user/profile': lazy(() => import('~pages/user/profile')),
  '/user/profile/overview': lazy(() => import('~pages/user/profile/overview')),
  '/user/profile/stories': lazy(() => import('~pages/user/profile/stories')),
  '/user/profile/posts': lazy(() => import('~pages/user/profile/posts')),
  '/user/stories': lazy(() => import('~pages/user/stories')),
  '/user/stories/story': lazy(() => import('~pages/user/stories/story')),

  '/auth/login': lazy(() => import('~pages/auth/login')),
  '/auth/setting': lazy(() => import('~pages/auth/setting')),
  // '/auth/authentication': lazy(() => import('~pages/auth/authentication')),

  '/post-editor': lazy(() => import('~pages/post-editor')),

  '/not-found': lazy(() => import('~pages/not-found')),
} as const;

const routes: RouteObject[] = [
  {
    path: '/',
    element: <BaseTemplate />,
    children: [
      {
        index: true,
        element: <RouteComponent path="/home" />,
      },
      {
        path: 'members',
        element: <RouteComponent path="/members" />,
      },
      {
        path: 'saves',
        element: <RouteComponent path="/saves" isProtected />,
      },
      {
        path: 'posts',
        children: [
          {
            index: true,
            element: <RouteComponent path="/posts" />,
          },
          {
            path: ':id',
            element: <RouteComponent path="/posts/post" />,
          },
        ],
      },
      {
        path: ':uid',
        element: <RouteComponent path="/user" />,
        children: [
          {
            path: '',
            element: <RouteComponent path="/user/profile" />,
            children: [
              {
                index: true,
                element: <RouteComponent path="/user/profile/overview" />,
              },
              {
                path: 'stories',
                element: <RouteComponent path="/user/profile/stories" />,
              },
              {
                path: 'posts',
                element: <RouteComponent path="/user/profile/posts" />,
              },
            ],
          },
          {
            path: 'stories',
            element: <RouteComponent path="/user/stories" />,
            children: [
              {
                path: ':slug',
                element: <RouteComponent path="/user/stories/story" />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: <RouteComponent path="/auth/login" />,
      },
      {
        path: 'setting',
        element: <BaseTemplate />,
        children: [
          {
            index: true,
            element: <RouteComponent path="/auth/setting" isProtected />,
          },
        ],
      },
    ],
  },
  {
    path: '/post-editor',
    children: [
      {
        index: true,
        element: <RouteComponent path="/post-editor" isProtected />,
      },
      {
        path: ':postId',
        element: <RouteComponent path="/post-editor" isProtected />,
      },
    ],
  },
  {
    path: '/not-found',
    element: <RouteComponent path="/not-found" />,
  },
  {
    path: '/*',
    element: <Navigate to="/not-found" />,
  },
];

interface RouteComponentProps {
  path: keyof typeof PATH_TO_PAGE_MAP;
  isProtected?: boolean;
}

function RouteComponent({ path, isProtected = false }: RouteComponentProps) {
  const Container = isProtected ? PrivateRoute : PublicRoute;
  const Component = PATH_TO_PAGE_MAP[path];

  const setConfig = useSystemStore(useShallow(({ setConfig }) => setConfig));

  useEffectOnce(() => {
    const config = localStorage.getItem('config');
    const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (config !== null) {
      setConfig(JSON.parse(config));
    } else {
      setConfig((prev) => ({
        ...prev,
        themeMode: isDarkTheme ? 'dark' : 'light',
      }));
    }
  });

  return (
    <Container>
      <Component />
    </Container>
  );
}

export default routes;
