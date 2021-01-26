export function githubAuthUrl(state) {
    return state.github.authUrl + "?client_id=" + state.github.clientId;
}

export function accessTokenUrl(state) {
    return process.env.OPENPECHA_API_URL
}

export function githubUserAccessToken(state) {
    return state.github.userAccessToken;
}

export function isAuth0Initialized(state) {
    return (state.auth0 ? true : false);
}