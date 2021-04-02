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
  height: 17rem;
  width: 12rem;
}

.pecha_card:hover {
  border: 1px solid rgb(26, 123, 235);
}
</style>