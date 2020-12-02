export function isAuthenticated(state) {
    return state.isAuthenticated;
}

export function authUrl(state) {
    state.authUrl + "?";
}

export function accessTokenUrl(state) {
    state.accessTokenUrl;
}