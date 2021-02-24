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
      <div class="item self-starti q-mt-lg q-mb-xl" style="width: 40%">
        <q-icon name="storage" style="font-size: 2rem" class="text-grey" />
        <div class="text-h5">Catalog</div>
        <div class="text-weight-light">
          A catalog of all the text published in openpecha format
        </div>
      </div>
    </section>

    <section
      id="about-us"
      class="row justify-center"
      style="background: #f7f7f7"
    >
      <div class="col-md-12 col-lg-12 col-xs-12 col-sm-12">
        <h5 class="text-center">
          About Us
          <br />
          <span class="text-center text-grey text-h6"
            >Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span
          >
        </h5>
      </div>
    </section>

    <section id="contact"></section>

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

  methods: {
    hoverOver: function (index) {
      this["about_heading_color_" + index] = this.theme_color;
      this["about_heading_" + index] = ["animated", "bounceIn"];
    },
    hoverOutTimeout: function (index) {
      this["about_heading_color_" + index] = "#424242";
      setTimeout(() => {
        this["about_heading_" + index] = [];
      }, 1000);
    },
  },
};
</script>

<style lang="sass" scoped>
.container
  width: 60%

.my-card
  width: 350px
  max-width: 350px
  margin-top: 10px
</style>