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
        <q-item clickable v-close-popup @click="updateMetadata">
          <q-item-section class="text-center">Metadata</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="exportPecha">
          <q-item-section class="text-center">Export</q-item-section>
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getOrigin } from "src/utils";
import Metadata from "components/Modals/Metadata";

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
    };
  },

  components: {
    Metadata,
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
      console.log("update ", this.id);
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

    exportPecha() {
      console.log("exporting ", this.id);
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