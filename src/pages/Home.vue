<template>
  <q-page>
    <section class="hero q-mt-lg column content-center transparent">
      <div class="text-h4 text-center text-grey-9" style="max-width: 600px">
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
    </section>

    <section id="features" class="q-pa-xl q-mt-xl" style="background: #16042d">
      <div
        style="max-width: 1080px; margin: auto"
        class="row justify-center q-gutter-lg"
      >
        <q-card
          flat
          bordered
          v-for="product in products"
          :key="product.name"
          style="width: 300px"
          class="column"
        >
          <q-img :src="product.image" style="height: 200px" />

          <q-separator />

          <q-card-section>
            <div class="text-h5 q-mt-sm q-mb-xs">{{ product.name }}</div>
            <div class="text-caption text-grey">
              {{ product.desc }}
            </div>
          </q-card-section>

          <q-card-actions class="q-mt-auto">
            <q-btn
              v-if="product.ready"
              color="primary"
              icon-right="arrow_forward"
              label="Get Started"
              :to="product.path"
            />
            <q-btn v-else color="primary" label="Coming Soon" disabled />
          </q-card-actions>
        </q-card>
      </div>
    </section>

    <section id="about-us"></section>

    <section id="contact"></section>
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
      products: [
        {
          name: "Pedurma Editor",
          desc: "Editor for producing collated Kangyur and Tengyur text",
          image: require("assets/img/pedurma-editor.png"),
          path: "/pedurma",
          ready: true,
        },
        {
          name: "Proofreading Editor",
          desc: "Advanced proofreading by comparing different editions of text to save proofreading time",
          image: require("assets/img/proofreading-editor.png"),
          path: "/proofread",
          ready: true,
        },
        {
          name: "Annotation Editor",
          desc: "Editor for creating annotations and exporting into ebook",
          image: require("assets/img/annotation-editor.png"),
          path: "/editor/dashboard",
          ready: true,
        },
      ],
    };
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