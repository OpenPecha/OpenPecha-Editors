<template>
  <q-card>
    <q-card-section class="row">
      <div class="text-h6">Pecha Secret Key</div>
      <q-space />
      <q-btn v-close-popup flat round dense icon="close" />
    </q-card-section>

    <form @submit.prevent="submitForm">
      <q-card-section class="q-pt-none">
        <div class="row q-mb-sm">
          <q-input
            clearable
            clear-icon="close"
            outlined
            autofocus
            v-model="pechaSecretKey"
            :rules="[(val) => !!val || 'Field is required']"
            ref="pechaSecretKey"
            label="Pecha Secret Key"
            class="col"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Save" color="primary" type="submit" />
      </q-card-actions>
    </form>
  </q-card>
</template>

<script>
export default {
  data() {
    return {
      pechaSecretKey: "",
    };
  },
  methods: {
    submitForm() {
      this.$emit("close");
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>