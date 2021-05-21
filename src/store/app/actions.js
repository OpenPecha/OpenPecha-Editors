import axios from "axios";
import { Notify } from 'quasar';

export function logout({ commit }) {
    commit("unsetUserAccessToken")
    this.$router.push("/")
}

export async function getUserAccessToken({ commit }, payload) {
    try {
        const response = await axios.get(process.env.OPENPECHA_API_URL + "/api/v1/login/oauth/access_token", {
            params: { code: payload.code }
        });

        if (response.data.access_token) {
            commit("setUserAccessToken", response.data.access_token)
            this.$router.push(payload.nextUrl)
        } else {
            Notify.create({
                type: "negative",
                message: "user couldn't sign in"
            })
        }
    } catch (err) {
        console.log(err)
    }
}
