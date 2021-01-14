export default function () {
    return {
        // User
        isAuthenticated: false,

        // Oauth
        userAccessToken: null,
        authUrlBase: "https://github.com/login/oauth/authorize",
        oauthClientId: "ee82383cf85381446486",
    }
}