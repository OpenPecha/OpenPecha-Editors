export function githubAuthUrl(state) {
    return state.authUrl + "?client_id=" + state.clientId;
}

export function accessTokenUrl(state) {
    return process.env.OPENPECHA_API_URL
}

export function githubUserAccessToken(state) {
    return state.userAccessToken;
}
