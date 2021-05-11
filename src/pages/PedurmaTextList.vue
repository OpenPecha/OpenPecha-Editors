<template>
  <q-page padding>
    <div
      class="q-ml-auto q-mr-auto q-mt-lg"
      :style="{
        width: '500px',
      }"
    >
      <q-input filled v-model="search" label="Search">
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
    </div>
    <div
      class="q-mt-lg flex q-gutter-lg q-ml-auto q-mr-auto"
      :style="{ 'max-width': '1000px' }"
    >
      <TextCard v-for="text in filteredTexts" :key="text.p_id" :text="text" />
    </div>
  </q-page>
</template>

<script>
import TextCard from "components/Pedurma/TextCard";
import data from "./texts.json";

export default {
  name: "PedurmaTextList",
  components: {
    TextCard,
  },

  data() {
    return {
      search: "",
      texts: data,
    };
  },

  methods: {
    includes(s1, s2) {
      return s2.toLowerCase().includes(s1.toLowerCase());
    },
  },

  computed: {
    filteredTexts() {
      return this.texts.filter((text) => {
        return (
          this.includes(this.search, text.p_id) ||
          this.includes(this.search, text.p_title)
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>