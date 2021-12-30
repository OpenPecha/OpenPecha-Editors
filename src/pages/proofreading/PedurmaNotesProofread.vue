<template>
  <q-page class="q-pa-sm row q-gutter-sm" v-if="pages">
    <div class="col">
      <q-card class="image-card">
        <ImageViewer
          class="col"
          :src="imageUrl"
          :resize="false"
          alt="page image"
        />
      </q-card>
    </div>

    <div class="col">
      <div class="row justify-center bg-grey-3">
        <q-pagination
          v-model="currentPageNum"
          :min="pages[0].page_num"
          :max="pages.at(-1).page_num"
          input
          @input="changePage()"
        />
      </div>
      <textarea
        name="textarea"
        class="row"
        style="
          width: 100%;
          height: 86vh;
          padding: 10px;
          font-size: 1.4rem;
          overflow: auto;
        "
        v-model="manualPage"
      ></textarea>
    </div>
    <div class="col diffs">
      <div class="column items-center text-h5 bg-grey-2 q-py-xs">
       Diff
      </div>
      <div
        v-html="styledDiffs"
        style="
          width: auto;
          height: 86vh;
          padding: 10px;
          font-size: 1.1rem;
          border: 1px solid grey;
          overflow: auto;
        "
      ></div>
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
      currentPageNum: null,
      diffs: ""
    };
  },

  computed: {
    textId() {
      return this.$route.params.textId;
    },

    currentPageIdx () {
      return this.currentPageNum - this.pages[0].page_num
    },

    manualPage: { get: function () {
        return this.pages[this.currentPageIdx].manual
      },
      set: function (newValue) {
        this.pages[this.currentPageIdx].manual = newValue
        this.debouncedGetDiffs()
        this.debouncedSave()
      }
    },

    imageUrl() {
      console.log(this.currentPageIdx)
      console.log(this.pages[this.currentPageIdx])
      return this.pages[this.currentPageIdx].img_link
    },

    styledDiffs() {
      return this.formatDiff(this.diffs)
    }

  },

  methods: {
    save(pageId) {
      return this.$axios
        .put(getOrigin() + `/api/v1/pedurma/${this.textId}/notes/proofread`, this.pages[this.currentPageIdx])
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

    debouncedSave: debounce(function () {
      this.save()
    }, 1000),

    async fetchPages() {
      const response = await this.$axios.get(
        getOrigin() + `/api/v1/pedurma/${this.textId}/notes/proofread`
      );
      this.pages = response.data;
      this.currentPageNum = this.pages[0].page_num
    },

    changePage() {
      this.getDiffs()
    },

    async getDiffs() {
      const response = await this.$axios.post(
        getOrigin() +
          `/api/v1/diff`,
        {
          textA: this.pages[this.currentPageIdx].manual,
          textB: this.pages[this.currentPageIdx].google,
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
  },

  async created() {
    await this.fetchPages();
    this.getDiffs()
  },
};
</script>

<style scoped>
.image-card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
  overflow: auto;
}

.diffs >>> .diff-add {
  background-color: rgb(184, 236, 184);
}

.diffs >>> .diff-remove {
  background-color: rgb(236, 144, 144);
}
</style>
