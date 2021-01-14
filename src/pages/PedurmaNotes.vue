<template>
  <div v-if="pageReady" class="container">
    <div class="page-list">
      <q-list bordered separator>
        <q-item
          clickable
          v-ripple
          v-for="(note, idx) in notes"
          :key="idx"
          @click="
            currentNote = note;
            currentIdx = idx;
          "
          :active="currentIdx == idx"
        >
          <q-item-section>Page {{ idx + 1 }}</q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="page-image">
      <q-card class="page-image__card">
        <q-img :src="currentNote.image_link" spinner-color="blue" />
      </q-card>
    </div>
    <div class="page-inputs">
      <q-input
        filled
        v-model.number="currentNote.ref_start_page_no"
        type="number"
        label="Start Page No."
      />
      <q-separator />
      <q-input
        filled
        v-model.number="currentNote.ref_end_page_no"
        type="number"
        label="End Page No."
      />
      <q-separator />
      <q-input
        filled
        v-model.number="currentNote.page_no"
        type="number"
        label="Note Page No."
      />
      <q-btn label="submit" color="secondary" class="q-mt-xl" @click="submit" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notes: [],
      currentNote: null,
      pageReady: false,
      currentIdx: 0,
    };
  },

  async created() {
    const textId = this.$route.params.textId;
    await this.$axios
      .get(
        process.env.OPENPECHA_API_URL + "/api/v1/pedurma/" + textId + "/notes"
      )
      .then((response) => response.data)
      .then((data) => {
        this.notes = data;
        this.currentNote = this.notes[0];
      });
    this.pageReady = true;
  },

  methods: {
    async submit() {
      const textId = this.$route.params.textId;
      await this.$axios.post(
        process.env.OPENPECHA_API_URL + "/api/v1/pedurma/" + textId + "/notes",
        this.notes
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  margin: 1rem;
  justify-content: space-between;
  justify-items: center;
  align-items: flex-start;
}

.page-list {
  width: 20%;
  margin-right: 0.625rem;
}

.page-image {
  width: 60%;
  margin-right: 0.625rem;
}

.page-inputs {
  width: 20%;
}
</style>