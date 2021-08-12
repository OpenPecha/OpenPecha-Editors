<template>
  <div>
    <q-input
      filled
      v-model="search"
      label="Search"
      :style="{ 'font-size': '1.5rem' }"
    >
      <template v-slot:append>
        <q-icon v-if="search === ''" name="search" />
        <q-icon
          v-else
          name="clear"
          class="cursor-pointer"
          @click="search = ''"
        />
      </template>
    </q-input>
    <div
      class="q-mt-lg q-mx-auto"
      :style="{ 'max-width': '500px', height: '10px' }"
    >
      <LazyItemList :items="filteredItems" :open="open" :itemId="listItemId" />
    </div>
  </div>
</template>

<script>
import LazyItemList from "components/LazyItemList.vue";

export default {
  name: "SearchableList",
  components: {
    LazyItemList,
  },
  props: {
    items: {
      type: Array,
      require: true,
    },
    open: {
      type: Function,
      require: true,
    },
    listItemId: {
      type: String,
      default: "id",
    },
  },
  data() {
    return {
      search: "",
    };
  },

  computed: {
    filteredItems() {
      return this.items.filter((pecha) => {
        return (
          this.includes(this.search, pecha.id) ||
          this.includes(this.search, pecha.title) ||
          this.includes(this.search, pecha.bdrcId)
        );
      });
    },
  },

  methods: {
    includes(s1, s2) {
      return s2.toLowerCase().includes(s1.toLowerCase());
    },
  },
};
</script>

<style lang="scss" scoped>
</style>