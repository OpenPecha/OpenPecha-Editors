<template>
  <div v-if="isPagesLoaded" class="container">
    <q-card class="image-card">
      <img
        src="https://i0.wp.com/www.dontwasteyourtime.co.uk/wp-content/uploads/2012/07/screenshot_2012-07-26T15_37_48-0100.gif?ssl=1"
      />
    </q-card>

    <div class="edit">
      <div class="edit__select">
        <q-btn-group outline>
          <q-btn
            outline
            no-caps
            size="0.75rem"
            color="grey-9"
            label="Google"
            id="google-btn"
            class="bg-blue-3"
            @click="selectEditor('google', 'google-btn')"
          />
          <q-btn
            outline
            no-caps
            size="0.75rem"
            color="grey-6"
            label="Namsel"
            id="namsel-btn"
            @click="selectEditor('namsel', 'namsel-btn')"
          />
        </q-btn-group>
        <q-btn-group outline>
          <q-btn
            outline
            no-caps
            size="0.75rem"
            color="grey-6"
            label="Google Note"
            id="google-note-btn"
            @click="selectEditor('google-note', 'google-note-btn')"
          />
          <q-btn
            outline
            no-caps
            size="0.75rem"
            color="grey-6"
            label="Namsel Note"
            id="namsel-note-btn"
            @click="selectEditor('namsel-note', 'namsel-note-btn')"
          />
        </q-btn-group>
      </div>
      <div class="edit__editors">
        <editor
          id="google"
          class="edit__editor active"
          textAreaIdProp="google-textarea"
          currentLayerProp="google"
          :loadText="loadText"
          :getTextList="getTextList"
          :extraTools="false"
        />
        <editor
          id="namsel"
          class="edit__editor"
          textAreaIdProp="namsel-textarea"
          currentLayerProp="namsel"
          :loadText="loadText"
          :getTextList="getTextList"
          :extraTools="false"
        />
        <editor
          id="google-note"
          textAreaIdProp="google-note-textarea"
          class="edit__editor"
          :extraTools="false"
          :hasList="false"
          :content="getNote('google', currentPageNo)"
        />
        <editor
          id="namsel-note"
          class="edit__editor"
          textAreaIdProp="namsel-note-textarea"
          :extraTools="false"
          :hasList="false"
          :content="getNote('namsel', currentPageNo)"
        />
      </div>
    </div>
    <div class="preview">
      <p>{{ currentPreview }}</p>
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

    selectEditor(editorName, btnId) {
      // active the editor
      const currentActivedEditor = document.querySelector(
        ".edit__editor.active"
      );
      currentActivedEditor.classList.remove("active");
      const toActivateEditor = document.querySelector("#" + editorName);
      toActivateEditor.classList.add("active");

      // add ative style to button
      const nonActiveCls = "text-grey-6";
      const activeCls = "text-grey-9";
      const activeClsBg = "bg-blue-3";
      const btnGroups = document
        .querySelector(".edit__select")
        .querySelectorAll(".q-btn-group");
      btnGroups.forEach(function (btnGroup) {
        const currentActivedBtn = btnGroup.querySelector(".q-btn.bg-blue-3");
        if (currentActivedBtn) {
          currentActivedBtn.classList.remove(activeCls, activeClsBg);
          currentActivedBtn.classList.add(nonActiveCls);
        }
      });

      const toActivateBtn = document.querySelector("#" + btnId);
      toActivateBtn.classList.add(activeCls, activeClsBg);
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
  width: 50%;
  margin-right: 0.625rem;

  &__select {
    display: flex;
    justify-content: space-between;
  }

  &__editors {
    width: 100%;
    margin-top: 5px;
  }

  &__editor {
    display: none;

    &.active {
      display: block;
    }
  }
}

.preview {
  width: 25%;
}
</style>