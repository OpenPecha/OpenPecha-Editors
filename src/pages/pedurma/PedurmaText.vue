<template>
  <div v-if="!loading" class="container">
    <q-card class="image-card">
      <ImageViewer :src="imgLink" />
    </q-card>

    <div class="preview">
      <div class="row justify-between">
        <FontSizeControl />

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

        <q-pagination
          dense
          input
          v-model="currentPageNum"
          :min="pages.namsel[0].page_no"
          :max="pages.namsel.at(-1).page_no"
          @input="changePage()"
          class="rounded-borders text-grey-4"
          style="border: 1px solid; height: 30px"
        />

        <PedurmaHelpMenu />

      </div>
      <div
        class="preview__content overflow-auto scroll"
        :style="{'font-size': fontSize }"
      >
        <div v-if="currentPreview" v-html="formattedPreview"></div>
      </div>
    </div>

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
          <q-tab
            name="namsel"
            label="མཆན་གནས།"
            @click="loadPageImg()"
          ></q-tab>
          <q-tab
            name="google"
            label="སྡེ་དགེ་མ་ཡིག"
            @click="loadPageImg()"
          ></q-tab>

          <q-tab
            name="google-notes"
            label="མཆན་ཡིག"
            @click="loadNoteImg()"
          ></q-tab>
          <q-tab
            name="namsel-notes"
            label="མཆན་གྲངས།"
            @click="loadNoteImg()"
          ></q-tab>
        </q-tabs>


        <q-tab-panels
          v-model="editorTab"
          animated
          >
          <q-tab-panel name="namsel">
            <editor
              class="edit__editor"
              :text="namselPageContent"
              @input="updateNamselPage"
              :style="{'font-size': fontSize }"
            />
          </q-tab-panel>
          <q-tab-panel name="google">
            <editor
              class="edit__editor"
              :text="googlePageContent"
              @input="updateGooglePage"
              :style="{'font-size': fontSize }"
            />
          </q-tab-panel>
          <q-tab-panel name="google-notes">
            <editor
              class="edit__editor"
              :text="googleNoteContent"
              @input="updateGoogleNote"
              :style="{'font-size': fontSize }"
            />
          </q-tab-panel>

          <q-tab-panel name="namsel-notes">
            <editor
              class="edit__editor"
              :text="namselNoteContent"
              @input="updateNamselNote"
              :style="{'font-size': fontSize }"
            />
          </q-tab-panel>
        </q-tab-panels>
        <q-page-sticky position="bottom-right" :offset="[60, 40]">
          <q-pagination
            v-if="isNoteTab"
            dense
            v-model="currentPageNoteNum"
            :max="pages.namsel[currentPageIdx].note_ref.length"
            :max-pages="3"
            @input="changeNote()"
            :boundary-numbers="false"
            class="rounded-borders text-grey-4"
            style="border: 1px solid; height: 30px"
          />
          </q-page-sticky>
      </div>
    </div>
    <q-dialog v-model="showDownloadDialog" persistent>
      <download-link-box :link="download_url" />
    </q-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import debounce from "debounce"

import { getOrigin, toPara } from "src/utils";

import ImageViewer from "components/ImageViewer.vue";
import FontSizeControl from "components/FontSizeControl.vue";
import PedurmaHelpMenu from "components/Pedurma/PedurmaHelpMenu.vue"

const NAMSEL = "namsel";
const GOOGLE = "google";

