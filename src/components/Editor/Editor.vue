<template>
  <div class="editor">
    <div id="editor-toolbar">
      <div class="toolbar-group">
        <q-btn
          flat
          dense
          @click="showTextList = !showTextList"
          icon="menu"
          class="text-list-btn"
          color="grey-7"
          size="sm"
        />
      </div>

      <div class="toolbar-group">
        <q-btn-dropdown
          flat
          dense
          no-caps
          icon="layers"
          :label="currentLayer"
          color="grey-7"
          size="sm"
        >
          <q-list>
            <q-item
              v-for="layer in layers"
              :key="layer"
              clickable
              v-close-popup
              @click="selectLayer(layer)"
            >
              <q-item-section>
                <q-item-label>{{ layer }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn-dropdown
          flat
          dense
          no-caps
          icon="color_lens"
          :label="currentTheme"
          color="grey-7"
          size="sm"
        >
          <q-list>
            <q-item
              v-for="theme in themes"
              :key="theme"
              clickable
              v-close-popup
              @click="selectTheme(theme)"
            >
              <q-item-section>
                <q-item-label>{{ theme }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <div class="toolbar-group">
        <q-btn flat round dense icon="get_app" color="grey-7" size="sm" />
      </div>
    </div>
    <div class="editorContainer row">
      <div v-show="showTextList" class="text-navigation col-2">
        <TextList :layer="currentLayer" @open-text="openText" />
      </div>
      <div class="textarea col">
        <textarea id="editorTextarea" cols="30" rows="10"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { Loading } from "quasar";
import CodeMirror from "codemirror";
import { Octokit } from "@octokit/core";

// basic
import "codemirror/lib/codemirror.css";

// addons
import "codemirror/addon/mode/simple.js";
import "codemirror/addon/display/fullscreen.css";
import "codemirror/addon/display/fullscreen.js";

// language mode
import "./mode/hfml.js";

// theme style

export default {
  data() {
    return {
      layers: ["BaseText", "Citation", "Sabche", "Yigchung"],
      themes: ["Default", "Darcula", "Monospace"],
      currentTheme: "Default",
      currentLayer: "BaseText",
      showTextList: false,
    };
  },
  components: {
    TextList: require("components/Editor/TextList").default,
  },
  computed: {
    ...mapGetters("editor", [
      "getContent",
      "getEditor",
      "getOptions",
      "org",
      "repo",
    ]),
  },
  methods: {
    ...mapActions("editor", ["setOrg", "setRepo"]),
    selectLayer(layer) {
      this.currentLayer = layer;
    },

    selectTheme(theme) {
      this.currentTheme = theme;
    },

    base64ToUtf8(str) {
      return decodeURIComponent(escape(window.atob(str)));
    },

    utf8ToBase64(str) {
      return window.btoa(unescape(encodeURIComponent(str)));
    },

    async getText(owner, repo, sha) {
      const ghClient = new Octokit({ auth: this.userAccessToken });
      const gh_response = await ghClient.request(
        "GET /repos/{owner}/{repo}/git/blobs/{file_sha}",
        {
          owner: owner,
          repo: repo,
          file_sha: sha,
        }
      );

      const response = await fetch(gh_response["url"]);
      const data = await response.json();
      return this.base64ToUtf8(data["content"]);
    },

    async openText(textFile) {
      Loading.show();
      const text = await this.getText(this.org, this.repo, textFile.sha);
      Loading.hide();
      this.editor.doc.setValue(text);
      this.showTextList = false;
    },
  },

  mounted: function () {
    this.editor = CodeMirror.fromTextArea(
      document.getElementById("editorTextarea"),
      this.options
    );
  },
};
</script>

<style>
#editor-toolbar {
  display: flex;
  align-items: center;
  height: 30px;
  width: 100%;
  border: 1px solid #ccc;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.toolbar-group {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  margin: 0 4px;
}

.toolbar-group:before {
  content: "";
  position: absolute;
  left: -4px;
  top: 4px;
  bottom: 4px;
  width: 1px;
  background: rgba(0, 0, 0, 0.12);
}

.CodeMirror {
  border-right: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  background: white;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}
</style>