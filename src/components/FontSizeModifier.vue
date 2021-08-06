<template>
  <div>
    <q-btn dense outline color="grey" icon="remove" @click="decrease">
      <q-tooltip> Decrease font size </q-tooltip>
    </q-btn>

    <q-btn dense outline color="grey" icon="add" @click="increase">
      <q-tooltip> Increase font size </q-tooltip>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: "FontSizeModifier",
  props: {
    selectors: {
      type: Array,
      require: true,
    },
    default: {
      type: Number,
      require: true,
    },
  },

  data() {
    return {
      currentFontSize: this.default,
    };
  },

  computed: {
    selectedDOMs() {
      return this.selectors.map((selector) => {
        return document.querySelector(selector);
      });
    },
  },

  watch: {
    currentFontSize() {
      this.change();
    },
  },

  methods: {
    change() {
      this.selectedDOMs.forEach((dom) => {
        dom.style.fontSize = `${this.currentFontSize}rem`;
      });
    },

    increase() {
      this.currentFontSize += 0.1;
    },

    decrease() {
      this.currentFontSize -= 0.1;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>