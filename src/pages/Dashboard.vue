<template>
  <q-page padding>
    <div
      class="search q-ml-auto q-mr-auto"
      :style="{
        width: '500px',
      }"
    >
      <q-input filled v-model="text" label="Search">
        <template v-slot:append>
          <q-icon v-if="text === ''" name="search" />
          <q-icon
            v-else
            name="clear"
            class="cursor-pointer"
            @click="text = ''"
          />4c220c6cb1273f326657e9f0d812936275b02e530ee9ddf81826f7af41693379
        </template>
      </q-input>
    </div>
    <div
      class="pechas q-mt-xl flex q-gutter-lg q-ml-auto q-mr-auto"
      :style="{ 'max-width': '1000px' }"
    >
      <div
        class="pecha_card column justify-around content-center cursor-pointer"
        @click="showAddText = true"
      >
        <q-icon class="" name="note_add" size="8rem" color="grey-5" />
        <div class="text-h6 text-grey-5">Create Pecha</div>
      </div>

      <pecha-card
        v-for="pecha in pechas"
        :key="pecha.pechaId"
        :img="pecha.img"
        :title="pecha.title"
        :id="pecha.id"
        class="pecha_card cursor-pointer"
      />
    </div>

    <q-dialog v-model="showAddText">
      <add-text />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import PechaCard from "components/PechaCard";
import AddText from "components/Modals/AddText";
import { getOrigin } from "src/utils";

export default {
  components: {
    PechaCard,
    AddText,
  },

  data() {
    return {
      text: "search pecha",
      pechas: [],
      showAddText: false,
    };
  },

  computed: {
    ...mapGetters("app", ["userAccessToken"]),
  },

  methods: {
    create() {
      this.$router.push("/upload");
    },
  },

  async created() {
    const res = await this.$axios.get(getOrigin() + "/api/v1/pechas", {
      headers: {
        token: this.userAccessToken,
      },
    });
    this.pechas = res.data;
  },
};
</script>

<style >
.pecha_card {
  height: 17rem;
  width: 12rem;
  border: 1px solid rgb(168, 168, 168);
}

.pecha_card:hover {
  box-shadow: 0 0 6px rgb(168, 168, 168);
}
</style>