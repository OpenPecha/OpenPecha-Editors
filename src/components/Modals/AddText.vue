<template>
  <q-card style="width: 700px; max-width: 1000px">
    <q-card-section class="row">
      <div class="text-h6">Add Text</div>
      <q-space />
      <q-btn v-close-popup flat round dense icon="close" />
    </q-card-section>

    <form @submit.prevent="submitForm">
      <q-card-section class="q-pt-none">
        <div class="row q-mb-sm">
          <q-input
            clearable
            clear-icon="close"
            outlined
            autofocus
            v-model="pechaMetadata.title"
            :rules="[(val) => !!val || 'Field is required']"
            ref="title"
            label="Title"
            class="col"
          />
        </div>
        <div class="row q-mb-sm">
          <q-input
            clearable
            clear-icon="close"
            outlined
            v-model="pechaMetadata.subtitle"
            ref="subtitle"
            label="Subtitle"
            class="col"
          />
        </div>
        <div class="row q-mb-sm">
          <q-input
            clearable
            clear-icon="close"
            outlined
            v-model="pechaMetadata.author"
            :rules="[(val) => !!val || 'Field is required']"
            ref="author"
            label="Author"
            class="col"
          />
        </div>
        <div class="row q-mb-sm">
          <q-input
            clearable
            clear-icon="close"
            outlined
            v-model="pechaMetadata.collection"
            ref="collection"
            label="Collection Title"
            class="col"
          />
        </div>
        <div class="row q-mb-sm">
          <q-input
            clearable
            clear-icon="close"
            outlined
            v-model="pechaMetadata.publisher"
            ref="publisher"
            label="Publisher"
            class="col"
          />
        </div>
        <div class="row q-mb-sm">
          <q-input
            clearable
            clear-icon="close"
            outlined
            v-model="pechaMetadata.sku"
            :rules="[(val) => !!val || 'Field is required']"
            ref="sku"
            label="Book Series Number (SKU)"
            class="col"
          />
        </div>
        <div class="row q-mb-sm">
          <q-file
            outlined
            accept="image/*"
            v-model="pechaAssets.frontCoverImage"
            label="Front Cover Image"
            ref="frontCoverImage"
            :rules="[(val) => !!val || 'Field is required']"
          >
            <template v-slot:append>
              <q-icon name="image" />
            </template>
          </q-file>
        </div>
        <div class="row q-mb-sm">
          <q-file
            outlined
            accept="image/*"
            v-model="pechaAssets.publicationDataImage"
            label="Publication Data Image"
            ref="publicationDataImage"
            :rules="[(val) => !!val || 'Field is required']"
          >
            <template v-slot:append>
              <q-icon name="image" />
            </template>
          </q-file>
        </div>
        <div class="row q-mb-sm">
          <q-file
            outlined
            accept=".txt"
            v-model="pechaAssets.text_file"
            label="Upload Text here"
            ref="text"
            :rules="[(val) => !!val || 'Field is required']"
          >
            <template v-slot:append>
              <q-icon name="text_snippet" />
            </template>
          </q-file>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Save" color="primary" type="submit" />
      </q-card-actions>
    </form>
  </q-card>
</template>

<script>
import { getOrigin } from "src/utils";

export default {
  data() {
    return {
      pechaMetadata: {
        title: "",
        subtitle: "",
        author: "",
        collection: "",
        publisher: "",
        sku: "",
      },
      pechaAssets: {
        text_file: null,
        frontCoverImage: null,
        publicationDataImage: null,
      },
    };
  },
  methods: {
    isValid() {
      let status = true;
      for (const [key, val] of Object.entries(this.$refs)) {
        val.validate();
        if (val.hasError) {
          status = false;
        }
      }
      return status;
    },

    submitForm() {
      if (this.isValid()) {
        this.createPecha();
      }
    },

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

    async createPecha() {
      this.$q.loading.show();
      try {
        const response = await this.$axios.post(
          getOrigin() + "/api/v1" + "/pechas",
          this.getPechaAssets(),
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            params: this.pechaMetadata,
          }
        );
        if (response.status == 200) {
          this.$router.push("/editor/" + response.data.pecha_id);
        }
      } catch (error) {
        console.log("Error", error);
      }
      this.$q.loading.hide();
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>