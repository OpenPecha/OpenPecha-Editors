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
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ 'layouts/Login.vue'),
  },
  {
    path: '/login/buda',
    component: () => import(/* webpackChunkName: "buda-login" */ 'layouts/BudaLogin.vue'),
  },
  {
    path: '/editor',
    component: () => import(/* webpackChunkName: "editor-layout" */ 'layouts/EditorLayout.vue'),
    children: [
      {
        path: '/editor/dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ 'pages/Dashboard.vue'),
        beforeEnter:  GHAuthenticationGuard
      },
      {
        path: '/editor/pedurma',
        component: () => import(/* webpackChunkName: "editor-pedurma-text-list" */ 'pages/PedurmaTextList.vue'),
        // beforeEnter: authenticationGuard,
      },
      {
        path: '/editor/proofread',
        component: () => import(/* webpackChunkName: "editor-proofread" */ 'pages/Proofread.vue'),
        beforeEnter: authenticationGuard,
      },
      {
        path: '/editor/:pechaId',
        component: () => import(/* webpackChunkName: "editor-pecha" */ 'pages/Editor.vue'),
        beforeEnter: GHAuthenticationGuard,
      },
      {
        path: '/editor/pedurma/:textId',
        component: () => import(/* webpackChunkName: "editor-pedurma-text" */ 'pages/editor/Pedurma.vue'),
        beforeEnter: authenticationGuard,
      },
      {
        path: '/editor/pedurma/:textId/notes',
        component: () => import(/* webpackChunkName: "editor-pedurma-text-note" */ 'pages/editor/PedurmaNotes.vue'),
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
    component: () => import(/* webpackChunkName: "404" */ 'pages/Error404.vue')
  }
]

export default routes
