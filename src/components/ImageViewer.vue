<template>
  <inner-image-zoom :src="srcSmall" :zoomSrc="src" />
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
    resize: {
      type: Boolean,
      default: true,
    },
  },

  components: {
    "inner-image-zoom": InnerImageZoom,
  },

  computed: {
    srcSmall() {
      if (!this.resize) {
        return this.src;
      }
      const splitedURL = this.src.split("max");
      return splitedURL[0] + "pct:50" + splitedURL[1];
    },
  },
};
</script>

<style scoped>
</style>