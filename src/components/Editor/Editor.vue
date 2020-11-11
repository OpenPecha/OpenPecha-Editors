<template>
  <div>
    <div id="editor-toolbar">
      <q-btn-dropdown size="10px" label="Annotations" dense flat>
        <q-list>
          <q-item
            v-for="ann in annotations"
            :key="ann"
            clickable
            v-close-popup
            @click="onItemClick"
          >
            <q-item-section>
              <q-item-label>{{ ann }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <div>
      <textarea
        name="editor"
        id="editor"
        ref="editor"
        cols="30"
        rows="10"
      ></textarea>
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
      annotations: ["Citation", "Sabche", "Yigchung"],
    };
  },
  methods: {
    ...mapGetters("editor", ["getContent"]),
  },
  computed: {
    ...mapState("editor", ["editor", "options"]),
  },
  mounted: function () {
    editor = CodeMirror.fromTextArea(this.$refs.editor, this.options);
  },
};
</script>

<style>
#editor-toolbar {
  display: flex;
  flex-flow: row;
  border-top: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-left: 1px solid #ccc;
  position: relative;
}

.CodeMirror {
  border: 1px solid #ccc;
  background: white;
}
</style>