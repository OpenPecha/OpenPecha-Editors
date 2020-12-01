export function setEditor({ commit }, editor) {
    commit('setEditor', editor)
}

export function setOrg({ commit }, org) {
    commit("setOrg", org);
}

export function setRepo({ commit }, repo) {
    commit("setRepo", repo);
}
