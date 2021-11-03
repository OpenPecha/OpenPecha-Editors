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
import { mapActions } from 'vuex';

export default {
  name: "FontSizeModifier",
  props: {
    defaultFontSize: {
      type: Number,
      default: 1.3
    },
    offset: {
      type: Number,
      default: 0.1
    }
  },

  methods: {
    ...mapActions("pedurma", ["incrementFontSize", "decrementFontSize"]),
    increase() {
      this.incrementFontSize(this.offset);
    },

    decrease() {
      this.decrementFontSize(this.offset)
    },
  },

  created() {
    this.$store.commit("pedurma/setFontSize", this.defaultFontSize)
  }
};
</script>

<style lang="scss" scoped>
</style>