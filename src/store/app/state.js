export default function () {
    return {
        // User
        isAuthenticated: false,

        // Oauth
        userAccessToken: null,
        authUrlBase: "https://github.com/login/oauth/authorize",
        accessTokenUrlBase: "http://localhost:8000/api/v1/login/oauth/access_token",
        oauthClientId: "ee82383cf85381446486",
    }
}