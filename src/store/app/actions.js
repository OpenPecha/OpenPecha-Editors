import { Loading } from 'quasar';

export function login({ commit }, payload) {
    Loading.show();
    commit('setIsAuthenticated', true)
    Loading.hide()
}

export function logout({ commit }, payload) {
    Loading.show();
    commit('setIsAuthenticated', false)
    Loading.hide()
}