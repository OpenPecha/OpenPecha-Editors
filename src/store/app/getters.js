export function isAuthenticated(state) {
    return state.isAuthenticated;
}

export function authUrl(state) {
    return state.authUrlBase + "?client_id=" + state.oauthClientId;
}

export function accessTokenUrl(state) {
    return state.accessTokenUrlBase;
}

export function userAccessToken(state) {
    return state.userAccessToken;
}