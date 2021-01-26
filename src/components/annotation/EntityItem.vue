<template>
  <span
    v-if="label"
    :style="{ borderColor: color }"
    class="highlight"
    @click="remove"
    >{{ content }}</span
  ><span v-else :class="[newline ? 'newline' : '']">{{ content }}</span>
  <!-- <q-btn
      dense
      outline
      round
      icon="clear"
      size="5px"
      color="grey"
      @click.stop="remove"
    /> -->
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
    newline: {
      type: Boolean,
    },
  },
  data() {
    return {};
  },
  methods: {
    update(label) {
      this.$emit("update", label);
      this.showMenu = false;
    },
    remove() {
      this.$emit("remove");
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
  cursor: default;
}

.newline {
  width: 100%;
}
</style>
