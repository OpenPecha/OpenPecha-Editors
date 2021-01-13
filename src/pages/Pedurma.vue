<template>
  <div v-if="isPagesLoaded" class="container">
    <q-card class="image-card">
      <img
        src="https://i0.wp.com/www.dontwasteyourtime.co.uk/wp-content/uploads/2012/07/screenshot_2012-07-26T15_37_48-0100.gif?ssl=1"
      />
    </q-card>

    <div class="edit">
      <div class="edit__editors">
        <div class="tabs row justify-between">
          <q-tabs
            v-model="editorTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="google" label="Google"></q-tab>
            <q-tab name="namsel" label="Namsel"></q-tab>
          </q-tabs>

          <q-tabs
            v-model="editorTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="google-notes" label="Google Note"></q-tab>
            <q-tab name="namsel-notes" label="Namsel Note"></q-tab>
          </q-tabs>
        </div>

        <q-tab-panels v-model="editorTab" animated>
          <q-tab-panel name="google">
            <editor
              ref="google"
              textAreaIdProp="google-textarea"
              currentLayerProp="google"
              :loadText="loadText"
              :getTextList="getTextList"
              :extraTools="false"
            />
          </q-tab-panel>

          <q-tab-panel name="namsel">
            <editor
              ref="namsel"
              textAreaIdProp="namsel-textarea"
              currentLayerProp="namsel"
              :loadText="loadText"
              :getTextList="getTextList"
              :extraTools="false"
            />
          </q-tab-panel>

          <q-tab-panel name="google-notes">
            <editor
              ref="google-note"
              textAreaIdProp="google-note-textarea"
              :extraTools="false"
              :hasList="false"
              :content="getNote('google', currentPageNo)"
            />
          </q-tab-panel>

          <q-tab-panel name="namsel-notes">
            <editor
              ref="namsel-note"
              textAreaIdProp="namsel-note-textarea"
              :extraTools="false"
              :hasList="false"
              :content="getNote('namsel', currentPageNo)"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <div class="preview">
      <div class="preview__btn">
        <q-btn color="secondary" label="Preview" @click="getPreview" />
      </div>
      <div class="preview__content q-mt-md" v-html="currentPreview"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PedurmaEditorPage",
  components: {
    editor: require("components/Editor/Editor.vue").default,
  },
  data() {
    return {
      currentPageNo: 1,
      currentPreview: "",
      editorTab: "google",
      editor: "google",
      isPagesLoaded: false,
      pages: {},
      notes: {},
    };
  },

  methods: {
    async getTextList(textType) {
      return this.pages[textType];
    },

    loadText(page) {
      this.currentPageNo = page.page_no;
      this.getPreview();
      return page.content;
    },

    saveText() {
      console.log("Save text");
    },

    getNote(textType, currentPageNo) {
      const notesPageId = this.pages[textType][currentPageNo - 1][
        "notes_page_id"
      ];

      for (var notesPage in this.notes[textType]) {
        if (notesPage.id == notesPageId) {
          return notesPage.content;
        }
      }
    },

    getCurrentPage(textType) {
      return this.pages[textType][this.currentPageNo - 1];
    },

    getPageNote(textType, page) {
      return this.notes[textType].find(
        (notesPage) => notesPage.id == page.notes_page_id
      );
    },

    async getPreview() {
      console.log("click");
      const googleCurrentPage = this.getCurrentPage("google");
      const namselCurrentPage = this.getCurrentPage("namsel");
      const googlePageNote = this.getPageNote("google", googleCurrentPage);
      const namselPageNote = this.getPageNote("namsel", namselCurrentPage);

      await this.$axios
        .post("http://127.0.0.1:8000/api/v1/pedurma/preview", {
          google_page: googleCurrentPage,
          google_page_note: googlePageNote,
          namsel_page: namselCurrentPage,
          namsel_page_note: namselPageNote,
        })
        .then((response) => response.data)
        .then((data) => {
          this.currentPreview = data.content;
        });
    },
  },

  async created() {
    const textId = this.$route.params.textId;
    const googlePechaId = this.$route.query.google;
    const namselPechaId = this.$route.query.namsel;

    //load google-ocr pages
    await this.$axios
      .get("http://127.0.0.1:8000/api/v1/" + googlePechaId + "/texts/" + textId)
      .then((response) => response.data)
      .then((data) => {
        this.pages.google = data.pages;
        this.notes.google = data.notes;
      });
    //load Namsel-ocr pages
    await this.$axios
      .get("http://127.0.0.1:8000/api/v1/" + namselPechaId + "/texts/" + textId)
      .then((response) => response.data)
      .then((data) => {
        this.pages.namsel = data.pages;
        this.notes.namsel = data.notes;
      });

    this.isPagesLoaded = true;
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  margin: 1rem;
  justify-content: space-between;
  justify-items: center;
  align-items: flex-start;
}

.image-card {
  width: 25%;
  margin-right: 0.625rem;
}

.edit {
  width: 40%;
  margin-right: 0.625rem;
}

.preview {
  width: 35%;

  &__content {
    padding: 5px;
    border: 1px solid #ccc;
  }
}
</style>