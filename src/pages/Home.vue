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
      <q-btn
        label="Get Started"
        class="q-mt-lg q-mb-md self-center"
        @click="showAddText = true"
      />
    </section>
    <section
      id="features"
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

    <section id="about-us" class="row justify-center q-mt-lg">
      <div class="text-h3">About Us</div>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Temporibus non
        suscipit facilis, alias natus explicabo. Unde facere dolores distinctio
        voluptas impedit velit doloribus nam officiis inventore, iste quibusdam
        ab quam.
      </p>
    </section>

    <section id="contact" class="row justify-center q-mt-lg">
      <div class="text-h3">Contact</div>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias qui
        tenetur ex corrupti nesciunt, dignissimos minus praesentium aspernatur
        obcaecati vitae ipsa fugit placeat molestiae officia nobis esse fugiat
        eius facere.
      </p>
    </section>

    <q-dialog v-model="showAddText" persistent>
      <add-text @close="showAddText = false" />
    </q-dialog>
  </q-page>
</template>

<script>
import AddText from "src/components/Modals/AddText";

export default {
  name: "HomePage",
  components: {
    AddText,
  },

  data() {
    return {
      showAddText: false,
    };
  },
};
</script>

<style lang="sass" scoped>
.container
  width: 60%
</style>