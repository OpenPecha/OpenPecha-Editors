<template>
  <q-page padding>
    <div
      class="search q-ml-auto q-mr-auto"
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
        v-for="pecha in filteredPechas"
        :key="pecha.pechaId"
        :img="pecha.img"
        :title="pecha.title"
        :id="pecha.id"
        @remove-pecha="remove"
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
import PechaCard from "components/Dashboard/PechaCard";
import AddText from "components/Modals/AddText";
import { getOrigin } from "src/utils";

export default {
  name: "Dashboard",
  components: {
    PechaCard,
    AddText,
  },

  data() {
    return {
      search: "",
      pechas: [],
      showAddText: false,
    };
  },

  computed: {
    ...mapGetters("app", ["userAccessToken"]),

    filteredPechas() {
      return this.pechas.filter((pecha) => {
        return pecha.title.includes(this.search);
      });
    },
  },

  methods: {
    create() {
      this.$router.push("/upload");
    },

    remove(pecha_id) {
      this.pechas = this.pechas.filter((pecha) => {
        return pecha.id != pecha_id;
      });
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