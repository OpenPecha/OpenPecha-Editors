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
  },
};
</script>
