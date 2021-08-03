<template>
  <div v-if="!loading" class="container">
    <q-card class="image-card">
      <img :src="imgLink" />
    </q-card>

    <div class="edit">
      <div class="edit__editors">
        <q-tabs
          v-model="editorTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="namsel" label="མཆན་གནས།"></q-tab>
          <q-tab name="google" label="སྡེ་དགེ་མ་ཡིག"></q-tab>

          <q-pagination
            dense
            v-model="currentPageNum"
            :max="Object.keys(pages.namsel).length"
            input
            class="rounded-borders text-grey-4 q-mt-sm"
            style="border: 1px solid; height: 30px"
          />

          <q-tab
            name="google-notes"
            label="མཆན་ཡིག"
            @click="updateImg('google')"
          ></q-tab>
          <q-tab
            name="namsel-notes"
            label="མཆན་གྲངས།"
            @click="updateImg('namsel')"
          ></q-tab>
        </q-tabs>

        <q-tab-panels v-model="editorTab" animated>
          <q-tab-panel name="namsel" class="row">
            <editor
              class="col"
              :text="getPageText('namsel')"
              @input="updateNamselPage"
            />
          </q-tab-panel>
          <q-tab-panel name="google">
            <editor :text="getPageText('google')" @input="updateGooglePage" />
          </q-tab-panel>
          <q-tab-panel name="google-notes">
            <editor :text="getNote('google')" @input="updateGoogleNote" />
          </q-tab-panel>

          <q-tab-panel name="namsel-notes">
            <editor :text="getNote('namsel')" @input="updateNamselNote" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <div class="preview">
      <div class="row justify-between">
        <q-btn color="green-5" label="save" icon="save" @click="save" />
        <q-btn
          color="blue-5"
          label="Download"
          icon="file_download"
          @click="download"
          class="q-ml-sm"
        />
      </div>
      <div class="preview__content">
        <div v-if="currentPreview" v-html="formattedPreview"></div>
      </div>
    </div>
    <q-dialog v-model="showDownloadDialog" persistent>
      <download-link-box :link="download_url" />
    </q-dialog>
  </div>
</template>

<script>
import { getOrigin, toPara } from "src/utils";

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
    DownloadLinkBox: require("components/Modals/DownloadLinkBox.vue").default,
  },

  data() {
    return {
      currentPageNum: 1,
      currentPreview: "",
      editorTab: NAMSEL,
      editor: NAMSEL,
      loading: true,
      pages: {},
      notes: {},
      textObjIds: {},
      imgLink: "",
      download_url: "",
      showDownloadDialog: false,
    };
  },

  watch: {
    currentPageIdx() {
      this.getPreview();
    },
  },

  computed: {
    currentPageIdx() {
      return this.currentPageNum - 1;
    },

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

    formattedPreview() {
      const noteRegex = /<.*?>/g;
      const notes = this.currentPreview.match(noteRegex);
      const chunks = this.currentPreview.split(noteRegex);

      let result = "";
      for (let i = 0; i < notes.length; i++) {
        result += chunks[i] + '<span class="note">' + notes[i] + "</span>";
      }

      if (chunks.length > notes.length) {
        result += chunks[chunks.length - 1];
      }

      return toPara(result);
    },
  },

  async created() {
    this.$q.loading.show({
      message: "fetching text, please wait...",
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

    getPageText(textType) {
      const page = this.pages[textType][this.currentPageIdx];
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

    updatePage(textType, value) {
      this.pages[textType][this.currentPageIdx].content = value;
      this.getPreview();
    },

    updateGooglePage(value) {
      this.updatePage(GOOGLE, value);
    },

    updateNamselPage(value) {
      this.updatePage(NAMSEL, value);
    },

    updateImg(textType) {
      const noteId = this.pages[textType][this.currentPageIdx].note_ref;
      if (!noteId) {
        this.imgLink = "";
      }
      const page = this.notesDict[textType][noteId];
      this.imgLink = page.image_link;
    },

    updateNote(textType, value) {
      const noteId = this.pages[textType][this.currentPageIdx].note_ref;
      this.notesDict[textType][noteId].content = value;
      this.getPreview();
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
          var message = "Preview failed";
          if (error.response.status === 422) {
            message = "Missing page number in the note";
          }
          console.log(error);
          this.$q.notify({
            type: "negative",
            message: message,
            position: "bottom",
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
        message: "Saving the text",
        position: "bottom",
      });
    },

    async download() {
      await this.save();
      this.$q.notify({
        type: "info",
        message: "Preparing the download",
        position: "bottom",
      });

      this.$axios
        .get(getOrigin() + "/api/v1/pedurma/" + this.textId + "/preview")
        .then((response) => {
          this.download_url = response.data.download_url;
          this.showDownloadDialog = true;
        })
        .catch((err) => {
          this.$q.notify({
            type: "negative",
            message: "Download failed, please contact the team",
            position: "bottom",
          });
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  margin: 1rem;
  justify-content: space-between;
  justify-items: center;
  align-items: flex-start;
}

.image-card {
  width: 37%;
  margin-right: 0.625rem;
}

.edit {
  width: 28%;
  margin-right: 0.625rem;
}

.edit__editors >>> .q-tab__label {
  font-size: 1.563rem;
  line-height: 0px;
}

.edit__editors >>> .q-tabs {
  min-width: 200px;
  max-width: 600px;
}

.edit__editors >>> .q-tab {
  padding: 0px 5px;
}

.edit__editors >>> .q-tab-panel {
  padding: 15px 0px 0px 0px;
}

.preview {
  width: 35%;
}

.preview__content {
  margin-top: 16px;
  /* padding-top: 18px; */
  padding-left: 10px;
  font-size: 1.5rem;
  border: 1px dotted rgb(209, 208, 208);
  height: 85vh;
  overflow-x: auto;
  overflow-y: hidden;
  line-height: 1.4;
}

.preview__content >>> p {
  font-size: 1.5rem;
  margin: 0px 0px;
}

.preview >>> .note {
  background-color: rgb(184, 236, 184);
}
</style>
