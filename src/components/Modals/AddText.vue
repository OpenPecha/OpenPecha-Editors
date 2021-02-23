<template>
  <q-card>
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
            v-model="textToSubmit.title"
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
            v-model="textToSubmit.subtitle"
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
            v-model="textToSubmit.author"
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
            v-model="textToSubmit.collection"
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
            v-model="textToSubmit.publisher"
            ref="publisher"
            label="Publisher"
            class="col"
          />
        </div>
        <div class="row q-mb-sm">
          <q-file
            outlined
            accept="image/*"
            v-model="textToSubmit.frontCoverImage"
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
            v-model="textToSubmit.publicationDataImage"
            label="Publication Data Image"
            ref="publicationDataImage"
            :rules="[(val) => !!val || 'Field is required']"
          >
            <template v-slot:append>
              <q-icon name="image" />
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
export default {
  data() {
    return {
      textToSubmit: {
        title: "",
        subtitle: "",
        author: "",
        collection: "",
        publisher: "",
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
      console.log("form submit");
      if (this.isValid()) {
        this.submitText();
      }
    },
    submitText() {
      console.log(this.textToSubmit);
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>