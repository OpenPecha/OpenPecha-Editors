<template>
  <q-page class="col" v-if="pages">
    <div
      style="max-width: 1800px; min-width: 800px; height: 80vh; margin: auto"
    >
      <q-card class="image-card">
        <ImageViewer
          class="col"
          :src="currentPage.image_url"
          :resize="false"
          alt="page image"
        />
      </q-card>

      <div>
        <div class="row justify-center bg-grey-3">
          <q-pagination
            v-model="currentPageNum"
            :max="pages.length"
            input
            @input="changePage()"
          />
        </div>
        <textarea
          name="textarea"
          class="row"
          style="
            width: 100%;
            height: 28vh
            padding: 10px;
            font-size: 1rem;
            line-height: 1;
            overflow: auto;
          "
          v-model="currentPageContent"
        ></textarea>
      </div>
      <div class="col diffs">
        <div class="row justify-center text-h6 bg-grey-2 q-py-xs">
          <div
            class="q-px-xs"
            style="background-color: rgb(184, 236, 184);"
          >{{ projectMetadata.proofreading_version }}
          </div>
          <div
            class="q-px-xs"
            style="background-color: rgb(236, 144, 144);"
          >{{ projectMetadata.versions[0] }}
          </div>
        </div>
        <div
          v-html="styledDiffs"
          style="
            width: auto;
            height: 28vh
            padding: 10px;
            font-size: 1rem;
            line-height: 1;
            border: 1px solid grey;
            overflow: auto;
          "
        ></div>
      </div>
    </div>
  </q-page>
</template>

<script>
import ImageViewer from "src/components/ImageViewer.vue";
import { getOrigin } from "src/utils";
import debounce from "debounce"

export default {
  name: "Proofread",

  components: {
    ImageViewer,
  },

  data() {
    return {
      pages: null,
      currentPageNum: 1,
      projectMetadata: null,
      diffs: "",
      currentPage: {
        content: "",
        image_url: ""
      },
      versionPage: null
    };
  },

  computed: {
    projectName() {
      return this.$route.params.projectName;
    },

    volId() {
      return this.$route.params.volId;
    },

    currentPageId () {
      return this.pages[this.currentPageNum - 1]
    },

    currentPageContent: {
      get: function () {
        return this.currentPage.content
      },
      set: function(newValue) {
        this.currentPage.content = newValue
        console.log(newValue)
        this.debouncedGetDiffs()
        this.debouncedSave()
      }
    },

    proofreadinVersion() {
      return this.projectMetadata.proofreading_version
    },

    styledDiffs() {
      return this.formatDiff(this.diffs)
    }
  },

  methods: {
    save() {
      return this.$axios
        .put(getOrigin() + `/api/v1/diffproofread/${this.projectName}/${this.proofreadinVersion}/${this.volId}/${this.currentPageId}`,
            this.currentPage
          )
        .then((response) => {
          if (response.data.success === true) {
            this.$q.notify({
              type: "positive",
              message: `Page ${this.currentPageId} saved`,
              position: "bottom-right",
            });
          }
        })
        .catch(() => {
          this.$q.notify({
            type: "negative",
            message: `Page ${this.currentPageId} failed to saved`,
            position: "bottom-right",
          });
        });
    },

    debouncedSave: debounce(function () {
      this.save()
    }, 1000),

    async fetchProjectMetadata() {
      const response = await this.$axios.get(
        getOrigin() + `/api/v1/diffproofread/metadata/${this.projectName}`
      );
      this.projectMetadata = response.data;
    },

    async fetchPages() {
      const response = await this.$axios.get(
        getOrigin() + `/api/v1/diffproofread/metadata/${this.projectName}/${this.proofreadinVersion}/${this.volId}`
      );
      this.pages = response.data.pages;
    },

    async fetchPage() {
      var response = await this.$axios.get(
        getOrigin() + `/api/v1/diffproofread/${this.projectName}/${this.proofreadinVersion}/${this.volId}/${this.currentPageId}`
      );
      this.currentPage = response.data;

      var response = await this.$axios.get(
        getOrigin() + `/api/v1/diffproofread/${this.projectName}/${this.projectMetadata.versions[0]}/${this.volId}/${this.currentPageId}`
      );
      this.versionPage = response.data;
    },

    async changePage() {
      await this.fetchPage()
      this.getDiffs()
    },

    async getDiffs() {
      const response = await this.$axios.post(
        getOrigin() +
          `/api/v1/diff`,
        {
          textA: this.currentPage.content,
          textB: this.versionPage.content,
        }
      );
      this.diffs = response.data
    },

    debouncedGetDiffs: debounce(function() {
      this.getDiffs()
    }, 1000),

    addStyle(string, styleName) {
      const styledStr = `<span class=${styleName}>${string}</span>`;
      return styledStr;
    },

    toPara(string) {
      var paras = "";
      for (const line of string.split("\n")) {
        paras = paras.concat(`<p style="margin: 0">${line}</p>`);
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
  },

  async created() {
    await this.fetchProjectMetadata()
    await this.fetchPages()
    await this.fetchPage()
    this.getDiffs()
  },
};
</script>

<style scoped>
.image-card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30vh;
  overflow: auto;
}

.diffs >>> .diff-add {
  background-color: rgb(184, 236, 184);
}

.diffs >>> .diff-remove {
  background-color: rgb(236, 144, 144);
}
</style>