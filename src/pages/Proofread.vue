<template>
  <q-page
    padding
    class="column q-gutter-md"
    style="max-width: 1000px; margin: auto"
  >
    <section class="image text-center">
      <img
        src="https://eap.bl.uk/sites/default/files/styles/publicity_image/public/Capture_22.JPG?itok=FvA3uXQu"
        alt="page image"
        height="250px"
        width="100%"
      />
    </section>
    <section class="editor text-center">
      <textarea
        name="textarea"
        style="width: 100%; min-height: 200px; padding: 10px; font-size: 1.3rem"
        v-model="text"
      >
      </textarea>
    </section>
    <section class="diffs">
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
    </section>
  </q-page>
</template>

<script>
export default {
  name: "Proofread",

  data() {
    return {
      tab: "current",
      text: "གར་དང་།ལྷོ་དང་ནུབ་དང་།བྱང་དང་།ག་དང་སྟོང་དང་། ཕྱོགས་བཅུ་ཀུན་ནདགའ་ལྡན་གྱི་གནསན་འཁོད་ཅིང། ཐམས་ཚད་ཀྱང་སྲིད་པ་ཐམལ་མངོན་དུ་ཕྱོགས་པ། ལྷའི་ཚོགས་ཀྱིས་ཡོས་སུ་བསྐོརབ།འཆའབོ་བའི་རྣམ\nགར་དང་།ལྷོ་དང་ནུབ་དང་།བྱང་དང་།ག་དང་སྟོང་དང་། ཕྱོགས་བཅུ་ཀུན་ནདགའ་ལྡན་གྱི་གནསན་འཁོད་ཅིང། ཐམས་ཚད་ཀྱང་སྲིད་པ་ཐམལ་མངོན་དུ་ཕྱོགས་པ། ལྷའི་ཚོགས་ཀྱིས་ཡོས་སུ་བསྐོརབ།འཆའབོ་བའི་རྣམ\nགར་དང་།ལྷོ་དང་ནུབ་དང་།བྱང་དང་།ག་དང་སྟོང་དང་། ཕྱོགས་བཅུ་ཀུན་ནདགའ་ལྡན་གྱི་གནསན་འཁོད་ཅིང། ཐམས་ཚད་ཀྱང་སྲིད་པ་ཐམལ་མངོན་དུ་ཕྱོགས་པ། ལྷའི་ཚོགས་ཀྱིས་ཡོས་སུ་བསྐོརབ།འཆའབོ་བའི་རྣམ",
    };
  },
};
</script>