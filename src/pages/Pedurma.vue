<template>
  <div class="container">
    <q-card class="image-card">
      <img
        src="https://i0.wp.com/www.dontwasteyourtime.co.uk/wp-content/uploads/2012/07/screenshot_2012-07-26T15_37_48-0100.gif?ssl=1"
      />
    </q-card>

    <div class="editor">
      <editor
        class="editor__editor"
        :loadText="loadText"
        :getTextList="getTextList"
      />
    </div>
    <div class="preview">Preview</div>
  </div>
</template>

<script>
export default {
  name: "PedurmaEditorPage",
  data() {
    return {
      currentPageIdx: 1,
      pages: [
        {
          id: 1,
          name: "Page 1",
          page_no: 1,
          content: "Page 1 example text",
          durchen_id: 1,
        },
        {
          id: 2,
          name: "Page 2",
          content: "Page 2 example text",
          durchen_id: 1,
        },
      ],
      durchens: {
        1: {
          page_no: 100,
          content: "Durchen page 1 example",
        },
      },
    };
  },

  components: {
    editor: require("components/Editor/Editor.vue").default,
  },

  methods: {
    async getTextList(layer) {
      return this.pages;
    },

    loadText(textFile) {
      return "this is example text";
    },

    saveText() {
      console.log("Save text");
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  margin: 1rem;
  justify-content: space-between;
  justify-items: center;
}

.image-card {
  width: 25%;
  margin-right: 0.625rem;
}

.editor {
  width: 50%;
  margin-right: 0.625rem;

  &__editor {
    width: 100%;
  }
}

.preview {
  width: 25%;
}
</style>