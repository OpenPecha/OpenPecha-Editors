<template>
  <q-page>
    <section class="hero column content-center theme-color">
      <div
        class="text-h5 q-pt-md text-weight-medium text-center"
        style="max-width: 500px"
      >
        Etext archive facilitating cross-disciplinary collaboration in curating
        and enriching etexts
      </div>
      <q-btn label="Get Started" class="q-mt-lg q-mb-md self-center" />
    </section>
    <section
      class="feature column q-mt-xl q-ml-auto q-mr-auto"
      style="width: 60%"
    >
      <div class="item self-start" style="width: 40%">
        <q-icon
          name="format_align_left"
          style="font-size: 2rem"
          class="text-grey"
        />
        <div class="text-h5">Format</div>
        <div class="text-weight-light">
          A format to represent a text with all sorts of annotations.
        </div>
      </div>
      <div class="item self-end q-mt-lg" style="width: 40%">
        <q-icon name="padding" style="font-size: 2rem" class="text-grey" />
        <div class="text-h5">Editor</div>
        <div class="text-weight-light">
          Create annotations and export text into ebook. Get annotations
          suggestion to speed up the work.
        </div>
      </div>
      <div class="item self-starti q-mt-lg" style="width: 40%">
        <q-icon name="storage" style="font-size: 2rem" class="text-grey" />
        <div class="text-h5">Catalog</div>
        <div class="text-weight-light">
          A catalog of all the text published in openpecha format
        </div>
      </div>
    </section>
  </q-page>
</template>

<script>
export default {
  name: "Index",
};
</script>

<style lang="scss" scoped>
</style>