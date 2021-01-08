
const routes = [
  {
    path: '/login',
    component: () => import('layouts/Login.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        component: () => import('pages/Index.vue'),
      },
      {
        path: '/basic/:pechaId',
        component: () => import('pages/Basic.vue'),
      },
      {
        path: '/pedurma/:textId',
        component: () => import('pages/Pedurma.vue'),
      },
      {
        path: '/pedurma/notes/:textId',
        component: () => import('pages/PedurmaNotes.vue'),
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
