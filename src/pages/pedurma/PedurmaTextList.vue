<template>
  <q-page padding>
    <div
      class="q-ml-auto q-mr-auto q-mt-lg row justify-between"
      style="width: 500px"
    >
      <q-input
        filled
        v-model="search"
        label="Search by Text ID or Title"
        style="font-size: 1.5rem"
      >
        <template v-slot:append>
          <q-icon v-if="search === ''" name="search" />
          <q-icon
            v-else
            name="clear"
            class="cursor-pointer"
            @click="search = ''"
          />
        </template>
      </q-input>

      <q-btn
        flat
        no-caps
        dense
        icon="open_in_new"
        label="Report"
        color="primary"
        @click="openURL('https://docs.google.com/spreadsheets/d/1PoNnrEoGMXdzlGznMF3UJU7GmrcZcP_h8CDaolkkrWA/edit#gid=0')"
      />
    </div>
    <div
      class="q-mt-lg q-mx-auto"
      style="max-width: 1000px; height: 10px"
    >
      <q-intersection
        v-for="textId in filteredTexts"
        :key="textId"
        style="height: 7vh"
        transition="fade"
      >
        <q-item clickable v-ripple>
          <q-item-section
            style="max-width: 50px"
            @click="open(textId)"
          >
            <q-item-label class="text-h6">{{ textId }}</q-item-label>
          </q-item-section>

          <q-item-section
            style="margin-left: 50px"
            @click="open(textId)"
          >
            <q-item-label
              class="text-h4"
              style="margin-top: -20px"
            >{{ texts[textId].title }}
          </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon
              class="cursor-pointer text-green-4"
              name="file_download"
              size="md"
              @click="download(textId)"
            >
              <q-tooltip> Download </q-tooltip>
            </q-icon>
          </q-item-section>
        </q-item>
      </q-intersection>
    </div>
    <q-dialog v-model="showDownloadBox" persistent>
      <download-link-box :link="download_url" />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import { openURL } from "quasar"

const KANGYUR = "kangyur";
const TENGYUR = "tengyur";

export default {
  name: "PedurmaTextList",
  components: {
    DownloadLinkBox: require("components/Modals/DownloadLinkBox.vue").default,
  },

  data() {
    return {
      search: "",
      texts: [],
      katen: TENGYUR,
      download_url: "",
      showDownloadBox: false,
    };
  },

  computed: {
    filteredTexts() {
      return Object.keys(this.texts)
        .filter((textId) => {
          return (
            this.includes(this.search, textId) ||
            this.includes(this.search, this.texts[textId].title)
          );
        });
    },
  },

  methods: {
    ...mapActions("app", ["unsetNavBackPath"]),

    includes(s1, s2) {
      return s2.toLowerCase().includes(s1.toLowerCase());
    },

    async fetchTexts() {
      try {
        const url =
          this.katen === TENGYUR
            ? process.env.T_TEXT_LIST_URL
            : process.env.K_TEXT_LIST_URL;
        const response = await this.$axios.get(url);
        this.texts = response.data
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          console.log("Server Error:", err);
        } else if (err.request) {
          // client never received a response, or request never left
          console.log("Network Error:", err);
        } else {
          console.log("Client Error:", err);
        }
      }
    },

    open(text_id) {
      this.$router.push("/pedurma/" + text_id);
    },

    download(text_id) {
      // this.download_url = `https://github.com/OpenPecha/P000791/releases/download/${text_id}/${text_id}.zip`;
      // this.showDownloadBox = true;
    },

    openURL(url) {
      openURL(url)
    }
  },

  mounted() {
    this.fetchTexts();
  },

  created() {
    this.unsetNavBackPath();
  },
};
</script>

<style lang="scss" scoped>
</style>