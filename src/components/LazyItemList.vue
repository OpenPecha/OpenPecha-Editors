<template>
  <div>
    <q-intersection
      v-for="item in items"
      :key="item.id"
      :style="{ height: '7vh' }"
      transition="fade"
    >
      <q-item clickable v-ripple>
        <q-item-section :style="{ 'max-width': '50px' }" @click="open(item.id)">
          <q-item-label class="text-h5">{{ item[itemId] }}</q-item-label>
        </q-item-section>

        <q-item-section
          :style="{ 'margin-left': '50px' }"
          @click="open(item.id)"
        >
          <q-item-label
            class="text-h4"
            style="font-family: 'jomolhari', sans-serif"
          >
            {{ item.title }}
          </q-item-label>
        </q-item-section>

        <slot></slot>
      </q-item>
    </q-intersection>
  </div>
</template>

<script>
export default {
  name: "LazyItemList",
  props: {
    items: {
      type: Array,
      require: true,
    },
    open: {
      type: Function,
      require: true,
    },
    itemId: {
      type: String,
      default: "id",
    },
  },
};
</script>

<style lang="scss" scoped>
</style>