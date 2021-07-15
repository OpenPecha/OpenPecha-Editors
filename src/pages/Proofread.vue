<template>
  <q-page class="container column q-pt-sm" v-if="pages">
    <div class="row">
      <div class="content col">
        <div class="row justify-center items-center bg-grey-3">
          <q-btn
            flat
            dense
            disable
            col="col"
            icon="chevron_left"
            size="20px"
            @click="loadImage('previous')"
          />
          <div v-if="pageImageUrl">{{ imageName }}</div>
          <q-btn
            flat
            dense
            col="col"
            icon="chevron_right"
            size="20px"
            @click="loadImage('next')"
          />
        </div>

        <ImageViewer
          class="col"
          :src="pageImageUrl"
          alt="page image"
          style="
            height: 250px;
            border: 2px solid grey;
            resize: both;
            overflow: auto;
          "
        />

        <div class="editor q-mb-md">
          <div class="column items-center bg-grey-3">
            <q-pagination
              v-model="pageIdInt"
              :max="Object.keys(pages).length"
              input
            />
          </div>
          <textarea
            name="textarea"
            style="width: 100%; height: 250px; padding: 10px; font-size: 1.4rem"
            v-model="page"
          >
          </textarea>
        </div>
        <div class="diffs">
          <q-card>
            <q-tabs
              v-model="tab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="current" label="Current/Trans." no-caps />
              <q-tab name="google" label="Google/Current" no-caps />
              <q-tab name="derge" label="Derge/Current" no-caps />
            </q-tabs>

            <q-separator />

            <q-tab-panels
              v-model="tab"
              animated
              style="font-size: 1.3rem; max-height: 250px; overflow: auto"
            >
              <q-tab-panel name="current">
                <div v-html="diffs.transk"></div>
              </q-tab-panel>

              <q-tab-panel name="google">
                <div v-html="diffs.google_ocr"></div>
              </q-tab-panel>

              <q-tab-panel name="derge">
                <div v-html="diffs.derge"></div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import ImageViewer from "src/components/ImageViewer.vue";
import { getOrigin } from "src/utils";

export default {
  name: "Proofread",

  components: {
    ImageViewer,
  },

  data() {
    return {
      tab: "current",
      pages: null,
      pageId: "0001",
      pageIdInt: 1,
      page: "",
      pageImageUrl: "",
      diffs: {
        transk: "",
        google_ocr: "",
        derge: "",
      },
    };
  },

  watch: {
    page(pageContent) {
      ["transk", "google_ocr", "derge"].forEach((diffWith) => {
        this.getDiffs(diffWith).then((diffs) => {
          this.diffs[diffWith] = this.formatDiff(diffs);
        });
      });
    },

    pageIdInt() {
      if (this.page) {
        this.save(this.pageId);
      }
      this.pageId = this.pageIdInt.toString().padStart(4, "0");
      this.open(this.pageId);
    },
  },

  computed: {
    pageList() {
      return Object.keys(this.pages).map((key) => {
        return {
          id: key,
          ...this.pages[key],
        };
      });
    },

    volId() {
      return this.$route.query.volId;
    },

    imageName() {
      return this.pageImageUrl.split("::")[1].split("/")[0];
    },
  },

  methods: {
    save(pageId) {
      this.$axios
        .put(getOrigin() + `/api/v1/proofread/${this.volId}/${pageId}`, {
          content: this.page,
          image_url: this.pageImageUrl,
        })
        .then((response) => {
          if (response.data.success === true) {
            this.$q.notify({
              type: "positive",
              message: `Page ${pageId} saved`,
              position: "bottom-right",
            });
          }
        })
        .catch(() => {
          this.$q.notify({
            type: "negative",
            message: `Page ${pageId} failed to saved`,
            position: "bottom-right",
          });
        });
    },

    async open(pageId) {
      const response = await this.$axios.get(
        getOrigin() + `/api/v1/proofread/${this.volId}/${pageId}`
      );
      this.page = response.data.content;
      this.pageImageUrl = response.data.image_url;
      this.pageId = pageId;
    },

    async fetchPages() {
      const response = await this.$axios.get(
        getOrigin() + "/api/v1/proofread/metadata/vols/" + this.volId
      );
      this.pages = response.data;
    },

    async getDiffs(diffWith) {
      const response = await this.$axios.post(
        getOrigin() +
          `/api/v1/proofread/${this.volId}/${this.pageId}/diffs?diff_with=${diffWith}`,
        {
          content: this.page,
          image_url: this.pageImageUrl,
        }
      );
      return response.data.diffs;
    },

    addStyle(string, styleName) {
      const styledStr = `<span class=${styleName}>${string}</span>`;
      return styledStr;
    },

    toPara(string) {
      var paras = "";
      for (const line of string.split("\n")) {
        paras = paras.concat(`<p>${line}</p>`);
      }
      return paras;
    },

    formatDiff(diffs) {
      var formattedDiffs = "";
      for (const diff of diffs) {
        const [op, chunk] = diff;
        if (op === 1) {
          formattedDiffs = formattedDiffs.concat(
            this.addStyle(chunk, "diff-remove")
          );
        } else if (op === -1) {
          formattedDiffs = formattedDiffs.concat(
            this.addStyle(chunk, "diff-add")
          );
        } else {
          formattedDiffs = formattedDiffs.concat(chunk);
        }
      }
      return this.toPara(formattedDiffs);
    },

    loadImage(order) {
      this.$axios
        .post(getOrigin() + `/api/v1/proofread/images/${order}`, {
          image_url: this.pageImageUrl,
        })
        .then((response) => {
          this.pageImageUrl = response.data.image_url;
        });
    },
  },

  async mounted() {
    await this.fetchPages();
    this.open(this.pageId);
  },
};
</script>

<style scoped>
.container {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.diffs >>> .diff-add {
  background-color: rgb(184, 236, 184);
}

.diffs >>> .diff-remove {
  background-color: rgb(236, 144, 144);
}
</style>
