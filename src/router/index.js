import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'


Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  // authenticate for protected pages
  // Router.beforeEach((to, before, next) => {
  //   // Allow finishing callback url for logging in
  //   if(to.matched.some(record => record.path == "/buda/callback")) {
  //     if (!Store.getters["app/isAyth0Initialized"]) {
  //       Store.dispatch("app/initAuth0")
  //     }
  //     Store.getters["app/auth0"].handleRedirectCallback()
  //       .then(redirectResult => {
  //         //logged in. you can get the user profile like this:
  //         auth0.getUser().then(user => {
  //           console.log(user);
  //         });
  //       });
  //     next(false)
  //   }

  //   let routerAuthCheckGithub = false;
  //   let routerAuthCheckBuda = false;
  //   if (to.matched.some(record => record.meta.requiresAuth)) {
  //     // init auth0
  //     if (!Store.getters["app/isAyth0Initialized"]) {
  //       Store.dispatch("app/initAuth0")
  //     }
  //     // Check if user is Authenticated
  //     if (routerAuthCheckGithub && routerAuthCheckBuda) {
  //       // user is authenticated
  //       Store.commit("app/setIsAuthenticated", {
  //         service: 'github',
  //         value: true
  //       })

  //       Store.commit("app/setIsAuthenticated", {
  //         service: 'buda',
  //         value: true
  //       })
  //       next();
  //     } else if (routerAuthCheckGithub) {
  //       Store.commit("app/setIsAuthenticated", {
  //         service: 'github',
  //         value: true
  //       })
  //       next();
  //     } else if (routerAuthCheckBuda) {
  //       Store.commit("app/setIsAuthenticated", {
  //         service: 'buda',
  //         value: true
  //       })
  //       next();
  //     } else {
  //       // User is not authenticated
  //       if (to.meta.authService == "buda") {
  //         Router.replace('/login/buda')
  //       } else {
  //         Router.replace('/login')
  //       }
  //     }
  //   } else {
  //     // Allow page to load
  //     next();
  //   }
  // })
  return Router
}
