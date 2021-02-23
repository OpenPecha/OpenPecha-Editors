<template>
  <q-layout>
    <q-header elevated class="theme-color">
      <q-toolbar class="q-mt-md">
        <q-toolbar-title class="cursor-pointer" @click="goToHome">
          <q-img src="/icons/favicon-128x128.png" style="width: 40px" />
          <span class="text-weight-medium q-ml-xs" style="color: #12dfec">
            Open</span
          >
          <span class="text-weight-medium" style="color: #8e57f1">Pecha</span>
        </q-toolbar-title>
        <q-tabs shrink>
          <q-route-tab label="Featues" to="/features" />
          <q-route-tab label="About" to="/about" />
          <q-route-tab label="Contact" to="/contact" />
        </q-tabs>
      </q-toolbar>
    </q-header>
    <q-footer class="q-pa-md theme-color row justify-center">
      <div class="text-black text-weight-thin">
        Copyright &copy; {{ new Date().getFullYear() }} openpecha.org
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
export default {
  methods: {
    goToHome() {
      this.$router.push("/").catch((error) => {});
    },
  },
};
</script>
<style scoped>
.q-header {
  height: 5.625rem;
}
</style>