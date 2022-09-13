// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
  },
  project: {
    root: path(ROOTS_DASHBOARD, '/project'),
    list: path(ROOTS_DASHBOARD, '/project/list'),
    create: path(ROOTS_DASHBOARD, '/project/create'),
    update: path(ROOTS_DASHBOARD, '/project/update'),
  },
  page: {
    root: path(ROOTS_DASHBOARD, '/page'),
    list: path(ROOTS_DASHBOARD, '/page/list'),
    create: path(ROOTS_DASHBOARD, '/page/create'),
    update: path(ROOTS_DASHBOARD, '/page/update'),
  },
  text: {
    root: path(ROOTS_DASHBOARD, '/text'),
    list: path(ROOTS_DASHBOARD, '/text/list'),
    create: path(ROOTS_DASHBOARD, '/text/create'),
    update: path(ROOTS_DASHBOARD, '/text/update'),
  },
  // user: {
  //   root: path(ROOTS_DASHBOARD, '/user'),
  //   profile: path(ROOTS_DASHBOARD, '/user/profile'),
  //   cards: path(ROOTS_DASHBOARD, '/user/cards'),
  //   list: path(ROOTS_DASHBOARD, '/user/list'),
  //   newUser: path(ROOTS_DASHBOARD, '/user/new'),
  //   editById: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  //   account: path(ROOTS_DASHBOARD, '/user/account'),
  // },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
