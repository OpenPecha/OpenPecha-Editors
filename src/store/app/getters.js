export function userAccessToken(state) {
    if (state.userAccessToken) {
        return state.userAccessToken
    }
    return localStorage.getItem("token")
}
