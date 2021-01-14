export function isAuthenticated(state) {
    return state.isAuthenticated;
}

export function authUrl(state) {
    return process.env.OPENPECHA_API_URL + "/api/v1/login/oauth/access_token?client_id=" + state.oauthClientId;
}

export function accessTokenUrl(state) {
    return state.accessTokenUrlBase;
}

export function userAccessToken(state) {
    return state.userAccessToken;
}