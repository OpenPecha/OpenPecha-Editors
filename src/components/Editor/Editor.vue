<template>
  <div>
    <div id="editor-toolbar">
      <div class="toolbar-group">
        <q-btn
          flat
          dense
          @click="drawerLeft = !drawerLeft"
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
    <div>
      <textarea ref="editorContent" cols="30" rows="10"></textarea>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
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
  data() {
    return {
      layers: ["Publicaiton", "Citation", "Sabche", "Yigchung"],
      themes: ["Default", "Darcula", "Monospace"],
      currentTheme: "Default",
      currentLayer: "Publication",
    };
  },
  methods: {
    selectLayer(layer) {
      this.currentLayer = layer;
    },

    selectTheme(theme) {
      this.currentTheme = theme;
    },
  },
  computed: {
    ...mapGetters("editor", ["getContent", "getEditor", "getOptions"]),
  },
  mounted: function () {
    editor = CodeMirror.fromTextArea(this.$refs.editorContent, this.options);
  },
};
</script>

<style>
#editor-toolbar {
  display: flex;
  align-items: center;
  height: 30px;
  width: 100%;
  border-top: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.toolbar-group {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
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

.selector {
  width: 80px;
  height: inherit;
  font-size: 10px;
}

.CodeMirror {
  border: 1px solid #ccc;
  background: white;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}
</style>