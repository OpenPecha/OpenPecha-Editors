<template>
  <q-list>
    <q-item
      dense
      clickable
      v-for="(item, index) in list"
      :key="item.name"
      @click="click(item)"
      :ref="'text' + index"
    >
      <q-item-section class="text-grey-7">{{ item.name }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      require: true,
    },
    click: {
      type: Function,
      require: true,
    },
  },

  updated() {
    this.$refs["text0"][0].$el.click();
  },
};
</script>

<style lang="scss" scoped>
</style>