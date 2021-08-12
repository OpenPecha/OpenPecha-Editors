<template>
  <q-page>
    <div
      class="q-ml-auto q-mr-auto q-mt-lg"
      :style="{
        width: '500px',
      }"
    >
      <SearchableList :items="volumes" :open="open" listItemId="bdrcId" />
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import SearchableList from "components/SearchableList.vue";

export default {
  name: "ProofreadVolumeList",
  components: {
    SearchableList,
  },

  computed: {
    ...mapGetters("proofread", ["volumes"]),
    pechaId() {
      return this.$route.params.pechaId;
    },
  },

  methods: {
    ...mapActions("app", ["setNavBackPath"]),
    ...mapActions("proofread", ["fetchVolumes"]),

    open(volId) {
      this.$router.push(`/proofread/${this.pechaId}/${volId}`);
    },
  },

  created() {
    this.fetchVolumes({ pechaId: this.pechaId });
    this.setNavBackPath("/proofread");
  },
};
</script>

<style lang="scss" scoped>
</style>