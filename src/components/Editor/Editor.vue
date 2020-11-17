<template>
  <div id="editor" ref="editor">
    <!-- <div id="editor-toolbar">
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
      <q-btn
        dense
        flat
        @click="toggle"
        :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
        :label="$q.fullscreen.isActive ? 'Exit Fullscreen' : 'Go Fullscreen'"
      />
    </div> -->
    <!-- <div>
      <textarea ref="textarea"></textarea>
    </div> -->
    <entity-item-box
      :labels="items"
      :text="currentDoc.text"
      :entities="currentDoc.annotations"
    />
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
  components: {
    "entity-item-box": require("components/Editor/EntityItemBox").default,
  },
  data() {
    return {
      items: [
        {
          id: 4,
          text: "LOC",
          prefix_key: null,
          suffix_key: "l",
          background_color: "#7c20e0",
          text_color: "#ffffff",
        },
        {
          id: 5,
          text: "MISC",
          prefix_key: null,
          suffix_key: "m",
          background_color: "#fbb028",
          text_color: "#000000",
        },
        {
          id: 6,
          text: "ORG",
          prefix_key: null,
          suffix_key: "o",
          background_color: "#e6d176",
          text_color: "#000000",
        },
        {
          id: 7,
          text: "PER",
          prefix_key: null,
          suffix_key: "p",
          background_color: "#6a74b9",
          text_color: "#ffffff",
        },
      ],
      currentDoc: {
        id: 8,
        text:
          "After bowling Somerset out for 83 on the opening morning at Grace Road , Leicestershire extended their first innings by 94 runs before being bowled out for 296 with England discard Andy Caddick taking three for 83 .",
        annotations: [
          {
            id: 17,
            prob: 0.0,
            label: 4,
            start_offset: 60,
            end_offset: 70,
            user: 1,
            document: 8,
          },
          {
            id: 19,
            prob: 0.0,
            label: 4,
            start_offset: 165,
            end_offset: 172,
            user: 1,
            document: 8,
          },
          {
            id: 16,
            prob: 0.0,
            label: 6,
            start_offset: 14,
            end_offset: 22,
            user: 1,
            document: 8,
          },
          {
            id: 18,
            prob: 0.0,
            label: 6,
            start_offset: 73,
            end_offset: 87,
            user: 1,
            document: 8,
          },
          {
            id: 20,
            prob: 0.0,
            label: 7,
            start_offset: 181,
            end_offset: 193,
            user: 1,
            document: 8,
          },
        ],
      },
    };
  },
  methods: {
    ...mapGetters("editor", ["getContent"]),
    toggle(e) {
      const target = this.$refs.editor;
      console.log(target);

      this.$q.fullscreen
        .toggle(target)
        .then(() => {
          // success!
        })
        .catch((err) => {
          alert(err);
          // uh, oh, error!!
          // console.error(err)
        });
    },
  },
  computed: {
    ...mapState("editor", ["editor", "options"]),
  },
  mounted: function () {
    // console.log(this.$refs);
    // editor = CodeMirror.fromTextArea(this.$refs.textarea, this.options);
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