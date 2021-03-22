<template>
  <div>
    <q-card bordered flat class="q-ml-auto q-mr-auto" style="max-width: 950px">
      <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
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
            label="Layer"
            class="q-ml-sm q-mr-sm"
          >
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
                :style="{ color: layer.style }"
              >
                <q-item-section>
                  <q-item-label>{{ layer.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-separator vertical inset />
          <q-btn flat dense icon="undo" @click="commands.undo" class="q-ml-sm">
            <q-tooltip>undo</q-tooltip>
          </q-btn>
          <q-btn flat dense icon="redo" @click="commands.redo" class="q-mr-sm">
            <q-tooltip>redo</q-tooltip>
          </q-btn>

          <q-space />

          <q-btn flat dense icon="get_app" class="q-ml-sm" @click="exportPecha">
            <q-tooltip>export</q-tooltip>
          </q-btn>
        </q-toolbar>
      </editor-menu-bar>

      <q-separator />
      <q-scroll-area class="q-pl-sm q-pr-sm" style="height: 85vh; width: 100%">
        <editor-content class="editor__content" :editor="editor" />
      </q-scroll-area>
    </q-card>
    <pre>{{ localHTML }}</pre>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar, Extension } from "tiptap";
import { History, HardBreak } from "tiptap-extensions";
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
      extensions: [
        new LayerStyle(),
        new History(),
        new HardBreak(),
        new (class extends Extension {
          keys() {
            return {
              Enter(state, dispatch, view) {
                const { schema, doc, tr } = view.state;

                const hard_break = schema.nodes.hard_break;
                const transaction = tr
                  .replaceSelectionWith(hard_break.create())
                  .scrollIntoView();
                view.dispatch(transaction);
                return true;
              },
            };
          }
        })(),
      ],
      onUpdate: ({ getHTML }) => {
        this.localHTML = getHTML();
        console.log(this.localHTML);
      },
      content: this.text,
    });
  },
  beforeDestroy() {
    this.editor.destroy();
  },

  methods: {
    exportPecha() {
      console.log("export pecha");
    },
  },
};
</script>

<style lang="sass">
.ProseMirror:focus
  outline: none

.editor__content
  font-family: 'monlam-ochan2', sans-serif
  font-size: 1.657rem
  line-heigh: 2
</style>