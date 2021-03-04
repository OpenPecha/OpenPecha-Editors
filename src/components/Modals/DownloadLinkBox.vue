<template>
  <q-card style="width: 500px; max-width: 700px" class="q-pl-md q-pr-md">
    <q-card-section class="row">
      <q-space />
      <q-btn v-close-popup flat round dense icon="close" />
    </q-card-section>
    <q-card-section class="row">
      <q-input class="col-11" filled v-model="link" color="grey" readonly />
      <q-icon
        class="col self-center cursor-pointer"
        right
        name="content_copy"
        size="md"
        color="grey"
        @click="copy"
      >
        <q-tooltip>copy</q-tooltip>
      </q-icon>
    </q-card-section>
    <q-card-section class="row justify-center">
      <div class="text-grey text-weight-light">OR</div>
    </q-card-section>
    <q-card-section class="row justify-center">
      <q-btn
        type="a"
        :href="link"
        target="_blank"
        label="Download"
        icon="get_app"
        color="green-5"
        @click="download"
      />
    </q-card-section>
    <q-card-section> </q-card-section>
  </q-card>
</template>

<script>
import { copyToClipboard } from "quasar";
export default {
  props: ["link"],

  methods: {
    copy() {
      copyToClipboard(this.link)
        .then(() => {
          this.$q.notify({
            type: "positive",
            message: "Download link copied",
          });
        })
        .catch(() => {
          this.$q.notify({
            type: "negative",
            message: "Download link could not be copied",
          });
        });
    },
  },
};
</script>

<style lang="sass" scoped>
.link
  border-radius: .3rem
</style>