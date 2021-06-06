<template>
  <q-page>
    <section class="hero q-mt-lg column content-center transparent">
      <div
        class="text-h5 text-weight-thin text-center"
        style="max-width: 500px"
      >
        Etext
        <span class="text-italic text-bold" style="color: #56d5dd"
          >archive</span
        >
        facilitating
        <span class="text-italic text-bold" style="color: #8e57f1"
          >cross-disciplinary collaboration</span
        >
        in curating and enriching etexts
      </div>
      <q-btn
        @click="showEditorChoices = true"
        label="Get Started"
        rounded
        no-caps
        size="lg"
        style="background: #8e57f1; color: white"
        class="q-mt-lg q-mb-lg self-center"
      />
    </section>
    <section id="features" class="q-pa-xl q-mt-xl" style="background: #f7f7f7">
      <div class="feature column q-ml-auto q-mr-auto" style="width: 60%">
        <div class="item self-start" style="width: 40%">
          <q-icon
            name="format_align_left"
            style="font-size: 4rem; color: #8e57f1"
          />
          <div class="text-subtitle1">Format</div>
          <div class="text-weight-light">
            A format to represent a text with all sorts of annotations.
          </div>
        </div>
        <div class="item self-end q-mt-lg" style="width: 40%">
          <q-icon name="padding" style="font-size: 4rem; color: #8e57f1" />
          <div class="text-subtitle1">Editor</div>
          <div class="text-weight-light">
            Create annotations and export text into ebook. Get annotations
            suggestion to speed up the work.
          </div>
        </div>
        <div class="item self-start q-mt-lg" style="width: 40%">
          <q-icon name="storage" style="font-size: 4rem; color: #8e57f1" />
          <div class="text-subtitle1">Catalog</div>
          <div class="text-weight-light">
            A catalog of all the text published in openpecha format
          </div>
        </div>
      </div>
    </section>

    <!-- <section
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
    </section> -->

    <section id="contact"></section>

    <q-dialog v-model="showEditorChoices">
      <EditorChoices :editors="editors" />
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: "HomePage",
  components: {
    EditorChoices: require("src/components/Modals/EditorChoices.vue").default,
  },

  data() {
    return {
      showEditorChoices: false,
      editors: [
        {
          name: "General",
          path: "/editor/dashboard",
        },
        {
          name: "Pedurma",
          path: "/editor/pedurma",
        },
      ],
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