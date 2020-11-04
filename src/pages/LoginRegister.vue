<template>
  <q-page
    class="bg-white window-height window-width row justify-center items-center"
  >
    <q-card square bordered class="q-pa-lg shadow-8">
      <q-card-section>
        <div class="text-h4">Online Editor</div>
        <div class="text-subtitle2 text-grey">by OpenPecha.org</div>
      </q-card-section>

      <q-card-actions v-if="!isAuthenticated" class="q-px-md">
        <q-btn
          @click="login"
          size="lg"
          color="primary"
          class="full-width"
          label="Login"
        />
      </q-card-actions>

      <q-card-actions vertical v-if="isAuthenticated">
        <div class="text-h6">Register as</div>
        <q-btn
          @click="showRegisterOwner = true"
          size="lg"
          color="primary"
          class="full-width"
          label="Owner"
        />
        <q-btn
          to="/"
          size="lg"
          color="primary"
          class="row full-width"
          label="Contributor"
        />
      </q-card-actions>
    </q-card>

    <q-dialog v-model="showRegisterOwner" position="top">
      <register-owner @close="showRegisterOwner = false"></register-owner>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      showRegisterOwner: false,
    };
  },
  computed: {
    ...mapGetters("app", ["isAuthenticated"]),
  },
  methods: {
    ...mapActions("app", ["login", "logout"]),
  },
  components: {
    "register-owner": require("components/Modals/RegisterOnwer.vue").default,
  },
};
</script>

<style>
.q-card {
  width: 360px;
}
</style>
