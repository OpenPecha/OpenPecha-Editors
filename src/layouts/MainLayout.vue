<template>
  <q-layout>
    <q-header class="fixed-top transparent q-py-sm">
      <q-toolbar class="q-mx-auto" style="max-width: 1080px">
        <q-toolbar-title class="cursor-pointer" @click="goToHome">
            <img
              :src="require('assets/img/openpecha-title.png')"
              style="width: 10rem"
              class="q-ml-sm q-mx-sm"
            />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-footer class="q-pa-md theme-color row justify-center">
      <div class="text-black text-weight-thin">
        Copyright &copy; {{ new Date().getFullYear() }} openpecha.org |
        <a
          class="q-ml-sm"
          href="mailto:contact@esukhia.org"
          style="color: inherit"
          >contact@esukiha.org</a
        >
      </div>
    </q-footer>
    <!-- <q-toolbar>
        <q-toolbar-title
          >openpecha.org</q-toolbar-title
        >
      </q-toolbar> -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { scroll } from "quasar";
const { getScrollTarget, setScrollPosition } = scroll;

export default {
  methods: {
    goToHome() {
      this.$router.push("/").catch((error) => {});
    },

    scrollToElement(id) {
      let el = document.getElementById(id);
      const target = getScrollTarget(el);
      const offset = el.offsetTop + 3;
      const duration = 900;
      setScrollPosition(target, offset, duration);
    },
  },
};
</script>
<style scoped>
.q-header {
  height: 5.625rem;
}
</style>