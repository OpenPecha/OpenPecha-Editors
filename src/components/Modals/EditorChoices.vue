<template>
  <q-card style="min-width: 300px">
    <q-card-section>
      <div class="text-subtitle1 text-center text-blue-grey-7">
        Choose the Editor
      </div>
    </q-card-section>

    <q-card-section class="flex justify-around">
      <q-card
        v-for="editor in editors"
        :key="editor.id"
        class="cursor-pointer editor_card"
        style="background: #8e57f1; color: white"
        @click="open(editor.path)"
      >
        <q-card-section>
          <div class="text-h6">{{ editor.name }}</div>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: {
    editors: Array,
  },
  methods: {
    open(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style lang="scss" scoped>
.editor_card:hover {
  box-shadow: 0 0 6px rgb(168, 168, 168);
}
</style>