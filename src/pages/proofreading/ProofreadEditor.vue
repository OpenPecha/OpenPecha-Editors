<template>
  <q-page padding>
    <div
      style="max-width: 1800px; min-width: 800px; height: 80vh; margin: auto"
    >
      <ImageViewer
        class="col"
        :src="page.imageUrl"
        :resize="false"
        alt="page image"
        style="width: 100%; border: 2px solid grey"
      />

      <div class="editor q-mb-md">
        <div class="row items-center bg-grey-3 justify-center">
          <q-pagination v-model="pageNum" :max="pageIds.length" input />
          <q-separator vertical />
          <q-btn
            flat
            dense
            color="green-5"
            icon="save"
            @click="save"
            :loading="saving"
          >
            <q-tooltip> save </q-tooltip>
          </q-btn>
        </div>
        <textarea
          name="textarea"
          style="width: 100%; height: 300px; padding: 10px; font-size: 1.4rem"
          v-model="page.content"
        >
        </textarea>
      </div>
    </div>
  </q-page>
</template>

<script>
import ImageViewer from "components/ImageViewer";
import { mapActions, mapState } from "vuex";

export default {
  name: "ProofreadEditor",

  components: {
    ImageViewer,
  },

  data() {
    return {
      pageNum: 1,
      saving: false,
    };
  },

  watch: {
    pageNum() {
      const pageId = this.pageIds[this.pageNum - 1];
      this.fetchPage({ pechaId: this.pechaId, volId: this.volId, pageId });
    },

    page() {
      console.log(this.page);
    },
  },

  computed: {
    ...mapState("proofread", ["pageIds", "page"]),

    pechaId() {
      return this.$route.params.pechaId;
    },

    volId() {
      return this.$route.params.volId;
    },

    pageId() {
      return this.pageIds[this.pageNum - 1];
    },
  },

  methods: {
    ...mapActions("app", ["setNavBackPath"]),
    ...mapActions("proofread", ["fetchPageIds", "fetchPage"]),

    setPageNum() {
      const inputPageNum = this.$route.query.page;
      if (inputPageNum && inputPageNum > 0) {
        this.pageNum = inputPageNum;
      }
    },

    async save() {
      this.saving = true;
      this.$axios
        .post(
          process.env.OPENPECHA_API_URL +
            `/api/v1/proofread/${this.pechaId}/${this.volId}/${this.pageId}`,
          {
            content: this.page.content,
            image_url: this.page.imageUrl,
          }
        )
        .then((response) => {
          this.$q.notify({
            type: "positive",
            message: "saved ",
            position: "bottom",
            icon: "check",
          });
        })
        .catch((error) => {
          console.log(error);
          this.$q.notify({
            type: "negative",
            message: "failed to save, please contact the team",
            position: "bottom",
            icon: "sms_failed",
          });
        })
        .finally(() => {
          this.saving = false;
        });
    },
  },

  created() {
    this.fetchPageIds({ pechaId: this.pechaId, volId: this.volId });
    this.setPageNum();
    this.setNavBackPath(`/proofread/${this.pechaId}`);
  },
};
</script>

<style lang="scss" scoped>
</style>