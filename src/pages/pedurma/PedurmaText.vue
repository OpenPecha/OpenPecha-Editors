<template>
  <div v-if="!loading" class="container">
    <q-card class="image-card">
      <ImageViewer :src="imgLink" />
    </q-card>

    <div class="edit">
      <div class="edit__editors">
        <q-tabs
          v-model="editorTab"
          dense
          outside-arrows
          class="text-grey"
          active-color="deep-purple-5"
          align="justify"
        >
          <q-tab name="namsel" label="མཆན་གནས།"></q-tab>
          <q-tab name="google" label="སྡེ་དགེ་མ་ཡིག"></q-tab>

          <q-pagination
            dense
            v-model="currentPageNum"
            :max="Object.keys(pages.namsel).length"
            input
            class="rounded-borders text-grey-4"
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

        <q-tab-panels
          v-model="editorTab"
          animated
          >
          <q-tab-panel name="namsel">
            <editor
              class="edit__editor"
              :text="getPageText('namsel')"
              @input="updateNamselPage"
              :style="{'font-size': fontSize }"
            />
          </q-tab-panel>
          <q-tab-panel name="google">
            <editor
              class="edit__editor"
              :text="getPageText('google')"
              @input="updateGooglePage"
              :style="{'font-size': fontSize }"
            />
          </q-tab-panel>
          <q-tab-panel name="google-notes">
            <editor
              class="edit__editor"
              :text="getNote('google')"
              @input="updateGoogleNote"
              :style="{'font-size': fontSize }"
            />
          </q-tab-panel>

          <q-tab-panel name="namsel-notes">
            <editor
              class="edit__editor"
              :text="getNote('namsel')"
              @input="updateNamselNote"
              :style="{'font-size': fontSize }"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <div class="preview">
      <div class="row justify-between">
        <FontSizeControl />
        <q-btn
          dense
          no-caps
          outline
          label="Guide"
          icon="description"
          @click="
            openURL(
              'https://docs.google.com/document/d/1Ob9-brku7NvKSQHm8DwYbYPnHX4tJtJDD_2gwFIXQ5w/edit?usp=sharing'
            )
          "
        />
        <q-btn
          dense
          outline
          no-caps
          color="grey"
          label="issue"
          icon="report_problem"
          class="q-px-sm"
          @click="
            openURL('https://github.com/OpenPecha-dev/openpecha-editor/issues/new')
          "
        />
        <q-btn
          dense
          outline
          no-caps
          :loading="downloading"
          color="blue-5"
          label="Download"
          icon="file_download"
          @click="download"
          class="q-ml-sm q-px-sm"
        />
      </div>
      <div
        class="preview__content"
        :style="{'font-size': fontSize }"
      >
        <div v-if="currentPreview" v-html="formattedPreview"></div>
      </div>
    </div>
    <q-dialog v-model="showDownloadDialog" persistent>
      <download-link-box :link="download_url" />
    </q-dialog>
  </div>
</template>

<script>
import { openURL } from "quasar";
import { mapActions } from "vuex";
import debounce from "debounce"

import { getOrigin, toPara } from "src/utils";

