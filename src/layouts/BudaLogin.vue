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
              @click="login"
              size="lg"
              color="primary"
              class="full-width"
              label="Login"
            />
          </q-card-actions>
          <q-card-section class="q-pt-none">
            <a href="https://library.bdrc.io/"> Not Registered? </a>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { Loading } from "quasar";
export default {
  name: "LoginWithBuda",
  data() {
    return {};
  },

  methods: {
    login() {
      this.$auth.login();
      Loading.show();
    },
  },
};
</script>

<style>
.q-card {
  width: 360px;
}
</style>
