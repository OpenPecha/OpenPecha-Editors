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
        <q-btn
          flat
          round
          dense
          @click="saveText"
          icon="save"
          color="grey-7"
          size="sm"
        />
        <q-btn flat round dense icon="get_app" color="grey-7" size="sm" />
      </div>
    </div>

    <div class="editorContainer row">
      <div v-show="showTextList" class="text-navigation col-2">
        <q-list>
          <q-item
            dense
            clickable
            v-for="(text, index) in textList"
            :key="text.name"
            @click="open(text)"
            :ref="'text' + index"
          >
            <q-item-section class="text-grey-7">{{ text.name }}</q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="textarea col">
        <textarea id="editorTextarea" cols="30" rows="10"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Loading } from "quasar";
import CodeMirror from "codemirror";

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
  props: {
    loadText: {
      type: Function,
      required: true,
    },
    getTextList: {
      type: Function,
      required: true,
    },
    saveText: {
      type: Function,
    },
  },

  data() {
    return {
      editor: null,
      options: {
        mode: "hfml",
        lineNumbers: true,
        viewportMargin: Infinity,
        lineWrapping: true,
        theme: "default",
        extraKeys: {
          F11: function (cm) {
            cm.setOption("fullScreen", !cm.getOption("fullScreen"));
          },
          Esc: function (cm) {
            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
          },
        },
      },
      layers: ["BaseText", "Citation", "Sabche", "Yigchung"],
      themes: ["Default", "Darcula", "Monospace"],
      currentTheme: "Default",
      currentLayer: "BaseText",
      currentTextFile: null,
      showTextList: false,
      hasLayerChanged: true,
    };
  },

  components: {
    TextList: require("components/Editor/TextList").default,
  },

  computed: {
    ...mapGetters("app", ["userAccessToken"]),
  },

  asyncComputed: {
    textList() {
      return this.getTextList(this.currentLayer);
    },
  },

  methods: {
    selectLayer(layer) {
      this.currentLayer = layer;
      this.hasLayerChanged = true;
    },

    selectTheme(theme) {
      this.currentTheme = theme;
    },

    async open(textFile) {
      const text = await this.loadText(textFile);
      this.editor.doc.setValue(text);
      this.showTextList = false;
      this.currentTextFile = textFile;
    },
  },

  mounted: function () {
    this.editor = CodeMirror.fromTextArea(
      document.getElementById("editorTextarea"),
      this.options
    );
  },

  beforeMount() {
    if (this.userAccessToken == null) {
      // this.$router.push("/login");
    }
  },

  updated() {
    if (this.hasLayerChanged) {
      this.$refs["text0"][0].$el.click();
      this.hasLayerChanged = false;
    }
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

.toolbar-group:not(:first-child)::before {
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