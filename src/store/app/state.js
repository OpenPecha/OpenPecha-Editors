export default function () {
    return {
        // User
        isAuthenticated: false,

        // Oauth
        userAccessToken: null,
        github: {
            authUrl: "https://github.com/login/oauth/authorize",
            clientId: "ee82383cf85381446486"
        },
        buda: {
            authUrl: "https://bdrc-io.auth0.com/authorize",
            clientId: "i0CoWiN3twEMPCA85f0aD9acuIVIFj0J",
            response_type: "token id_token",
            redirect_uri: "http://localhost:8080/login",
            scope: "openid profile",
        }
    }
}