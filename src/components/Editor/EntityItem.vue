<template>
  <span v-if="label" class="cursor-pointer">
    <span>
      {{ content }}
    </span>
    <q-menu auto-close>
      <q-list dense>
        <q-item v-for="(item, i) in labels" :key="i" clickable v-close-popup>
          <q-item-section>
            <q-item-label v-text="item.text" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
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
    return {
      showMenu: false,
    };
  },
  computed: {
    textColor() {
      return idealColor(this.color);
    },
  },
  methods: {
    idealColor(hexString) {
      // W3c offers a formula for calculating ideal color:
      // https://www.w3.org/TR/AERT/#color-contrast
      const r = parseInt(hexString.substr(1, 2), 16);
      const g = parseInt(hexString.substr(3, 2), 16);
      const b = parseInt(hexString.substr(5, 2), 16);
      return (r * 299 + g * 587 + b * 114) / 1000 < 128 ? "#ffffff" : "#000000";
    },
    update(label) {
      this.$emit("update", label);
      this.showMenu = false;
    },
    remove() {
      this.$emit("remove");
    },
  },
  mounted() {
    // console.log(this.labels);
  },
};
</script>

<style lang="sass" scoped>
</style>