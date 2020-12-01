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
    async getOAuthToken() {
      const response = await fetch("/users/api/auth");
      const data = await response.json();
      return data["token"];
    },

    async getGHClient() {
      // const oauth_token = await getOAuthToken();
      const oauth_token = "b0928c5b358cd890f42e44bd29c5de68e52fc267";
      const octokit = new Octokit({ auth: oauth_token });
      return octokit;
    },

    async getBranchContent(org, repo, branch) {
      const ghClient = await this.getGHClient();
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