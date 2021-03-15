<template>
  <q-layout view="lHh lpR fFf">
    <q-header elevated class="bg-white text-primary">
      <q-toolbar v-if="$q.platform.is.desktop">
        <q-toolbar-title class="text-bold">OpenPecha Editor</q-toolbar-title>

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
import { mapGetters } from "vuex";

export default {
  name: "EditorLayout",
  computed: {
    ...mapGetters("app", ["userAccessToken"]),
  },

  methods: {
    logout() {
      if (this.$auth.isAuthenticated) {
        this.$auth.logout();
      }
      this.$store.dispatch("app/logout");
      this.$router.push({ path: "/" });
    },
  },
};
</script>
