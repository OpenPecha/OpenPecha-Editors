<template>
  <div id="content-entities" @click="open" @touched="open">
    <entity-item
      v-for="(chunk, i) in chunks"
      :key="i + currentLayer.id"
      :content="chunk.text"
      :newline="chunk.newline"
      :label="filterLayer(chunk)"
      :color="chunk.color"
      @remove="deleteAnnotation(chunk.id)"
      @update="updateEntity($event.id, chunk.id)"
    />
    <q-dialog v-model="showMenu">
      <q-card>
        <q-list dense>
          <q-item
            v-for="layer in layers.slice(1)"
            :key="layer.id"
            clickable
            v-close-popup
            @click="assignLayer(layer.id)"
            :style="{
              background: layer.color,
              color: textColor(layer.color),
            }"
          >
            <q-item-section>
              <q-item-label>{{ layer.text }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import EntityItem from "components/annotation/EntityItem";
import { idealColor } from "../../utils";

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
    layers: {
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
    currentLayer: {
      type: Object,
      default: () => {},
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
        const layer = this.labelObject[entity.layer];
        chunks.push({
          id: entity.id,
          layer: layer.text,
          color: layer.color,
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
      for (const layer of this.layers) {
        obj[layer.id] = layer;
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
          layer: null,
          color: null,
          text: snippet + "\n",
          newline: false,
        });
        chunks.push({
          layer: null,
          color: null,
          text: "",
          newline: true,
        });
      }
      chunks.push({
        layer: null,
        color: null,
        text: snippets.slice(-1)[0],
        newline: false,
      });
      return chunks;
    },

    show(e) {
      console.log(e);
      e.preventDefault();
      this.showMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        if (this.currentLayer.text === "All") {
          this.showMenu = true;
          console.log(this.x, this.y);
        } else {
          this.assignLayer(this.currentLayer.id);
        }
      });
    },

    countAllPreviousEntities(node) {
      let currentNode = node.previousSibling;
      let count = 0;
      while (currentNode) {
        if (currentNode.className == "highlight") {
          count += 1;
        }
        currentNode = currentNode.previousSibling;
      }
      return count;
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
      preSelectionRange.selectNodeContents(
        document.querySelector("#content-entities")
      );
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      this.start =
        [...preSelectionRange.toString()].length -
        11 * this.countAllPreviousEntities(range.startContainer.parentNode);
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
      } else {
        this.$q.notify({
          type: "negative",
          message: "Annotation overlapping with other annotation",
        });
      }
    },

    assignLayer(layerId) {
      if (this.validateSpan()) {
        this.addEntity(this.start, this.end, layerId);
        this.showMenu = false;
        this.start = 0;
        this.end = 0;
      }
    },

    filterLayer(chunk) {
      if (this.currentLayer.id == -1 || chunk.layer == this.currentLayer.text) {
        return chunk.layer;
      } else {
        return "";
      }
    },

    textColor(bgColor) {
      return idealColor(bgColor);
    },
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
