import { Auth0Plugin } from "../auth/auth0-plugin";



export default ({ router, Vue }) => {
  // Install the authentication plugin
  Vue.use(Auth0Plugin, {
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    audience: process.env.AUTH0_AUDIENCE,
    response_type: process.env.AUTH0_RESPONSETYPE,
    scope: process.env.AUTH0_SCOPE,
    onRedirectCallback: (appState) => {
      router.push(
        appState && appState.targetUrl
          ? appState.targetUrl
          : window.location.pathname,
      );
    },
  });
}