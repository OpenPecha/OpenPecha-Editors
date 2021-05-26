<template>
  <q-card v-if="metadata.source_metadata" class="q-pa-sm" style="width: 500px">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        clearable
        clear-icon="close"
        outlined
        autofocus
        v-model="metadata.source_metadata.title"
        label="Title"
      />
      <q-input
        clearable
        clear-icon="close"
        outlined
        v-model="metadata.source_metadata.subtitle"
        label="Subtitle"
      />
      <q-input
        clearable
        clear-icon="close"
        outlined
        v-model="metadata.source_metadata.authors[0]"
        label="Author"
      />
      <q-input
        clearable
        clear-icon="close"
        outlined
        v-model="metadata.source_metadata.collection"
        label="Collection Title"
      />
      <q-input
        clearable
        clear-icon="close"
        outlined
        v-model="metadata.source_metadata.publisher"
        label="Publisher"
      />
      <q-input
        clearable
        clear-icon="close"
        outlined
        v-model="metadata.source_metadata.id"
        label="Book Series Number (SKU)"
      />
      <!-- <q-file
        outlined
        accept="image/*"
        v-model="pechaAssets.frontCoverImage"
        label="Front Cover Image"
      >
        <template v-slot:append>
          <q-icon name="image" />
        </template>
      </q-file>
      <q-file
        outlined
        accept="image/*"
        v-model="pechaAssets.publicationDataImage"
        label="Publication Data Image"
      >
        <template v-slot:append>
          <q-icon name="image" />
        </template>
      </q-file> -->
      <div>
        <q-btn label="Submit" type="save" color="primary" />
        <q-btn label="Reset" type="reset" color="primary" flat />
      </div>
    </q-form>
  </q-card>
</template>

<script>
import { getOrigin } from "src/utils";
import { mapGetters } from "vuex";

export default {
  name: "Metadata",
  props: {
    pecha_id: String,
  },

  data() {
    return {
      pechaAssets: {
        frontCoverImage: null,
        publicationDataImage: null,
      },
      metadata: {},
    };
  },

  computed: {
    ...mapGetters("app", ["userAccessToken"]),
  },

  methods: {
    getPechaAssets() {
      let formData = new FormData();
      formData.append("front_cover_image", this.pechaAssets.frontCoverImage);
      formData.append(
        "publication_data_image",
        this.pechaAssets.publicationDataImage
      );
      return formData;
    },

    async updateMetadata() {
      this.$q.loading.show({
        message: "Updating metadata...",
      });
      try {
        const response = await this.$axios.put(
          getOrigin() + `/api/v1/pechas/${this.pecha_id}/metadata`,
          this.metadata,
          // ...this.getPechaAssets(),
          {
            headers: {
              "Content-Type": "multipart/form-data",
              token: this.userAccessToken,
            },
          }
        );
        if (response.status == 200) {
          this.$q.notify({
            type: "positive",
            message: "metadata updated",
            position: "bottom",
          });
          this.$router.go();
        } else {
          this.$q.notify({
            type: "negative",
            message: "failed",
            position: "bottom",
          });
        }
      } catch (error) {
        console.log("Error", error);
        this.$q.notify({
          type: "negative",
          message: "failed",
          position: "bottom",
        });
      }
      this.$q.loading.hide();
      this.$emit("close");
    },

    onSubmit() {
      this.updateMetadata();
    },

    async fetchData() {
      try {
        const response = await this.$axios.get(
          getOrigin() + `/api/v1/pechas/${this.pecha_id}/metadata`
        );
        this.metadata = await response.data;
      } catch (err) {
        console.log(err);
      }
    },

    onReset() {
      this.fetchData();
    },
  },

  async mounted() {
    this.fetchData();
  },
};
</script>

<style lang="scss" scoped>
</style>