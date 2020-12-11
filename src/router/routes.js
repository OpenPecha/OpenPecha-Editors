
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
        path: '/basic/:pechaId',
        component: () => import('pages/Index.vue'),
      },
      {
        path: '/pedurma/:pechaId',
        component: () => import('pages/Pedurma.vue'),
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
