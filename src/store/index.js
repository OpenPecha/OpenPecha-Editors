import Vue from 'vue'
import Vuex from 'vuex'
import app from './app'
import proofread from "./proofread"


Vue.use(Vuex)

const Store = new Vuex.Store({
  modules: {
    app,
    proofread,
  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEBUGGING
})
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  return Store
}

export { Store }

