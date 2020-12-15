<template>
  <q-page padding>
    <editor
      :loadText="loadText"
      :getTextList="getTextList"
      :saveText="saveText"
    />
  </q-page>
</template>

<script>
import { Loading } from "quasar";
import { Octokit } from "@octokit/core";

export default {
  name: "BasicEditorPage",
  components: {
    editor: require("components/Editor/Editor.vue").default,
  },

  data() {
    return {
      org: "OpenPecha",
      repo: "P000100",
    };
  },

  methods: {
    async getTextList(layer) {
      const ghClient = new Octokit({ auth: this.userAccessToken });
      const response = await ghClient.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner: this.org,
          repo: this.repo,
          ref: layer,
        }
      );
      return response.data;
    },

    base64ToUtf8(str) {
      return decodeURIComponent(escape(window.atob(str)));
    },

    utf8ToBase64(str) {
      return window.btoa(unescape(encodeURIComponent(str)));
    },

    async getRepoFileContent(org, repo, sha) {
      const ghClient = new Octokit({ auth: this.userAccessToken });
      const gh_response = await ghClient.request(
        "GET /repos/{owner}/{repo}/git/blobs/{file_sha}",
        {
          owner: org,
          repo: repo,
          file_sha: sha,
        }
      );

      const response = await fetch(gh_response["url"]);
      const data = await response.json();
      return this.base64ToUtf8(data["content"]);
    },

    async loadText(textFile) {
      Loading.show();
      const text = await this.getRepoFileContent(
        this.org,
        this.repo,
        textFile.sha
      );
      Loading.hide();
      return text;
    },

    async saveText() {
      const ghClient = new Octokit({ auth: this.userAccessToken });
      Loading.show();
      const response = await ghClient.request(
        "PUT /repos/{owner}/{repo}/contents/{path}",
        {
          owner: this.org,
          repo: this.repo,
          branch: this.currentLayer,
          path: this.currentTextFile.path,
          message: "update",
          content: this.utf8ToBase64(editor.doc.getValue()),
          sha: this.currentTextFile.sha,
        }
      );
      Loading.hide();

      if (response["status"] == 200) {
        alert("Changes saved!");
        const new_sha = response["data"]["content"]["sha"];
        $(editorForm).children("#sha").val(new_sha);
      } else {
        alert("Changes cannot be saved");
      }
    },
  },
};
</script>
