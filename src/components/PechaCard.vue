<template>
  <div @click="open">
    <img class="pecha-cover" :src="img" />
  </div>
</template>

<script>
export default {
  props: {
    img: String,
    title: String,
    id: String,
  },

  methods: {
    open() {
      this.$router.push("/editor/" + this.id);
    },
  },
};
</script>

<style scoped>
.pecha-cover {
  height: 100%;
  width: 100%;
}
</style>