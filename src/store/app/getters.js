export function isAuthenticated(state) {
    return state.isAuthenticated;
}

export function githubAuthUrl(state) {
    return state.github.authUrl + "?client_id=" + state.github.clientId;
}

export function budaAuthUrl(state) {
    return state.buda.authUrl +
            "?client_id=" + state.buda.clientId +
            // "&response_type=" + state.buda.response_type +
            // "&scope=" + state.buda.scope +
            "&redirect_uri=" + state.buda.redirect_uri
}

export function accessTokenUrl(state) {
    return process.env.OPENPECHA_API_URL
}

export function userAccessToken(state) {
    return state.userAccessToken;
}