export default {
  name: "PedurmaEditor",
  components: {
    editor: require("components/Pedurma/Editor.vue").default,
    DownloadLinkBox: require("components/Modals/DownloadLinkBox.vue").default,
    ImageViewer,
    FontSizeControl,
    PedurmaHelpMenu
  },

  data() {
    return {
      currentPageNum: null,
      currentPageNoteNum: 1,
      currentPreview: "",
      editorTab: NAMSEL,
      editor: NAMSEL,
      loading: true,
      pages: {},
      notes: {},
      notesDict: {},
      textObjIds: {},
      imgLink: "",
      download_url: "",
      showDownloadDialog: false,
      downloading: false,
    };
  },

  computed: {
    isNoteTab() {
      return this.editorTab.includes("notes")
    },

    fontSize() {
      return this.$store.getters["pedurma/fontSizeREM"]
    },

    currentPageIdx() {
      return this.currentPageNum - this.pages[NAMSEL][0].page_no
    },

    textId() {
      return this.$route.params.textId;
    },

    namselPageContent() {
      const page = this.pages[NAMSEL][this.currentPageIdx];
      return page.content;
    },

    namselNoteContent() {
      const notes = this.pages[NAMSEL][this.currentPageIdx].note_ref;
      if (!notes) {
        return "";
      }
      const noteId = notes[this.currentPageNoteNum - 1]
      return this.notesDict[NAMSEL][noteId].content;
    },

    googlePageContent() {
      const page = this.pages[GOOGLE][this.currentPageIdx];
      return page.content;
    },

    googleNoteContent() {
      const notes = this.pages[GOOGLE][this.currentPageIdx].note_ref;
      if (!notes) {
        return "";
      }
      const noteId = notes[this.currentPageNoteNum - 1]
      return this.notesDict[GOOGLE][noteId].content;
    },

    formattedPreview() {
      const noteRegex = /<.*?>/g;
      const noteNumRegex = /\(.*/g;
      const notes = this.currentPreview.match(noteRegex);
      const chunks = this.currentPreview.split(noteRegex);

      if (!notes) {
        return toPara(this.currentPreview)
      }

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

      // style double tsek
      result = result.replaceAll(':', '<span class="double-tsek">:</span>');

      return toPara(result);
    },
  },

  async created() {
    this.$q.loading.show({
      message: "fetching text, please wait...",
    });
    await this.fetchText();
    this.imgLink = this.pages[NAMSEL][0].image_link;
    this.currentPageNum = this.pages[NAMSEL][0].page_no
    await this.getPreview();
    this.loading = false;
    this.$q.loading.hide();

    // set nav back path
    // this.setNavBackPath("/pedurma");
  },

  methods: {
    ...mapActions("app", ["setNavBackPath"]),

    applyFontSize(newVal, oldVal) {
      this.$refs.fontSizeModifier.change()
    },

    getTextObjId(textType) {
      return this.textObjIds[textType];
    },

    toNotesDict() {
      const notesDict = {}
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
      this.notesDict = Object.assign({}, this.notesDict, notesDict)
    },

    changePage() {
      this.loadPageImg()
      this.getPreview();
      this.editorTab = 'namsel'
    },

    changeNote() {
      this.loadNoteImg()
    },

    getNote(textType) {
      const notes = this.pages[textType][this.currentPageIdx].note_ref;
      if (!notes) {
        return "";
      }
      const noteId = notes[this.currentPageNoteNum - 1]
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

    loadPageImg() {
      this.imgLink = this.pages[NAMSEL][this.currentPageIdx].image_link;
    },

    loadNoteImg() {
      const notes = this.pages[NAMSEL][this.currentPageIdx].note_ref;
      if (!notes) {
        this.imgLink = "";
      }
      const noteId = notes[this.currentPageNoteNum - 1]
      const page = this.notesDict[NAMSEL][noteId];
      this.imgLink = page.image_link;
    },

    updateNote(textType, value) {
      const notes = this.pages[textType][this.currentPageIdx].note_ref;
      const noteId = notes[this.currentPageNoteNum - 1]
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

    filterNotes(notes, noteIds)  {
      let result = [], noteId
      for (noteId in notes) {
        if (noteIds.includes(noteId)) {
          result.push(notes[noteId])
        }
      }
      return result
    },

    async getPreview() {
      const googlePage = this.pages.google[this.currentPageIdx];
      const namselPage = this.pages.namsel[this.currentPageIdx];
      const googleNotes = this.filterNotes(this.notesDict.google, googlePage.note_ref)
      const namselNotes = this.filterNotes(this.notesDict.namsel, namselPage.note_ref);

      await this.$axios
        .post(getOrigin() + "/api/v1/pedurma/preview", {
          google_page: googlePage,
          google_page_notes: googleNotes,
          namsel_page: namselPage,
          namsel_page_notes: namselNotes,
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
      let response
      try {
        if (!process.env.FAKE_DATA) {
          response = await this.$axios.get(
            getOrigin() +
              "/api/v1/pedurma/texts/" +
              this.textId
          );
        } else {
          response = {
            data:
              {
                  "text_id": "T001",
                  "namsel": {
                      "id": "T001",
                      "pages": [
                          { "id": "0001", "content": "namsel test page", "note_ref": ["0002", "0003"]}

                      ],
                      "notes": [
                          { "id": "0002", "content": "namsel test note 1 page"},
                          { "id": "0003", "content": "namsel test note 2 page" }
                      ]
                  },
                  "google": {
                      "id": "T001",
                      "pages": [
                          {"id": "0001", "content": "google test page", "note_ref": ["0002", "0003"]}
                      ],
                      "notes": [
                          { "id": "0002", "content": "google test note 1 page"},
                          { "id": "0003", "content": "google test note 2 page" }
                      ]
                  }
              }
          }
        }

        const text = response.data;
        const pages = {}
        pages[NAMSEL] = text[NAMSEL].pages;
        pages[GOOGLE] = text[GOOGLE].pages;
        this.pages = Object.assign({}, this.pages, pages)

        const notes = {}
        this.notes[NAMSEL] = text[NAMSEL].notes;
        this.notes[GOOGLE] = text[GOOGLE].notes;
        this.pages = Object.assign({}, this.pages, notes)

        this.textObjIds[NAMSEL] = text[NAMSEL].id;
        this.textObjIds[GOOGLE] = text[GOOGLE].id;

        this.toNotesDict()
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
  margin-left: 0.625rem;
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
  margin-top: 10px;
  padding-top: 5px;
  padding-left: 10px;
  border: 1px dotted rgb(209, 208, 208);
  border-radius: 5px;
  height: 85vh;
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
  border-radius: 3px;
  color: rgb(44, 44, 44);
  background-color: rgb(209, 188, 248);
  border-radius: 3px;
}

.preview >>> .note-number {
  padding: 0px 3px;
  border-radius: 3px;
  color: rgb(44, 44, 44);
  background-color: rgb(207, 241, 83);
}

.preview >>> .double-tsek {
  padding: 0 3px;
  border-radius: 3px;
  color: rgb(44, 44, 44);
  background-color: rgb(247, 165, 165);
}
</style>
