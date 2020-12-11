<template>
  <q-header elevated class="bg-white text-primary">
    <q-toolbar v-if="$q.platform.is.desktop">
      <q-toolbar-title class="text-bold">OpenPecha Editor</q-toolbar-title>

      <q-btn flat dense icon="exit_to_app" label="Logout" @click="logout" />
    </q-toolbar>
  </q-header>
</template>

<script>
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions("app", ["logout"]),
  },
};
</script>

<style lang="scss" scoped>
</style>