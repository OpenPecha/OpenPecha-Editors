export default function () {
    return {
        // User
        isAuthenticated: false,
        userAccessToken: null,
        authUrl: "https://github.com/login/oauth/authorize",
        accessTokenUrl: "https://github.com/login/oauth/access_token",

        //toolbar
        showToolbar: true
    }
}