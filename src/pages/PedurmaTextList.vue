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
      <q-intersection v-for="text in filteredTexts" :key="text.p_id" once>
        <TextCard :text="text" />
      </q-intersection>
    </div>
  </q-page>
</template>

<script>
import TextCard from "components/Pedurma/TextCard";

const KANGYUR = "kangyur";
const TENGYUR = "tengyur";

export default {
  name: "PedurmaTextList",
  components: {
    TextCard,
  },

  data() {
    return {
      search: "",
      texts: [],
      pechaType: TENGYUR,
    };
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

    textListUrl() {
      if (this.pechaType === TENGYUR) {
        return process.env.T_TEXT_LIST_URL;
      } else {
        return process.env.K_TEXT_LIST_URL;
      }
    },
  },

  methods: {
    includes(s1, s2) {
      return s2.toLowerCase().includes(s1.toLowerCase());
    },

    async fetchTexts() {
      try {
        const response = await this.$axios.get(this.textListUrl);
        this.texts = response.data;
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          console.log("Server Error:", err);
        } else if (err.request) {
          // client never received a response, or request never left
          console.log("Network Error:", err);
        } else {
          console.log("Client Error:", err);
        }
      }
    },
  },

  mounted() {
    this.fetchTexts();
  },
};
</script>

<style lang="scss" scoped>
</style>