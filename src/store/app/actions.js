import axios from "axios";
import { Loading } from 'quasar';

export function logout({ commit }, payload) {
    Loading.show();
    commit('setIsAuthenticated', false)
    Loading.hide()
    this.$router.push("/login")
}

export async function getUserAccessToken({ commit }, payload) {
    const response = await axios.get(process.env.OPENPECHA_API_URL + "/api/v1/login/oauth/access_token", {
        params: { code: payload.code }
    });
    commit("setUserAccessToken", response.data.access_token)
    commit('setIsAuthenticated', true)
    this.$router.push(payload.nextUrl)
}
