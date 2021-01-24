<template>
  <span v-if="label" :style="{ borderColor: color }" class="highlight">
    <span class="highlight__content">
      {{ content }}
      <q-btn
        dense
        outline
        round
        icon="clear"
        size="5px"
        color="grey"
        @click.stop="remove"
      />
    </span>
    <span
      :data-label="label"
      :style="{ backgroundColor: color, color: textColor }"
      class="highlight__label"
    />
  </span>
  <span v-else :class="[newline ? 'newline' : '']">{{ content }}</span>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: "",
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#64FFDA",
    },
    labels: {
      type: Array,
      default: () => [],
      required: true,
    },
    newline: {
      type: Boolean,
    },
  },
  data() {
    return {};
  },
  computed: {
    textColor() {
      return this.idealColor(this.color);
    },
  },
  methods: {
    update(label) {
      this.$emit("update", label);
      this.showMenu = false;
    },
    remove() {
      this.$emit("remove");
    },

    idealColor(hexString) {
      // W3c offers a formula for calculating ideal color:
      // https://www.w3.org/TR/AERT/#color-contrast
      const r = parseInt(hexString.substr(1, 2), 16);
      const g = parseInt(hexString.substr(3, 2), 16);
      const b = parseInt(hexString.substr(5, 2), 16);
      return (r * 299 + g * 587 + b * 114) / 1000 < 128 ? "#ffffff" : "#000000";
    },
  },
};
</script>

<style scoped>
.highlight:first-child {
  margin-left: 0;
}

.highlight {
  border: 2px solid;
  border-radius: 5px;
  margin: 4px 6px 4px 3px;
  vertical-align: middle;
  box-shadow: 2px 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  cursor: default;
  min-width: 26px;
  line-height: 22px;
}

.newline {
  width: 100%;
}
</style>
