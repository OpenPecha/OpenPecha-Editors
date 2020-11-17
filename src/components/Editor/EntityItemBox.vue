<template>
  <div>
    <entity-item
      v-for="(chunk, i) in chunks"
      :key="i"
      :content="chunk.text"
      :newline="chunk.newline"
      :label="chunk.label"
      :color="chunk.color"
      :labels="labels"
    />
  </div>
</template>

<script>
export default {
  components: {
    "entity-item": require("components/Editor/EntityItem").default,
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
  },
};
</script>

<style scoped>
</style>