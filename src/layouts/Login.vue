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
          <q-card-section>
            <q-input
              square
              outlined
              clearable
              v-model="username"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Please enter an github username',
              ]"
              label="Github Username"
            />
            <q-input
              square
              outlined
              clearable
              v-model="password"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Please enter a Github password',
              ]"
              type="password"
              label="Github Password"
            />
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
  name: "LoginRegister",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  computed: {
    ...mapGetters("app", ["isAuthenticated"]),
  },
  methods: {
    ...mapActions("app", ["login", "logout"]),
  },
  components: {
    "register-owner": require("components/Modals/RegisterOwner.vue").default,
  },
};
</script>

<style>
.q-card {
  width: 360px;
}
</style>
