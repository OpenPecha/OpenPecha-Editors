<template>
  <q-list>
    <q-item dense clickable v-for="text in textList" :key="text.name">
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
};
</script>

<style lang="scss" scoped>
</style>