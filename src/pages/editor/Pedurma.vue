<template>
  <div v-if="!loading" class="container">
    <q-card class="image-card">
      <img :src="imgLink" />
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
            <q-tab
              name="google-notes"
              label="Google Note"
              @click="updateImg('google')"
            ></q-tab>
            <q-tab
              name="namsel-notes"
              label="Namsel Note"
              @click="updateImg('namsel')"
            ></q-tab>
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
                  getPreview();
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
            <editor :text="getNote('namsel')" @input="updateNamselNote" />
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
      <q-input
        outlined
        readonly
        :value="currentPreview"
        type="textarea"
        :input-style="{ height: '700px' }"
        class="q-mt-md"
      />
    </div>
  </div>
</template>

<script>
import { getOrigin } from "src/utils";

const NAMSEL = "namsel";
const GOOGLE = "google";
const KANGYUR_PECHAS = {
  google: process.env.K_GOOGLE_PECHA_ID,
  namsel: process.env.K_NAMSEL_PECHA_ID,
};
const TENGYUR_PECHAS = {
  google: process.env.T_GOOGLE_PECHA_ID,
  namsel: process.env.T_NAMSEL_PECHA_ID,
};

export default {
  name: "PedurmaEditor",
  components: {
    editor: require("components/Pedurma/Editor.vue").default,
  },

  data() {
    return {
      currentPageIdx: 0,
      currentPreview: "",
      editorTab: NAMSEL,
      editor: NAMSEL,
      loading: true,
      showPages: false,
      pages: {},
      notes: {},
      textObjIds: {},
      imgLink: "",
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
      notesDict[GOOGLE] = googleNotesDict;
      notesDict[NAMSEL] = namselNotesDict;
      return notesDict;
    },

    textId() {
      return this.$route.params.textId;
    },
  },

  async created() {
    this.$q.loading.show({
      message: "fetching text, this will take a few mins...",
    });
    await this.fetchText(GOOGLE);
    await this.fetchText(NAMSEL);
    this.imgLink = this.pages[NAMSEL][0].image_link;
    this.getPreview();
    this.loading = false;
    this.$q.loading.hide();
  },

  methods: {
    getPechaId(textType) {
      const is_kangyur = this.textId[0] === process.env.K_TEXT_ID_PREFIX;
      if (is_kangyur) {
        return KANGYUR_PECHAS[textType];
      } else {
        return TENGYUR_PECHAS[textType];
      }
    },

    getTextObjId(textType) {
      return this.textObjIds[textType];
    },

    getPageText() {
      // this.getPreview();
      const page = this.pages.namsel[this.currentPageIdx];
      if (!["google-notes", "namsel-notes"].includes(this.editorTab)) {
        this.imgLink = page.image_link;
      }
      return page.content;
    },

    getNote(textType) {
      const noteId = this.pages[textType][this.currentPageIdx].note_ref;
      if (!noteId) {
        return "";
      }
      return this.notesDict[textType][noteId].content;
    },

    updatePage(value) {
      this.pages.namsel[this.currentPageIdx].content = value;
    },

    updateImg(textType) {
      const noteId = this.pages[textType][this.currentPageIdx].note_ref;
      if (!noteId) {
        this.imgLink = "";
      }
      const page = this.notesDict[textType][noteId];
      this.imgLink = page.image_link;
      console.log(this.imgLink);
    },

    updateNote(textType, value) {
      const noteId = this.pages[textType][this.currentPageIdx].note_ref;
      this.notesDict[textType][noteId].content = value;
    },

    updateGoogleNote(value) {
      this.updateNote(GOOGLE, value);
    },

    updateNamselNote(value) {
      this.updateNote(NAMSEL, value);
    },

    dict2List(obj) {
      const list = [];
      for (const [key, value] of Object.entries(obj)) {
        list.push(value);
      }
      return list;
    },

    async getPreview() {
      this.$q.loading.show({
        message: "preparing preview...",
      });
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
        })
        .catch((error) => {
          console.log(error);
          this.$q.notify({
            type: "negative",
            message:
              this.pages.namsel[this.currentPageIdx].name + " preview failed",
            position: "bottom-right",
          });
          return;
        });
      this.$q.loading.hide();
    },

    async fetchText(textType) {
      try {
        const response = await this.$axios.get(
          getOrigin() +
            "/api/v1/pedurma/" +
            this.getPechaId(textType) +
            "/texts/" +
            this.textId
        );
        const text = await response.data;
        this.pages[textType] = text.pages;
        this.notes[textType] = text.notes;
        this.textObjIds[textType] = text.id;
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          console.log("Server Error:", err);
        } else if (err.request) {
          // client never received a response, or request never left
          console.log("Network Error:", err);
        } else {
          console.log("Client Error:", err);
        }
      }
    },

    async saveText(textType) {
      await this.$axios
        .put(
          getOrigin() +
            "/api/v1/pedurma/" +
            this.getPechaId(textType) +
            "/texts/" +
            this.textId,
          {
            id: this.getTextObjId(textType),
            pages: this.pages[textType],
            notes: this.dict2List(this.notesDict[textType]),
          }
        )
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
      this.saveText(GOOGLE);
      this.saveText(NAMSEL);
      this.$q.notify({
        type: "info",
        message: "saving initiated, you can continue working",
        position: "bottom",
      });
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
  margin-top: 3.3rem;
}

.edit {
  width: 35%;
  margin-right: 0.625rem;
}

.preview {
  width: 40%;
}
</style>