<template>
  <div class="editor">
    <div id="editor-toolbar">
      <div v-if="hasList" class="toolbar-group">
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

      <div v-if="extraTools" class="toolbar-group">
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

      <div v-if="extraTools" class="toolbar-group">
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
        <TextList v-if="hasList" :list="textList" :click="open" />
      </div>

      <div class="textarea col">
        <textarea :id="textAreaId" cols="30" rows="10"></textarea>
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
    currentLayerProp: {
      type: String,
      default: "BaseText",
    },
    textAreaIdProp: {
      type: String,
      default: "textarea",
    },
    loadText: {
      type: Function,
    },
    getTextList: {
      type: Function,
    },
    saveText: {
      type: Function,
    },
    extraTools: {
      type: Boolean,
      default: true,
    },
    hasList: {
      type: Boolean,
      default: true,
    },
    content: {
      type: String,
      default: "empty notes",
    },
  },

  data() {
    return {
      editor: null,
      options: {
        mode: "hfml",
        lineNumbers: false,
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
      textAreaId: this.textAreaIdProp,
      layers: ["BaseText", "Citation", "Sabche", "Yigchung"],
      themes: ["Default", "Darcula", "Monospace"],
      currentTheme: "Default",
      currentLayer: this.currentLayerProp,
      currentTextFile: null,
      showTextList: false,
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
      if (this.hasList) {
        return this.getTextList(this.currentLayer);
      }
    },
  },

  methods: {
    selectLayer(layer) {
      this.currentLayer = layer;
    },

    selectTheme(theme) {
      this.currentTheme = theme;
    },

    async open(textFile) {
      const text = await this.loadText(textFile);
      this.editor.doc.setValue(text);
      this.currentTextFile = textFile;
      this.showTextList = false;
      this.$emit("openPage", textFile);
    },
  },

  mounted: function () {
    this.editor = CodeMirror.fromTextArea(
      document.getElementById(this.textAreaId),
      this.options
    );
    if (!this.hasList) {
      this.editor.doc.setValue(this.content);
    }
  },

  beforeMount() {
    if (this.userAccessToken == null) {
      // this.$router.push("/login");
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