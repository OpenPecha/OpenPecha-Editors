<template>
  <div>
    <q-card bordered flat>
      <q-toolbar>
        <q-btn flat round dense icon="menu" class="q-mr-sm">
          <q-tooltip>show all text</q-tooltip>
        </q-btn>
        <q-separator vertical inset />
        <q-btn-dropdown
          flat
          no-caps
          dense
          icon="layers"
          :label="currentLayer.name"
          class="q-ml-sm"
        >
          <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
            <q-list dense>
              <q-item
                v-for="layer in layers"
                :key="layer.id"
                :label="currentLayer.name"
                clickable
                v-close-popup
                @click="commands.layerstyle({ level: layer.style })"
                :class="{
                  'is-active': isActive.layerstyle({ level: layer.style }),
                }"
              >
                <q-item-section>
                  <q-item-label>{{ layer.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </editor-menu-bar>
        </q-btn-dropdown>
      </q-toolbar>

      <q-separator />
      <div>
        <q-scroll-area
          class="q-pl-sm q-pr-sm"
          style="height: 85vh; width: 100%"
        >
          <editor-content class="editor__content" :editor="editor" />
        </q-scroll-area>
      </div>
    </q-card>
    <!-- <pre>{{ localHTML }}</pre>
    <pre>{{ localJSON }}</pre> -->
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import { Bold } from "tiptap-extensions";
import LayerStyle from "src/components/Editor/layerStyle.js";
import "src/components/Editor/layers.css";

export default {
  name: "WysiwygEditor",
  props: {
    text: String,
    layers: Array,
  },

  components: {
    EditorContent,
    EditorMenuBar,
  },
  data() {
    return {
      editor: null,
      localJSON: "",
      localHTML: "",
      currentLayer: this.layers[0],
    };
  },
  mounted() {
    this.editor = new Editor({
      extensions: [new Bold(), new LayerStyle()],
      onUpdate: ({ getHTML, getJSON }) => {
        this.localHTML = getHTML();
        this.localJSON = getJSON();
      },
      content: this.text,
    });
  },
  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style lang="sass">
</style>