<template>
  <div>
    <q-card bordered flat class="q-ml-auto q-mr-auto" style="max-width: 950px">
      <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
        <q-toolbar class="q-pa-none">
          <!-- <q-btn flat round dense icon="menu" class="q-mr-sm">
            <q-tooltip>show all text</q-tooltip>
          </q-btn>
          <q-separator vertical inset /> -->
          <q-btn-dropdown
            flat
            no-caps
            dense
            icon="layers"
            label="Style"
            color="primary"
            class="q-ml-sm"
          >
            <q-list dense>
              <q-item
                v-for="layer in layers"
                :key="layer.name"
                :label="layer.name"
                clickable
                v-close-popup
                @click="commands.layermark({ layer: layer.style })"
                :class="{
                  'is-active': isActive.layermark({ layer: layer.style }),
                }"
                :style="{ color: layer.color }"
              >
                <q-item-section>
                  <q-item-label>{{ layer.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-separator vertical inset />
          <q-btn flat dense icon="undo" color="grey" @click="commands.undo" class="q-ml-sm">
            <q-tooltip>undo</q-tooltip>
          </q-btn>
          <q-btn flat dense icon="redo" color="grey" @click="commands.redo" class="q-mr-sm">
            <q-tooltip>redo</q-tooltip>
          </q-btn>

          <q-space />

          <q-btn-dropdown dense flat no-caps label="Export" color="grey-8">
            <q-list>
              <q-item clickable v-close-popup @click="exportPecha('.epub')">
                <q-item-section>
                  <q-item-label>.epub</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="exportPecha('.docx')">
                <q-item-section>
                  <q-item-label>.docx</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-separator vertical inset />

          <q-btn flat icon="save" text-color="green-5" @click="save">
            <q-tooltip>save</q-tooltip>
          </q-btn>
        </q-toolbar>
      </editor-menu-bar>

      <q-separator />
      <q-scroll-area class="q-pl-sm q-pr-sm" style="height: 85vh; width: 100%">
        <editor-content class="editor__content" :editor="editor" />
      </q-scroll-area>
    </q-card>

    <q-dialog v-model="showDownloadLink" persistent>
      <download-link-box :link="download_link" />
    </q-dialog>
    <!-- <pre>{{ localHTML }}</pre> -->
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import { History } from "tiptap-extensions";

import DownloadLinkBox from "components/Modals/DownloadLinkBox";

import LayerMark, { layers } from "src/components/Editor/layerMark.js";
import { getOrigin } from "src/utils";

import "src/components/Editor/layers.css";

export default {
  name: "WysiwygEditor",
  props: {
    content: String,
    org: String,
    pechaId: String,
    reviewBranch: String,
    userAccessToken: String,
  },

  components: {
    EditorContent,
    EditorMenuBar,
    DownloadLinkBox,
  },

  data() {
    return {
      editor: null,
      layers: layers,
      localJSON: "",
      localHTML: "",
      showDownloadLink: false,
      download_link: "",
      currentVol: "v001",
    };
  },

  methods: {
    async exportPecha(format) {
      if (this.localHTML) {
        await this.save();
      }
      console.log(format)

      this.$q.loading.show();
      const response = await this.$axios.get(
        getOrigin() +
          `/api/v1/pechas/${this.pechaId}/export/${this.reviewBranch}`,
        {
          headers: {
            token: this.userAccessToken,
          },
          params: { format }
        },
      );
      this.$q.loading.hide();
      if (response["status"] == 200) {
        this.showDownloadLink = true;
        this.download_link = response.data.download_link;
      } else {
        this.$q.notify({
          type: "negative",
          message: "export failed",
        });
      }
    },

    async save() {
      this.$q.loading.show();
      const response = await this.$axios.put(
        getOrigin() +
          `/api/v1/pechas/${this.pechaId}/${this.currentVol}/editor`,
        {
          content: this.localHTML.replaceAll("</p>", "</p>\n"),
        },
        {
          headers: {
            token: this.userAccessToken,
          },
        }
      );
      this.$q.loading.hide();

      if (response.data.success) {
        this.$q.notify({
          type: "positive",
          message: "pecha saved",
        });
      } else {
        this.$q.notify({
          type: "negative",
          message: "couldn't save pecha",
        });
      }
    },
  },

  mounted() {
    this.editor = new Editor({
      extensions: [new LayerMark(), new History()],
      onUpdate: ({ getHTML }) => {
        this.localHTML = getHTML();
      },
      content: this.content,
    });
  },

  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style lang="sass">
.ProseMirror:focus
  outline: none

.ProseMirror > p
    margin: 0

.editor__content
  font-family: 'monlam-ochan2', sans-serif
  font-size: 1.657rem
  line-height: 2

</style>