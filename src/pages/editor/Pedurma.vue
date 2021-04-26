<template>
  <div v-if="!loading" class="container">
    <q-card class="image-card">
      <img :src="pages.namsel[currentPageIdx].image_link" />
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
            <q-btn
              flat
              round
              dense
              icon="menu"
              class="q-ml-sm"
              @click.prevent="showPages = !showPages"
            >
              <q-tooltip>show pages</q-tooltip>
            </q-btn>
            <q-tab name="namsel" label="Namsel"></q-tab>
          </q-tabs>

          <div class="q-pt-sm text-grey">
            Page - {{ pages.namsel[currentPageIdx].page_no }}
          </div>

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
          <q-tab-panel name="namsel" class="row">
            <q-list v-show="showPages" class="col-2" bordered separator>
              <q-item
                v-for="(page, index) in pages.namsel"
                :key="page.id"
                @click="
                  currentPageIdx = index;
                  showPages = false;
                "
                clickable
                v-ripple
              >
                <q-item-section>page - {{ page.page_no }}</q-item-section>
              </q-item>
            </q-list>
            <editor class="col" :text="getPageText()" @input="updatePage" />
          </q-tab-panel>
          <q-tab-panel name="google-notes">
            <editor :text="getNote('google')" @input="updateGoogleNote" />
          </q-tab-panel>

          <q-tab-panel name="namsel-notes">
            <editor :text="getNote('namsel')" @inpute="updateNamselNote" />
          </q-tab-panel>
        </q-tab-panels>
        <q-btn
          class="q-mt-sm full-width"
          color="green-5"
          label="save"
          @click="save"
        />
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
import { getOrigin } from "src/utils";

export default {
  name: "PedurmaDashbaord",
  components: {
    editor: require("components/Pedurma/Editor.vue").default,
  },

  data() {
    return {
      currentPageIdx: 0,
      currentPreview: "",
      editorTab: "namsel",
      editor: "namsel",
      loading: true,
      showPages: false,
      pages: {},
      notes: {},
    };
  },

  computed: {
    notesDict() {
      const notesDict = {};
      const googleNotesDict = {};
      const namselNotesDict = {};
      this.notes.google.forEach((note) => {
        googleNotesDict[note.id] = note;
      });
      this.notes.namsel.forEach((note) => {
        namselNotesDict[note.id] = note;
      });
      notesDict["google"] = googleNotesDict;
      notesDict["namsel"] = namselNotesDict;
      return notesDict;
    },

    textId() {
      return this.$route.params.textId;
    },
  },

  created() {
    this.fetchText();
  },

  methods: {
    getPageText() {
      // this.getPreview();
      return this.pages.namsel[this.currentPageIdx].content;
    },

    getNote(textType) {
      const noteId = this.pages[textType][this.currentPageIdx].note_ref;
      if (!noteId) {
        return "";
      }
      return this.notesDict[textType][noteId].content;
    },

    updatePage(value) {
      console.log(value);
      this.pages.namsel[this.currentPageIdx].content = value;
    },

    updateNote(textType, value) {
      const noteId = this.pages[textType][this.currentPageIdx].note_ref;
      this.notesDict[textType][noteId].content = value;
    },

    updateGoogleNote(value) {
      this.updateNote("google", value);
    },

    updateNamselNote(value) {
      this.updateNote("namsel", value);
    },

    dict2List(obj) {
      const list = [];
      for (const [key, value] of Object.entries(obj)) {
        list.push(value);
      }
      return list;
    },

    async getPreview() {
      const googlePage = this.pages.google[this.currentPageIdx];
      const namselPage = this.pages.namsel[this.currentPageIdx];
      const googleNote = this.notesDict.google[googlePage.note_ref];
      const namselNote = this.notesDict.namsel[namselPage.note_ref];

      await this.$axios
        .post(getOrigin() + "/api/v1/pedurma/preview", {
          google_page: googlePage,
          google_page_note: googleNote,
          namsel_page: namselPage,
          namsel_page_note: namselNote,
        })
        .then((response) => response.data)
        .then((data) => {
          this.currentPreview = data.content;
        });
    },

    async fetchText() {
      this.$q.loading.show();
      const textId = this.$route.params.textId;
      const googlePechaId = this.$route.query.google;
      const namselPechaId = this.$route.query.namsel;

      //load google-ocr pages
      await this.$axios
        .get(
          process.env.OPENPECHA_API_URL +
            "/api/v1/pedurma/" +
            googlePechaId +
            "/texts/" +
            textId
        )
        .then((response) => response.data)
        .then((data) => {
          this.pages.google = data.pages;
          this.notes.google = data.notes;
        });

      //load Namsel-ocr pages
      await this.$axios
        .get(
          process.env.OPENPECHA_API_URL +
            "/api/v1/pedurma/" +
            namselPechaId +
            "/texts/" +
            textId
        )
        .then((response) => response.data)
        .then((data) => {
          this.pages.namsel = data.pages;
          this.notes.namsel = data.notes;
        });

      this.loading = false;
      this.$q.loading.hide();
    },

    saveText(textType) {
      this.$axios
        .post(getOrigin() + "/api/v1/pedurma/save", {
          id: this.textId,
          pages: this.pages[textType],
          notes: this.dict2List(this.notesDict[textType]),
        })
        .then((response) => {
          this.$q.notify({
            type: "positive",
            message: "saved " + textType + " text",
            position: "bottom-right",
          });
        })
        .catch((error) => {
          console.log(error);
          this.$q.notify({
            type: "negative",
            message: "could not save " + textType + " text",
            position: "bottom-right",
          });
          return;
        });
    },

    save() {
      this.saveText("google");
      this.saveText("namsel");
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