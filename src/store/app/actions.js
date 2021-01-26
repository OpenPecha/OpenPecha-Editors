import createAuth0Client from '@auth0/auth0-spa-js';
import axios from "axios";
import { Loading } from 'quasar';

export function logout({ commit }, payload) {
    Loading.show();
    commit('setIsAuthenticated', false)
    Loading.hide()
    this.$router.push("/login")
}

export async function getUserAccessToken({ commit, getters }, payload) {
    const response = await axios.get(getters.accessTokenUrl + "/api/v1/login/oauth/access_token", {
        params: payload
    });
    commit("setUserAccessToken", response.data.access_token)
    commit('setIsAuthenticated', true)
    this.$router.push("/basic/P000001")
}

export async function auth0Login({ state }) {
    console.log("in a store action named")
    await state.auth0.loginWithRedirect()
}

export async function initAuth0({ commit }) {
  const auth0 = await createAuth0Client({
      domain: process.env.AUTH0_DOMAIN,
      client_id: process.env.AUTH0_CLIENT_ID,
      redirectUri: process.env.OP_EDITOR_DOMAINURL + '/callback',
      responseType: process.env.AUTH0_RESPONSETYPE,
      scope: process.env.AUTH0_SCOPE,
  })
  commit("initAuth0", auth0)
}