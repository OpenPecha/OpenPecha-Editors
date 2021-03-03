<template>
  <q-card style="width: 700px; max-width: 700px">
    <q-card-section class="row">
      <q-space />
      <q-btn v-close-popup flat round dense icon="close" />
    </q-card-section>
    <q-card-section class="row justify-center">
      <div class="link q-pa-md bg-grey-2 text-grey-8">
        {{ link }}
        <q-icon
          right
          name="content_copy"
          size="sm"
          color="grey"
          class="cursor-pointer"
          @click="copy"
        >
          <q-tooltip>copy</q-tooltip>
        </q-icon>
      </div>
    </q-card-section>
    <q-card-section class="row justify-center">
      <q-btn
        type="a"
        :href="link"
        target="_blank"
        label="Download"
        icon="get_app"
        color="green-5"
        class="q-mb-lg"
        @click="download"
      />
    </q-card-section>
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