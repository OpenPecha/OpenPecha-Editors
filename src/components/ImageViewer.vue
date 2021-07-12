<template>
  <inner-image-zoom :src="src" :zoomSrc="src" />
</template>

<script>
import "vue-inner-image-zoom/lib/vue-inner-image-zoom.css";
import InnerImageZoom from "vue-inner-image-zoom";

export default {
  props: {
    src: {
      type: String,
      required: true,
    },
  },

  components: {
    "inner-image-zoom": InnerImageZoom,
  },
};
</script>

<style scoped>
</style>