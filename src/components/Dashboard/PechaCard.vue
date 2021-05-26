<template>
  <div @click="open">
    <img class="pecha-cover" :src="img" />
    <q-menu
      touch-position
      context-menu
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <q-list style="min-width: 100px">
        <q-item clickable v-close-popup @click="exportPecha">
          <q-item-section>Export to Epub</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="updateMetadata">
          <q-item-section>Update Metadata</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="updateAssets">
          <q-item-section>Update Assets</q-item-section>
        </q-item>
        <q-separator />
        <q-btn
          flat
          label="Delete"
          color="negative"
          icon="delete"
          @click="confirm"
          class="full-width"
        />
      </q-list>
    </q-menu>

    <q-dialog v-model="showMetadata">
      <Metadata :pecha_id="id" />
    </q-dialog>

    <q-dialog v-model="showDownload" persistent>
      <download-link-box :link="downloadUrl" />
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getOrigin } from "src/utils";
import Metadata from "components/Modals/Metadata";
import DownloadLinkBox from "components/Modals/DownloadLinkBox";

export default {
  props: {
    img: String,
    title: String,
    id: String,
  },

  data() {
    return {
      metadata: {},
      showMetadata: false,
      showAssets: false,
      showDownload: false,
      downloadUrl: "",
    };
  },

  components: {
    Metadata,
    DownloadLinkBox,
  },

  computed: {
    ...mapGetters("app", ["userAccessToken"]),
  },

  methods: {
    open() {
      this.$router.push("/editor/" + this.id);
    },

    updateMetadata() {
      this.showMetadata = true;
    },

    async remove() {
      try {
        const response = await this.$axios.delete(
          getOrigin() + `/api/v1/pechas/${this.id}`,
          {
            headers: {
              token: this.userAccessToken,
            },
          }
        );
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
      this.$q.notify({
        type: "positive",
        message: "pecha deleted",
        position: "bottom-right",
      });
      this.$emit("remove-pecha", this.id);
    },

    updateAssets() {
      this.showAssets = true;
      this.$q.notify({
        type: "info",
        message: "Not implemented yet, we will let know",
      });
    },

    confirm() {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure want to delete the Pecha",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.remove();
        });
    },

    async exportPecha() {
      this.$q.loading.show();
      const response = await this.$axios.get(
        getOrigin() + `/api/v1/pechas/${this.id}/export/review`,
        {
          headers: {
            token: this.userAccessToken,
          },
        }
      );
      this.$q.loading.hide();
      if (response["status"] == 200) {
        this.downloadUrl = response.data.download_link;
        this.showDownload = true;
      } else {
        this.$q.notify({
          type: "negative",
          message: "export failed",
        });
      }
    },
  },
};
</script>

<style scoped>
.pecha-cover {
  height: 100%;
  width: 100%;
}
</style>