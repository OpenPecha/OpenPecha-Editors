export function isAuthenticated(state) {
    return state.isAuthenticated;
}

export function authUrl(state) {
    return state.authUrl + "?client_id=" + state.clientId;
}

export function accessTokenUrl(state) {
    return state.accessTokenUrl;
}