import { authenticationGuard, GHAuthenticationGuard } from "../auth/auth-guard"

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        component: () => import('pages/Home.vue'),
      },
      {
        path: '/upload',
        component: () => import('pages/ImportText.vue'),
        beforeenter:  GHAuthenticationGuard
      },
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/Login.vue'),
  },
  {
    path: '/login/buda',
    component: () => import('layouts/BudaLogin.vue'),
  },
  {
    path: '/editor',
    component: () => import('layouts/EditorLayout.vue'),
    children: [
      {
        path: '/editor/dashboard',
        component: () => import('pages/Dashboard.vue'),
        beforeenter:  GHAuthenticationGuard
      },
      {
        path: '/editor/:pechaId',
        component: () => import('pages/Editor.vue'),
        beforeEnter: GHAuthenticationGuard
      },
      {
        path: '/editor/pedurma/:textId',
        component: () => import('pages/editor/Pedurma.vue'),
      },
      {
        path: '/editor/pedurma/:textId/notes',
        component: () => import('pages/editor/PedurmaNotes.vue'),
        beforeEnter: authenticationGuard
        // meta: {
        //   requiresAuth: true,
        //   authService: "buda"
        //  }
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
