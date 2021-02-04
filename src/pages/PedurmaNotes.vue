<template>
  <div v-if="pageReady && !done && currentNote" class="container">
    <div class="page-image">
      <q-scroll-area class="fixed-area">
        <q-img
          :src="resizedImgUrl"
          :alt="currentNote.image_link"
          spinner-color="blue"
        >
          <template v-slot:error>
            <div class="absolute-full flex flex-center bg-negative text-white">
              Cannot load image
            </div>
          </template>
        </q-img>
      </q-scroll-area>
    </div>
    <div class="page-data">
      <q-pagination
        v-model="currentIdx"
        :max="notes.length"
        input
        class="q-mb-lg"
      />
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
      <q-btn
        v-show="currentIdx == notes.length"
        label="submit"
        color="secondary"
        class="q-mt-lg full-width"
        @click="submit"
      />
    </div>
  </div>
  <div v-else-if="done" class="q-ma-auto">
    <q-dialog v-model="done" persistent>
      <q-card>
        <q-card-section class="q-pa-xl text-h3">
          <q-icon :name="message.iconName" :color="message.iconColor" />
          {{ message.text }}
        </q-card-section>
        <q-separator v-if="message.showActions" />
        <q-card-actions v-if="message.showActions" align="center">
          <q-btn
            no-caps
            :label="message.actionName"
            color="primary"
            @click="loadNotes"
            class="full-width"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { Loading } from "quasar";
import { getOrigin } from "../utils";

export default {
  data() {
    return {
      notes: [],
      pageReady: false,
      currentIdx: 1,
      done: false,
      taskName: "note_edits",
      completedText: [],
      message: {
        text: "",
        iconName: "",
        iconColor: "",
        showActions: true,
        actionName: "",
      },
      imgHeight: 800,
      imgWidth: 550,
    };
  },

  computed: {
    textId() {
      return this.$route.params.textId;
    },

    currentNote() {
      return this.notes[this.currentIdx - 1];
    },

    resizedImgUrl() {
      return this.currentNote.image_link.replace(
        "max",
        `${this.imgWidth},${this.imgHeight}`
      );
    },
  },

  methods: {
    success() {
      this.message.text = this.textId + " Completed!";
      this.message.iconName = "done";
      this.message.iconColor = "green";
      this.message.actionName = "Edit";
      this.done = true;
    },

    fail() {
      console.log(this.textId, "failed");
      this.message.text = this.textId + " Not found!";
      this.message.iconName = "clear";
      this.message.iconColor = "red";
      this.message.showActions = false;
      this.done = true;
    },

    async updateNotes() {
      await this.$axios.post(
        getOrigin() + "/api/v1/pedurma/" + this.textId + "/notes",
        this.notes
      );
    },

    async markCompleted() {
      await this.$axios.post(
        getOrigin() + "/api/v1/pedurma/" + this.taskName + "/completed",
        null,
        { params: { text_id: this.textId } }
      );
    },

    submit() {
      Loading.show();
      this.updateNotes();
      this.markCompleted();
      Loading.hide();
      this.done = true;
    },

    async loadNotes() {
      this.done = false;
      Loading.show();
      await this.$axios
        .get(getOrigin() + "/api/v1/pedurma/" + this.textId + "/notes")
        .then((response) => response.data)
        .then((data) => {
          if (data.length) {
            this.notes = data;
          } else {
            this.fail();
          }
        });
      Loading.hide();
      this.pageReady = true;
    },

    async checkTextCompleted() {
      Loading.show();
      await this.$axios
        .get(getOrigin() + "/api/v1/pedurma/" + this.taskName + "/completed")
        .then((response) => response.data)
        .then((data) => {
          data.find((textId) => {
            if (textId == this.textId) {
              this.success();
              Loading.hide();
            }
          });
        });
    },
  },

  created() {
    this.checkTextCompleted();
    if (!this.done) {
      this.loadNotes();
    }
  },
};
</script>

<style lang="scss" scoped>
.fixed-area {
  height: 90vh;
  width: 100%;
}

.container {
  display: flex;
  margin: 1rem auto;
  max-width: 1023px;
  justify-content: space-between;
  justify-items: center;
  align-items: flex-start;
}

.page-image {
  width: 70%;
  margin-right: 1rem;
}

.page-data {
  width: 30%;
}
</style>