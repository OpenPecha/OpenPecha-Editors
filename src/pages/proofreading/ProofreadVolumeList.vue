<template>
  <q-page>
    <div
      class="q-ml-auto q-mr-auto q-mt-lg"
      :style="{
        width: '500px',
      }"
    >
      <SearchableList :items="volumes" :open="open" />
    </div>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import SearchableList from "components/SearchableList.vue";

export default {
  name: "ProofreadVolumeList",
  components: {
    SearchableList,
  },

  data() {
    return {
      volumes: [
        {
          id: "v001",
          title: "001_འདུལ་བ།_ཀ",
        },
        {
          id: "v002",
          title: "002_འདུལ་བ།_ཁ",
        },
      ],
    };
  },

  methods: {
    ...mapActions("app", ["setNavBackPath"]),

    open(volId) {
      this.$router.push(`/proofread/${this.pechaId}/${volId}`);
    },
  },

  created() {
    this.setNavBackPath("/proofread");
  },
};
</script>

<style lang="scss" scoped>
</style>