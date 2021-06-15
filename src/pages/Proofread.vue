<template>
  <q-page padding class="container">
    <div class="column">
      <q-toolbar class="bg-grey-3 q-mb-md">
        <q-btn flat icon="menu" @click="showPages = !showPages" />
        <div class="full-width text-center">Page {{ currentPage }}</div>
      </q-toolbar>
      <div class="row">
        <div class="page-list col-2 q-mr-md" v-show="showPages">
          <q-list bordered separator style="max-height: 700px; overflow: auto">
            <q-item
              v-for="page in pages"
              :key="page"
              clickable
              v-ripple
              @click="open(page)"
            >
              <q-item-section> Page {{ page }} </q-item-section>
            </q-item>
            <q-separator />
          </q-list>
        </div>
        <div class="content col">
          <div class="row items-center q-mb-md q-ml-auto q-mr-auto">
            <q-btn flat dense col="col" icon="chevron_left" size="20px" />
            <ImageViewer
              class="col"
              src="https://www.tbrc.org/browser/ImageService?work=W22703&igroup=5404&image=6&first=1&last=818&fetchimg=yes"
              alt="page image"
              style="border: 2px solid grey"
            />
            <q-btn flat dense col="col" icon="chevron_right" size="20px" />
          </div>
          <div class="editor text-center q-mb-md">
            <textarea
              name="textarea"
              style="
                width: 100%;
                min-height: 250px;
                padding: 10px;
                font-size: 1.4rem;
              "
              v-model="text"
            >
            </textarea>
          </div>
          <div class="diffs">
            <q-card>
              <q-tabs
                v-model="tab"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator
              >
                <q-tab name="current" label="Current/Trans." no-caps />
                <q-tab name="google" label="Google/Current" no-caps />
                <q-tab name="derge" label="Derge/Current" no-caps />
              </q-tabs>

              <q-separator />

              <q-tab-panels v-model="tab" animated style="font-size: 1.3rem">
                <q-tab-panel name="current">
                  <pre>{{ text }}</pre>
                </q-tab-panel>

                <q-tab-panel name="google">
                  <pre>{{ text }}</pre>
                </q-tab-panel>

                <q-tab-panel name="derge">
                  <pre>{{ text }}</pre>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import ImageViewer from "src/components/ImageViewer.vue";
export default {
  name: "Proofread",

  components: {
    ImageViewer,
  },

  data() {
    return {
      tab: "current",
      text: "བ་དང་།བྱང་དང་།ག་དང་སྟོང་དང་། ཕྱོགས་བཅུ་ཀུན་ནདགའ་ལྡན་གྱི་གནསན་འཁོད་ཅིང། ཐམས་ཚད་ཀྱང་སྲིད་པ་ཐམལ་མངོན་དུ་ཕྱོགས་པ། ལྷའི་ཚོགས་ཀྱིས་ཡོས་སུ་བསྐོརབ།འཆའབོ་བའི་རྣམ\nགུབ་དང་།བྱང་དང་།ག་དང་སྟོང་དང་། ཕྱོགས་བཅུ་ཀུན་ནདགའ་ལྡན་གྱི་གནསན་འཁོད་ཅིང། ཐམས་ཚད་ཀྱང་སྲིད་པ་ཐམལ་མངོན་དུ་ཕྱོགས་པ། ལྷའི་ཚོགས་ཀྱིས་ཡོས་སུ་བསྐོརབ།འཆའབོ་བའི་རྣམ\nབྱང་དང་།ག་དང་སྟོང་དང་། ཕྱོགས་བཅུ་ཀུན་ནདགའ་ལྡན་གྱི་གནསན་འཁོད་ཅིང། ཐམས་ཚད་ཀྱང་སྲིད་པ་ཐམལ་མངོན་དུ་ཕྱོགས་པ། ལྷའི་ཚོགས་ཀྱིས་ཡོས་སུ་བསྐོརབ།འཆའབོ་བའི་རྣམ",
      showPages: false,
      currentPage: null,
      pages: [...Array(100).keys()],
    };
  },

  methods: {
    open(page) {
      console.log("opening page ", page);
      this.currentPage = page;
      this.showPages = false;
    },
  },

  mounted() {
    this.currentPage = this.pages[0];
  },
};
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}
</style>