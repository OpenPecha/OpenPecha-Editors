<template>
  <div>
    <Entity
      v-for="(chunk, i) in chunks"
      :key="i"
      :content="chunk.text"
      :newline="chunk.newline"
      :entityLabel="chunk.label"
      :color="chunk.color"
      :labels="labels"
    />
    <q-menu :value="showMenu">
      <q-list dense>
        <q-item
          clickable
          v-close-popup
          v-for="(label, i) in labels"
          :key="i"
          v-shortkey="[label.suffix_key]"
          @shortkey="assignLabel(label.id)"
          @click="assignLabel(label.id)"
        >
          <q-item-section>
            <q-item-label v-text="label.text" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script>
export default {
  components: {
    Entity: require("components/Editor/Entity").default,
  },
  props: {
    text: {
      type: String,
      default: "",
      required: true,
    },
    labels: {
      type: Array,
      default: () => [],
      required: true,
    },
    entities: {
      type: Array,
      default: () => [],
      required: true,
    },
    addAnnotation: {
      type: Function,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      showMenu: false,
      x: 0,
      y: 0,
      start: 0,
      end: 0,
    };
  },
  computed: {
    sortedEntities() {
      return this.entities
        .slice()
        .sort((a, b) => a.start_offset - b.start_offset);
    },

    chunks() {
      let chunks = [];
      const entities = this.sortedEntities;
      let startOffset = 0;
      for (const entity of entities) {
        // add non-entities to chunks.
        chunks = chunks.concat(
          this.makeChunks(this.text.slice(startOffset, entity.start_offset))
        );
        startOffset = entity.end_offset;

        // add entities to chunks.
        const label = this.labelObject[entity.label];
        chunks.push({
          id: entity.id,
          label: label.text,
          color: label.background_color,
          text: this.text.slice(entity.start_offset, entity.end_offset),
        });
      }
      // add the rest of text.
      chunks = chunks.concat(
        this.makeChunks(this.text.slice(startOffset, this.text.length))
      );
      return chunks;
    },

    labelObject() {
      const obj = {};
      for (const label of this.labels) {
        obj[label.id] = label;
      }
      return obj;
    },
  },
  methods: {
    makeChunks(text) {
      const chunks = [];
      const snippets = text.split("\n");
      for (const snippet of snippets.slice(0, -1)) {
        chunks.push({
          label: null,
          color: null,
          text: snippet + "\n",
          newline: false,
        });
        chunks.push({
          label: null,
          color: null,
          text: "",
          newline: true,
        });
      }
      chunks.push({
        label: null,
        color: null,
        text: snippets.slice(-1)[0],
        newline: false,
      });
      return chunks;
    },

    show(e) {
      e.preventDefault();
      this.showMenu = false;
      this.x = e.clientX || e.changedTouches[0].clientX;
      this.y = e.clientY || e.changedTouches[0].clientY;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },

    setSpanInfo() {
      let selection;
      // Modern browsers.
      if (window.getSelection) {
        selection = window.getSelection();
      } else if (document.selection) {
        selection = document.selection;
      }
      // If nothing is selected.
      if (selection.rangeCount <= 0) {
        return;
      }
      const range = selection.getRangeAt(0);
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(this.$el);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      this.start = [...preSelectionRange.toString()].length;
      this.end = this.start + [...range.toString()].length;
    },

    validateSpan() {
      if (
        typeof this.start === "undefined" ||
        typeof this.end === "undefined"
      ) {
        return false;
      }
      if (this.start === this.end) {
        return false;
      }
      for (const entity of this.entities) {
        if (
          entity.start_offset <= this.start &&
          this.start < entity.end_offset
        ) {
          return false;
        }
        if (entity.start_offset < this.end && this.end <= entity.end_offset) {
          return false;
        }
        if (this.start < entity.start_offset && entity.end_offset < this.end) {
          return false;
        }
      }
      return true;
    },

    open(e) {
      this.setSpanInfo();
      if (this.validateSpan()) {
        this.show(e);
      }
    },

    assignLabel(labelId) {
      if (this.validateSpan()) {
        this.addEntity(this.start, this.end, labelId);
        this.showMenu = false;
        this.start = 0;
        this.end = 0;
      }
    },
  },
};
</script>

<style scoped>
</style>