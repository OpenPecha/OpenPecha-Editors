<template>
  <div v-if="pageReady" class="container">
    <div class="page-list">
      <q-scroll-area class="fixed-area">
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
      </q-scroll-area>
    </div>
    <div class="page-image">
      <q-card>
        <q-scroll-area class="fixed-area">
          <q-img
            :src="currentNote.image_link"
            :alt="currentNote.image_link + ' Not found!'"
            spinner-color="blue"
          >
            <template v-slot:error>
              <div
                class="absolute-full flex flex-center bg-negative text-white"
              >
                Cannot load image
              </div>
            </template>
          </q-img>
        </q-scroll-area>
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
import { Loading } from "quasar";
import { getOrigin } from "../utils";

export default {
  data() {
    return {
      notes: [],
      currentNote: null,
      pageReady: false,
      currentIdx: 0,
    };
  },

  methods: {
    async submit() {
      const textId = this.$route.params.textId;
      await this.$axios.post(
        getOrigin() + "/api/v1/pedurma/" + textId + "/notes",
        this.notes
      );
    },
  },

  async created() {
    const textId = this.$route.params.textId;
    Loading.show();
    await this.$axios
      .get(getOrigin() + "/api/v1/pedurma/" + textId + "/notes")
      .then((response) => response.data)
      .then((data) => {
        this.notes = data;
        this.currentNote = this.notes[0];
      });
    Loading.hide();
    this.pageReady = true;
  },

  methods: {
    async submit() {
      const textId = this.$route.params.textId;
      await this.$axios.post(
        getOrigin() + "/api/v1/pedurma/" + textId + "/notes",
        this.notes
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.q-header {
  position: relative imp !important;
}

.page-container {
  padding-top: 10px imp !important;
}

.fixed-area {
  height: 90vh;
  width: 100%;
}
.container {
  display: flex;
  margin: 1rem;
  justify-content: space-between;
  justify-items: center;
  align-items: flex-start;
}

.page-list {
  width: 20%;
  margin-right: 1rem;
}

.page-image {
  width: 60%;
  margin-right: 1rem;
}

.page-inputs {
  width: 20%;
}
</style>