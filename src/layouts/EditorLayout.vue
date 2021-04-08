<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal bordered class="theme-color">
      <q-toolbar v-if="$q.platform.is.desktop">
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="left = !left"
          color="black"
        />
        <q-btn
          flat
          no-caps
          no-wrap
          class="q-ml-xs"
          v-if="$q.screen.gt.xs"
          to="/"
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

    <q-drawer v-model="left" side="left" overlay behavior="desktop" bordered>
      <q-list padding>
        <q-item
          v-for="link in primaryNav"
          :key="link.text"
          :to="link.to"
          v-ripple
          clickable
        >
          <q-item-section avatar>
            <q-icon color="grey" :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="">{{ link.text }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "EditorLayout",
  data() {
    return {
      left: false,
      primaryNav: [{ icon: "home", text: "Home", to: "/editor/dashboard" }],
    };
  },

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