import ImageViewer from "components/ImageViewer.vue";
import FontSizeControl from "components/FontSizeControl.vue";

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
    ImageViewer,
    FontSizeControl,
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
      downloading: false,
    };
  },

  watch: {
    currentPageIdx() {
      this.getPreview();
    },
  },

  computed: {
    fontSize() {
      return this.$store.getters["pedurma/fontSizeREM"]
    },

    currentPageIdx() {
      return this.currentPageNum - 1;
    },

    notesDict() {
      const result = {};
      const googleNotesDict = {};
      const namselNotesDict = {};
      this.notes.google.forEach((note) => {
        googleNotesDict[note.id] = note;
      });
      this.notes.namsel.forEach((note) => {
        namselNotesDict[note.id] = note;
      });
      result[GOOGLE] = googleNotesDict;
      result[NAMSEL] = namselNotesDict;
      return result;
    },

    textId() {
      return this.$route.params.textId;
    },

    formattedPreview() {
      const noteRegex = /<.*?>/g;
      const noteNumRegex = /\(.*/g;
      const notes = this.currentPreview.match(noteRegex);
      const chunks = this.currentPreview.split(noteRegex);

      let result = "";
      for (let i = 0; i < notes.length; i++) {
        var noteNum = chunks[i].match(noteNumRegex)[0];
        var chunk = chunks[i].slice(0, chunks[i].length - noteNum.length);

        // remove note number annotation
        noteNum = noteNum.replace("(", "");
        noteNum = noteNum.replace(")", "");

        result +=
          chunk +
          '<span class="note-number">' +
          noteNum +
          "</span>" +
          '<span class="note">' +
          notes[i] +
          "</span>";
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
    await this.fetchText();
    this.imgLink = this.pages[NAMSEL][0].image_link;
    await this.getPreview();
    this.loading = false;
    this.$q.loading.hide();

    // set nav back path
    this.setNavBackPath("/pedurma");
  },

  methods: {
    ...mapActions("app", ["setNavBackPath"]),
    applyFontSize(newVal, oldVal) {
      console.log(this.$refs)
      this.$refs.fontSizeModifier.change()
    },

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
      this.debouncedPreview();
      this.debouncedSave()
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
      this.debouncedPreview();
      this.debouncedSave()
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
          this.currentPreview = "";
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
          this.$q.loading.hide()
        });
    },

    debouncedPreview: debounce(function()  {
      this.getPreview()
    }, 1500),

    async fetchText() {
      try {
        const response = await this.$axios.get(
          getOrigin() +
            "/api/v1/pedurma/texts/" +
            this.textId
        );
        const texts = response.data;
        for (const textType in texts) {
          this.pages[textType] = texts[textType].pages;
          this.notes[textType] = texts[textType].notes;
          this.textObjIds[textType] = texts[textType].id;
        }
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

    async save() {
      await this.$axios
        .put(
          getOrigin() +
            "/api/v1/pedurma/texts/" +
            this.textId,
          {
            "text_id": this.textId,
            namsel: {
              id: this.getTextObjId(NAMSEL),
              pages: this.pages[NAMSEL],
              notes: this.dict2List(this.notesDict[NAMSEL]),
            },
            google: {
              id: this.getTextObjId(GOOGLE),
              pages: this.pages[GOOGLE],
              notes: this.dict2List(this.notesDict[GOOGLE]),
            }
          }
        )
        .then((response) => {
          this.$q.notify({
            type: "positive",
            message: "saved text",
            position: "bottom-right",
          });
        })
        .catch((error) => {
          console.log(error);
          this.$q.notify({
            type: "negative",
            message: "could not save text",
            position: "bottom-right",
          });
          return;
        });
    },

    debouncedSave: debounce(function() {
      this.save()
    }, 1500),

    async download() {
      this.downloading = true;
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
          this.downloading = false;
        })
        .catch((err) => {
          this.$q.notify({
            type: "negative",
            message: "Download failed, please contact the team",
            position: "bottom",
          });
          console.log(err);
          this.downloading = false;
        });
    },

    openURL(url) {
      openURL(url);
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35%;
  margin-right: 0.625rem;
  height: 90vh;
  overflow: auto;
}

.edit {
  width: 30%;
  margin-right: 0.625rem;
}

.edit__editors >>> .q-tab__label {
  font-size: 1.1rem;
  line-height: 0;
  font-family: "jomolhari", sans-serif;
}

.edit__editors >>> .q-tabs {
  /* min-width: 200px;
  max-width: 600px; */
}

.edit__editors >>> .q-tab {
  padding: 0px 5px;
}

.edit__editors >>> .q-tab-panel {
  padding: 10px 0px 0px 0px;
  font-family: "jomolhari", sans-serif;
}

.edit__editors >>> .q-tab-panel > .q-field {
  background-color: rgb(248, 235, 200);
}

.edit__editor {
  font-size: 1.3rem;
}

.preview {
  width: 35%;
}

.preview__content {
  margin-top: 14px;
  padding-top: 5px;
  padding-left: 10px;
  border: 1px dotted rgb(209, 208, 208);
  border-radius: 5px;
  height: 85vh;
  overflow-x: auto;
  overflow-y: hidden;
  font-family: "jomolhari", sans-serif;
  font-size: 1.3rem;
  line-height: 1.3;
  background-color: rgb(255, 247, 228);
}

.preview__content >>> p {
  margin: 0px 0px;
  color: #525252;
}

.preview >>> .note {
  padding: 0px 3px;
  color: rgb(44, 44, 44);
  background-color: rgb(209, 188, 248);
  border-radius: 3px;
}

.preview >>> .note-number {
  padding: 0px 3px;
  color: rgb(44, 44, 44);
  background-color: rgb(207, 241, 83);
}
</style>
