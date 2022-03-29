<template>
  <q-page class="col q-mx-lg" v-if="currentPage.image_url">
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
            font-size: 1.2rem;
            line-height: 1.5;
            overflow: auto;
          "
          v-model="currentPageContent"
        ></textarea>
      </div>
      <div class="col diffs">
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
            <q-tab
              v-for="version in this.projectMetadata.versions"
              :key="version"
              :name="version"
              :label="projectMetadata.proofreading_version + '/' + version"
              no-caps
            >
            </q-tab>
          </q-tabs>

          <q-separator />

          <q-tab-panels
            v-model="tab"
            animated
            style="font-size: 1.3rem; max-height: 250px; overflow: auto"
          >
            <q-tab-panel
              v-for="version in this.projectMetadata.versions"
              :key="version"
              :name="version"
            >
              <!-- <div v-html="getStyledDiffs(version)"></div> -->
            </q-tab-panel>

          </q-tab-panels>
        </q-card>
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
        <!-- <div
          v-html="styledDiffs"
          style="
            width: auto;
            height: 28vh
            padding: 10px;
            font-size: 1.2rem;
            line-height: 1.5;
            border: 1px solid grey;
            overflow: auto;
          "
        ></div> -->
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
      diffs: {},
      currentPage: {
        content: null,
        image_url: null
      },
      versionsPage: {},
      tab: ""
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
      this.tab = this.projectMetadata.versions[0]
    },

    async fetchPages() {
      const response = await this.$axios.get(
        getOrigin() + `/api/v1/diffproofread/metadata/${this.projectName}/${this.proofreadinVersion}/${this.volId}`
      );
      this.pages = response.data.pages;
    },

    async fetchPageContent(version) {
      var response = await this.$axios.get(
        getOrigin() + `/api/v1/diffproofread/${this.projectName}/${version}/${this.volId}/${this.currentPageId}`
      );
      return response.data;
    },

    async fetchPage() {
      this.currentPage = await this.fetchPageContent(this.projectMetadata.proofreading_version)

      for (const version of this.projectMetadata.versions) {
        this.versionsPage[version] = await this.fetchPageContent(version)
      }
    },

    async changePage() {
      await this.fetchPage()
      this.getDiffs()
    },

    getStyledDiffs(version) {
      return this.formatDiff(version)
    },

    getVersionsDiffs() {
      for (const version in this.projectMetadata.versions) {
        this.getDiffs(version)
      }
    },

    async getDiffs(version) {
      const response = await this.$axios.post(
        getOrigin() +
          `/api/v1/diff`,
        {
          textA: this.currentPage.content,
          textB: this.versionsPage[version].content,
        }
      );
      this.diffs[version] = response.data
    },

    debouncedGetDiffs: debounce(function(version) {
      this.getDiffs(version)
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

    async formatDiff(version) {
      var formattedDiffs = "";
      this.debouncedGetDiffs(version)
      for (const diff of this.diffs[version]) {
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
    this.getVersionsDiffs()
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
