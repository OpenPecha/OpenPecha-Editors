<template>
  <q-layout view="lHh lpR fFf">
    <app-header />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  components: {
    "app-header": require("components/Layout/Header/Header.vue").default,
  },
  data() {
    return {};
  },
};
</script>
