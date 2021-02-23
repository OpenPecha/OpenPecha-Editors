import { Store } from "src/store"
import { authenticationGuard } from "../auth/auth-guard"

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
        path: '/features',
        component: () => import('pages/Features.vue'),
      },
      {
        path: '/about',
        component: () => import('pages/About.vue'),
      },
      {
        path: '/contact',
        component: () => import('pages/Contact.vue'),
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
        path: '/editor/basic/:pechaId',
        component: () => import('pages/editor/Basic.vue'),
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
      {
        path: '/annotate',
        component: () => import('pages/Annotation.vue'),
        beforeEnter: (to, from, next) => {
          console.log(Store)
          if (Store.getters['app/githubUserAccessToken']) {
            next()
          } else {
            next("/login?nextUrl=" + to.fullPath)
          }
        }
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
