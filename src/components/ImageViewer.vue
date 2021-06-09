<template>
  <div>
    <viewer
      :options="options"
      :images="[src]"
      @inited="inited"
      class="viewer"
      ref="viewer"
    >
      <template #default="scope">
        <img
          v-for="src in scope.images"
          :src="src"
          :key="src"
          width="100%"
          height="300"
        />
        {{ scope.options }}
      </template>
    </viewer>
  </div>
</template>
<script>
import "viewerjs/dist/viewer.css";
import { component as Viewer } from "v-viewer";
export default {
  components: {
    Viewer,
  },

  props: {
    src: String,
    alt: String,
  },

  methods: {
    inited(viewer) {
      this.$viewer = viewer;
    },
    show() {
      this.$viewer.show();
    },
  },
};
</script>