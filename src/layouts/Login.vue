<template>
  <q-layout>
    <q-page-container>
      <q-page
        class="bg-white window-height window-width row justify-center items-center"
      >
        <q-card square bordered class="q-pa-lg shadow-8">
          <q-card-section>
            <div class="text-h4">Editor</div>
            <div class="text-subtitle2 text-grey">by OpenPecha.org</div>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
              @click="oauthPopupFlow"
              size="lg"
              color="primary"
              class="full-width"
              label="Login"
            />
          </q-card-actions>
          <q-card-section class="q-pt-none">
            <a href="https://github.com/join"> Not Registered? </a>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

export default {
  name: "LoginWithGithub",

  created() {
    if (window.opener) {
      const code = window.location
        .toString()
        .replace(/.+code=/, "")
        .replace(/#.+/, "");
      if (code) {
        window.opener.postMessage({ code: code }, window.location);
        window.close();
      }
    }
  },

  computed: {
    ...mapGetters("app", ["authUrl", "accessTokenUrl"]),
  },

  mounted() {
    window.addEventListener("message", this.onMessage, false);
  },

  beforeDestroy() {
    window.removeEventListener("message", this.onMessage);
  },

  methods: {
    ...mapActions("app", ["login", "logout"]),

    oauthPopupFlow() {
      const newWindow = openWindow("", this.$t("login"));
      this.login(newWindow);
    },

    async login(newwindow) {
      console.log(this.authUrl, this.accessTokenUrl);
      openWindow(
        "https://github.com/login/oauth/authorize?client_id=ee82383cf85381446486",
        this.$t("login")
      );
    },

    onMessage(e) {
      if (e.origin !== window.origin || !e.data.code) {
        return;
      }
      this.getAcessToken(e.data.code);
    },

    getAcessToken(code) {
      console.log(code);
    },
  },
};

function openWindow(url, title, options = {}) {
  if (typeof url === "object") {
    options = url;
    url = "";
  }
  options = { url, title, width: 600, height: 720, ...options };
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screen.left;
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screen.top;
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    window.screen.width;
  const height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    window.screen.height;
  options.self = "_self";
  options.left = width / 2 - options.width / 2 + dualScreenLeft;
  options.top = height / 2 - options.height / 2 + dualScreenTop;
  const optionsStr = Object.keys(options)
    .reduce((acc, key) => {
      acc.push(`${key}=${options[key]}`);
      return acc;
    }, [])
    .join(",");
  const newWindow = window.open(url, title, optionsStr);
  if (!newWindow) {
    console.log(
      "Please unblock popups in your browser settings to login with Github"
    );
  } else if (window.focus) {
    newWindow.focus();
  }
  return newWindow;
}
</script>

<style>
.q-card {
  width: 360px;
}
</style>
