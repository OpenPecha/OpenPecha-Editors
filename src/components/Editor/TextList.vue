<template>
  <q-list>
    <q-item
      dense
      clickable
      v-for="(text, index) in textList"
      :key="text.name"
      @click="open(text)"
      :id="'text' + index"
    >
      <q-item-section class="text-grey-7">{{ text.name }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { mapGetters } from "vuex";
import { Octokit } from "@octokit/core";

export default {
  props: {
    layer: {
      type: String,
      default: "BaseText",
    },
    getTextList: {
      type: Function,
      required: true,
    },
  },

  methods: {
    open(text) {
      this.$emit("open-text", text);
    },
  },

  computed: {
    ...mapGetters("editor", ["org", "repo"]),
    ...mapGetters("app", ["userAccessToken"]),
  },

  asyncComputed: {
    textList() {
      return this.getTextList(this.org, this.repo, this.layer);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>