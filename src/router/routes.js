import { authenticationGuard } from "../auth/auth-guard"

const routes = [
  {
    path: '/login',
    component: () => import('layouts/Login.vue'),
  },
  {
    path: '/login/buda',
    component: () => import('layouts/BudaLogin.vue'),
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
        path: '/pedurma/:textId/notes',
        component: () => import('pages/PedurmaNotes.vue'),
        beforeEnter: authenticationGuard
        // meta: {
        //   requiresAuth: true,
        //   authService: "buda"
        //  }
      },
      {
        path: '/annotate',
        component: () => import('pages/Annotation.vue'),
      },
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
