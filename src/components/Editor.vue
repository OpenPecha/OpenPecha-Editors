<template>
  <textarea name="" id="" cols="30" rows="10"></textarea>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("editor", ["qeditor"]),
  },
};
</script>

<style lang="sass" scoped>
</style>