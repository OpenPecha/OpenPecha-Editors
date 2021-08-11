<template>
  <q-page>
    <div
      class="q-ml-auto q-mr-auto q-mt-lg"
      :style="{
        width: '500px',
      }"
    >
      <SearchableList :items="pechas" :open="open" />
    </div>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import SearchableList from "components/SearchableList.vue";

export default {
  name: "ProofreadPechaList",
  components: {
    SearchableList,
  },
  data() {
    return {
      search: "",
      pechas: [
        {
          title: "བཀའ་འགྱུར ༼སྡེ་དགེ༽",
          id: "P000001",
          bdrcId: "W4CZ5369",
        },
        {
          title: "བསྟན་འགྱུར ༼སྡེ་དགེ༽",
          id: "P000002",
          bdrcId: "W4CZ5369",
        },
      ],
    };
  },

  methods: {
    ...mapActions("app", ["unsetNavBackPath"]),

    open(pechaId) {
      this.$router.push("/proofread/" + pechaId);
    },
  },

  created() {
    this.unsetNavBackPath();
  },
};
</script>

<style lang="scss" scoped>
</style>