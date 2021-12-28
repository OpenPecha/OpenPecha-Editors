<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal bordered class="theme-color">
      <q-toolbar v-if="$q.platform.is.desktop">
        <q-btn
          v-show="navBackPath"
          dense
          flat
          round
          icon="arrow_back"
          :to="navBackPath"
          color="black"
        />
        <q-btn
          flat
          no-caps
          no-wrap
          class="q-ml-xs"
          v-if="$q.screen.gt.xs"
          :to="navBackPath === '' ? '' : '/'"
        >
          <q-toolbar-title class="text-bold">
            <span class="text-weight-medium q-ml-xs" style="color: #12dfec">
              Open</span
            >
            <span class="text-weight-medium" style="color: #8e57f1">Pecha</span>
          </q-toolbar-title>
        </q-btn>

        <q-space />

        <q-btn
          v-if="$auth.isAuthenticated || userAccessToken"
          flat
          dense
          icon="exit_to_app"
          color="danger"
          label="Logout"
          @click="logout"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "EditorLayout",
  data() {
    return {
      left: false,
      primaryNav: [{ icon: "home", text: "Home", to: "/editor/dashboard" }],
    };
  },

  computed: {
    ...mapState("app", ["navBackPath"]),
    ...mapGetters("app", ["userAccessToken"]),
  },

  methods: {
    logout() {
      if (this.$auth.isAuthenticated) {
        this.$auth.logout();
      }
      this.$store.dispatch("app/logout");
    },
  },
};
</script>
