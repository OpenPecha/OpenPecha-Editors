<template>
  <q-page padding>
    <div class="search">
      <q-input filled v-model="text" label="Search">
        <template v-slot:append>
          <q-icon v-if="text === ''" name="search" />
          <q-icon
            v-else
            name="clear"
            class="cursor-pointer"
            @click="text = ''"
          />
        </template>
      </q-input>
    </div>
    <div class="pechas q-mt-xl flex q-gutter-lg">
      <q-card class="pecha_card cursor-pointer">
        <q-card-section>
          <q-icon class="" name="note_add" size="5rem" color="grey-7" />
        </q-card-section>
        <q-card-section>
          <div>Create Pecha</div>
        </q-card-section>
      </q-card>

      <pecha-card
        v-for="pecha in pechas"
        :key="pecha.pechaId"
        :img="pecha.img"
        :title="pecha.title"
        :id="pecha.id"
        class="pecha_card cursor-pointer"
      />
    </div>
  </q-page>
</template>

<script>
import PechaCard from "components/PechaCard";

export default {
  components: {
    PechaCard,
  },

  data() {
    return {
      text: "seach pecha",
      pechas: [
        {
          id: "P000100",
          img:
            "https://github.com/OpenPecha/P000100/raw/master/P000100.opf/assets/image/LEK-PHI-001.jpg",
          title: "Pecha title here",
        },
        {
          id: "P000100",
          img:
            "https://github.com/OpenPecha/P000100/raw/master/P000100.opf/assets/image/LEK-PHI-001.jpg",
          title: "Pecha title here",
        },
        {
          id: "P000100",
          img:
            "https://github.com/OpenPecha/P000100/raw/master/P000100.opf/assets/image/LEK-PHI-001.jpg",
          title: "Pecha title here",
        },
        {
          id: "P000100",
          img:
            "https://github.com/OpenPecha/P000100/raw/master/P000100.opf/assets/image/LEK-PHI-001.jpg",
          title: "Pecha title here",
        },
      ],
    };
  },
};
</script>

<style >
.pecha_card {
  height: 15rem;
  width: 10rem;
}

.pecha_card:hover {
  border: 1px solid rgb(26, 123, 235);
}
</style>