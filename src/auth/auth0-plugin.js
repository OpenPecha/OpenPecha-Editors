import createAuth0Client from "@auth0/auth0-spa-js";
import axios from "axios";
import { Loading } from 'quasar';
import Vue from "vue";

/**
 *  Vue Instance Definition
 */

let instance;

export const getInstance = () => instance;

/**
 *  Vue Instance Initialization
 */

export const useAuth0 = ({
  onRedirectCallback = () =>
    window.history.replaceState({}, document.title, window.location.pathname),
  redirectUri = window.location.origin,
  ...pluginOptions
}) => {
  if (instance) return instance;

  instance = new Vue({
    data() {
      return {
        auth0Client: null,
        isLoading: true,
        isAuthenticated: false,
        user: {},
        error: null,
      };
    },
    methods: {
      async handleRedirectCallback() {
        this.isLoading = true;
        Loading.show()
        try {
          await this.auth0Client.handleRedirectCallback();
          this.user = await this.auth0Client.getUser();
          this.isAuthenticated = true;
        } catch (error) {
          this.error = error;
        } finally {
          this.isLoading = false;
          Loading.hide()
        }
      },

      login(options) {
        return this.auth0Client.loginWithRedirect(options);
      },

      async logout(options) {
        const response = await axios.get(process.env.IFFFServerURL + "/setcookie")
        console.log("unset cookie", response)
        return this.auth0Client.logout(options);
      },

      async getToken(o) {
        const idToken = await this.auth0Client.getTokenSilently(o);
        console.log(idToken)
        console.log(process.env.IFFFServerURL)
        const headers = { Authorization:"Bearer "+idToken }
        const params = { credentials: "include" }
        const response = await axios.get(process.env.IFFFServerURL + "/setcookie", {headers: headers, params: params})
        console.log("cookie", response)
        return idToken
      },
    },

    async created() {
      this.auth0Client = await createAuth0Client({
        ...pluginOptions,
        domain: pluginOptions.domain,
        client_id: pluginOptions.clientId,
        audience: pluginOptions.audience,
        redirect_uri: redirectUri,
      });

      try {
        if (
          window.location.search.includes("code=") &&
          window.location.search.includes("state=")
        ) {
          const { appState } = await this.auth0Client.handleRedirectCallback();

          onRedirectCallback(appState);
        }
      } catch (error) {
        this.error = error;
      } finally {
        this.isAuthenticated = await this.auth0Client.isAuthenticated();
        this.user = await this.auth0Client.getUser();
        this.isLoading = false;
        Loading.hide()
      }
    },
  });

  return instance;
};

/**
 *  Vue Plugin Definition
 */

export const Auth0Plugin = {
  install(Vue, options) {
    Vue.prototype.$auth = useAuth0(options);
  },
};
