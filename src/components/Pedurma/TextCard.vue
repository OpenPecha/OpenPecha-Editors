<template>
  <q-card :style="{ width: '200px' }" class="card cursor-pointer" @click="open">
    <q-card-section class="bg-cyan-2">
      <div class="text-h5">{{ text.p_id }}</div>
    </q-card-section>

    <q-card-section :style="{ 'font-size': '1.5rem' }">
      {{ text.p_title }}
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "TextCard",
  props: {
    text: {
      type: Object,
      required: true,
    },
  },

  methods: {
    open() {
      this.$router.push("/editor/pedurma/" + this.text.p_id);
    },
  },
};
</script>

<style scoped>
.card:hover {
  box-shadow: 0 0 10px rgb(168, 168, 168);
}
</style>