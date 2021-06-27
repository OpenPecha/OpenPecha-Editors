<template>
  <q-page padding class="container">
    <div class="column">
      <q-toolbar class="bg-grey-3 q-mb-md">
        <q-btn flat icon="menu" @click="showPages = !showPages" />
        <div class="full-width text-center">Page {{ pageId }}</div>
      </q-toolbar>
      <div class="row">
        <div class="page-list col-2 q-mr-md" v-show="showPages">
          <q-list bordered separator style="max-height: 700px; overflow: auto">
            <q-item
              v-for="page in pageList"
              :key="page.id"
              clickable
              v-ripple
              @click="open(page.id)"
            >
              <q-item-section> Page {{ page.id }} </q-item-section>
            </q-item>
            <q-separator />
          </q-list>
        </div>
        <div v-if="page" class="content col">
          <div class="row items-center q-mb-md q-ml-auto q-mr-auto">
            <q-btn
              flat
              dense
              col="col"
              icon="chevron_left"
              size="20px"
              @click="loadImage('previous')"
            />
            <ImageViewer
              class="col"
              :src="pageImageUrl"
              alt="page image"
              style="border: 2px solid grey"
            />
            <q-btn
              flat
              dense
              col="col"
              icon="chevron_right"
              size="20px"
              @click="loadImage('next')"
            />
          </div>
          <div class="editor text-center q-mb-md">
            <textarea
              name="textarea"
              style="
                width: 100%;
                min-height: 250px;
                padding: 10px;
                font-size: 1.4rem;
              "
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

              <q-tab-panels v-model="tab" animated style="font-size: 1.3rem">
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
      showPages: false,
      pages: [],
      pageId: "0001",
      page: "",
      pageImageUrl:
        "https://www.tbrc.org/browser/ImageService?work=W22703&igroup=5404&image=6&first=1&last=818&fetchimg=yes",
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
  },

  methods: {
    save() {
      this.$axios
        .put(getOrigin() + `/api/v1/proofread/${this.volId}/${this.pageId}`, {
          content: this.page,
          image_url: this.pageImageUrl,
        })
        .then((response) => {
          if (response.data.success === true) {
            this.$q.notify({
              type: "positive",
              message: `Page ${this.pageId} saved`,
              position: "bottom-right",
            });
          }
        })
        .catch(() => {
          this.$q.notify({
            type: "negative",
            message: `Page ${this.pageId} failed to saved`,
            position: "bottom-right",
          });
        });
    },

    async open(pageId) {
      if (this.page) {
        this.save();
      }

      const response = await this.$axios.get(
        getOrigin() + `/api/v1/proofread/${this.volId}/${pageId}`
      );
      this.page = response.data.content;
      this.pageImageUrl = response.data.image_url;
      this.pageId = pageId;
      this.showPages = false;
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
  max-width: 1000px;
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