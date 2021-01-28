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
