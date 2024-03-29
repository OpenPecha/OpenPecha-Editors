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
    path: '/',
    component: () => import(/* webpackChunkName: "editor-layout" */ 'layouts/EditorLayout.vue'),
    children: [
      {
        path: '/editor/dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ 'pages/Dashboard.vue'),
        beforeEnter:  GHAuthenticationGuard
      },
      {
        path: '/editor/proofread',
        component: () => import(/* webpackChunkName: "editor-proofread" */ 'src/pages/proofreading/DiffProofread.vue'),
        beforeEnter: authenticationGuard,
      },
      {
        path: '/editor/:pechaId',
        component: () => import(/* webpackChunkName: "editor-pecha" */ 'pages/Editor.vue'),
        beforeEnter: GHAuthenticationGuard,
      },

      {
        path: '/pedurma/catalog',
        component: () => import(/* webpackChunkName: "editor-pedurma-text-list" */ 'src/pages/pedurma/PedurmaTextList.vue'),
        // beforeEnter: authenticationGuard,
      },
      {
        path: '/pedurma/:textId',
        component: () => import(/* webpackChunkName: "editor-pedurma-text" */ 'src/pages/pedurma/PedurmaText.vue'),
        // beforeEnter: authenticationGuard,
      },
      {
        path: '/pedurma/:textId/notes',
        component: () => import(/* webpackChunkName: "editor-pedurma-text-note" */ 'pages/editor/PedurmaNotes.vue'),
        beforeEnter: authenticationGuard
        // meta: {
        //   requiresAuth: true,
        //   authService: "buda"
        //  }
      },
      {
        path: '/pedurma/:textId/notes/proofread',
        component: () => import(/* webpackChunkName: "editor-pedurma-text-notes-proofread" */ 'pages/proofreading/PedurmaNotesProofread.vue'),
        // beforeEnter: authenticationGuard
        // meta: {
        //   requiresAuth: true,
        //   authService: "buda"
        //  }
      },

      {
        path: '/proofread',
        component: () => import(/* webpackChunkName: "editor-proofread" */ 'src/pages/proofreading/ProofreadPechaList.vue'),
      },
      // {
      //   path: '/proofread/:pechaId',
      //   component: () => import(/* webpackChunkName: "editor-proofread" */ 'src/pages/proofreading/ProofreadVolumeList.vue'),
      // },
      // {
      //   path: '/proofread/:pechaId/:volId',
      //   component: () => import(/* webpackChunkName: "editor-proofread" */ 'src/pages/proofreading/ProofreadEditor.vue'),
      //   beforeEnter: authenticationGuard,
      // },

      {
        path: '/proofread/:projectName/:volId',
        component: () => import(/* webpackChunkName: "proofread-editor" */ 'src/pages/Proofread.vue')
      }
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
