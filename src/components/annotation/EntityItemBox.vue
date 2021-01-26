<template>
  <q-card bordered flat>
    <q-toolbar>
      <q-btn flat round dense icon="menu" class="q-mr-sm" />
      <q-separator vertical inset />

      <q-btn-dropdown
        flat
        no-caps
        dense
        icon="layers"
        :color="currentLayer.background_color"
        :label="currentLayer.text"
        class="q-ml-sm"
      >
        <q-list>
          <q-item
            v-for="label in labels"
            :key="label.id"
            clickable
            v-close-popup
            @click="selectLayer(label)"
          >
            <q-item-section>
              <q-item-label>{{ label.text }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-toolbar>

    <q-separator />

    <div class="row q-pa-md">
      <div @click="open">
        <entity-item
          v-for="(chunk, i) in chunks"
          :key="i + currentLayer.id"
          :content="chunk.text"
          :newline="chunk.newline"
          :label="filterLayer(chunk)"
          :color="chunk.color"
          :labels="labels"
          @remove="deleteAnnotation(chunk.id)"
          @update="updateEntity($event.id, chunk.id)"
        />
      </div>
    </div>
  </q-card>
</template>

<script>
import EntityItem from "components/annotation/EntityItem";

export default {
  components: {
    EntityItem,
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
    deleteAnnotation: {
      type: Function,
      default: () => [],
      required: true,
    },
    updateEntity: {
      type: Function,
      default: () => [],
      required: true,
    },
    addEntity: {
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
      currentLayer: null,
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
      console.log(range);
      console.log(this.$el);
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(this.$el);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      preSelectionRange.setStart(range.startContainer, 0);
      this.start = [...preSelectionRange.toString()].length;
      this.end = this.start + [...range.toString()].length;
      console.log(this.start, this.end);
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

    selectLayer(layer) {
      this.currentLayer = layer;
    },

    filterLayer(chunk) {
      if (this.currentLayer.id == -1 || chunk.label == this.currentLayer.text) {
        return chunk.label;
      } else {
        return "";
      }
    },
  },

  created() {
    this.currentLayer = this.labels[0];
  },
};
</script>

<style lang="scss" scoped>
.highlight-container.highlight-container--bottom-labels {
  align-items: flex-start;
}
.highlight-container {
  line-height: 42px !important;
  display: flex;
  flex-wrap: wrap;
  white-space: pre-wrap;
  cursor: default;
}
.highlight-container.highlight-container--bottom-labels .highlight.bottom {
  margin-top: 6px;
}
</style>
