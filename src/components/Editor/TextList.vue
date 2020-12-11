<template>
  <q-list>
    <q-item
      dense
      clickable
      v-for="(text, index) in textList"
      :key="text.name"
      @click="open(text)"
      :ref="'text' + index"
    >
      <q-item-section class="text-grey-7">{{ text.name }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { mapGetters } from "vuex";
import { Octokit } from "@octokit/core";

export default {
  props: ["layer"],
  methods: {
    async getBranchContent(org, repo, branch) {
      const ghClient = new Octokit({ auth: this.userAccessToken });
      const response = await ghClient.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner: org,
          repo: repo,
          ref: branch,
        }
      );
      return response.data;
    },

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
      return this.getBranchContent(this.org, this.repo, this.layer);
    },
  },

  updated() {
    this.$refs["text0"][0].$el.click();
  },
};
</script>

<style lang="scss" scoped>
</style>