<template>
  <!-- <q-card  flat>
    <q-card-section class="row justify-center">
      <div class="text-h5 text-purple-4">Metadata</div>
    </q-card-section>
  </q-card> -->
  <q-card class="q-pa-sm" style="width: 500px">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        clearable
        clear-icon="close"
        outlined
        autofocus
        v-model="metadata.source_metadata.title"
        :rules="[(val) => !!val || 'Field is required']"
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
        :rules="[(val) => !!val || 'Field is required']"
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
        :rules="[(val) => !!val || 'Field is required']"
        label="Book Series Number (SKU)"
      />
      <q-file
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
      </q-file>
      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn label="Reset" type="reset" color="primary" flat />
      </div>
    </q-form>
  </q-card>
</template>

<script>
import { getOrigin } from "src/utils";

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

  methods: {
    getPechaAssets() {
      let formData = new FormData();
      formData.append("text_file", this.pechaAssets.text_file);
      formData.append("front_cover_image", this.pechaAssets.frontCoverImage);
      formData.append(
        "publication_data_image",
        this.pechaAssets.publicationDataImage
      );
      return formData;
    },

    onSubmit() {
      if (this.accept !== true) {
        this.$q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "You need to accept the license and terms first",
        });
      } else {
        this.$q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Submitted",
        });
      }
    },

    onReset() {
      this.name = null;
      this.age = null;
      this.accept = false;
    },
  },

  async mounted() {
    try {
      const response = await this.$axios.get(
        getOrigin() + `/api/v1/pechas/${this.pecha_id}/metadata`
      );
      this.metadata = response.data;
    } catch (err) {
      console.log(err);
    }
  },
};
</script>

<style lang="scss" scoped>
</style>