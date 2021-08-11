<template>
  <div>Proofreading editor</div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ProofreadEditor",

  computed: {
    pechaId() {
      return this.$route.params.pechaId;
    },
  },

  methods: {
    ...mapActions("app", ["setNavBackPath"]),
  },

  created() {
    this.setNavBackPath(`/proofread/${this.pechaId}`);
  },
};
</script>

<style lang="scss" scoped>
</style>