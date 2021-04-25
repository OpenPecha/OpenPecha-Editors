<template>
  <div class="container">
    <q-card class="image-card">
      <img
        src="https://i0.wp.com/www.dontwasteyourtime.co.uk/wp-content/uploads/2012/07/screenshot_2012-07-26T15_37_48-0100.gif?ssl=1"
      />
    </q-card>

    <div class="edit">
      <div class="edit__editors">
        <div class="tabs row justify-between">
          <q-tabs
            v-model="editorTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <!-- <q-tab name="google" label="Google"></q-tab> -->
            <q-tab name="namsel" label="Namsel"></q-tab>
          </q-tabs>

          <q-tabs
            v-model="editorTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="google-notes" label="Google Note"></q-tab>
            <q-tab name="namsel-notes" label="Namsel Note"></q-tab>
          </q-tabs>
        </div>

        <q-tab-panels v-model="editorTab" animated>
          <q-tab-panel name="namsel">
            <editor ref="namsel" :text="pageText()" />
          </q-tab-panel>
          <q-tab-panel name="google-notes">
            <!-- <editor
              ref="google-note"
              :text="getNote('google', currentPageNo)"
            /> -->
          </q-tab-panel>

          <q-tab-panel name="namsel-notes">
            <!-- <editor
              ref="namsel-note"
              textAreaIdProp="namsel-note-textarea"
              :extraTools="false"
              :hasList="false"
              :content="getNote('namsel', currentPageNo)"
            /> -->
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <div class="preview">
      <div class="preview__btn">
        <q-btn color="secondary" label="Preview" @click="getPreview" />
      </div>
      <div class="preview__content q-mt-md" v-html="currentPreview"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PedurmaDashbaord",
  components: {
    editor: require("components/Pedurma/Editor.vue").default,
  },

  data() {
    return {
      currentPageId: "",
      currentPreview: "",
      editorTab: "namsel",
      editor: "namsel",
      loading: true,
      pages: {
        google: [
          {
            id: "03d31782141e434cbdcf6a80184b3fa4",
            page_no: 207,
            content:
              "[𰸎104a]\n[104a.1]{D1115}༡༦༩\n[104a.2]༠༠༠༧ ཟླ་ 1:1-9\n[104a.3]\n[104a.4]. - {ཆ་ཁ་ཚོ་ལ།2ཚེ། ང ཀག་པ་ལྡང་དུབ་ཀ@པོ་བོ་ང་ཁྱེད་\n[104a.5]གང་བྱོའི་གླིང་ng: 9) 127 །ཆ་ ཞི་འགལ་ཀྱི་ན་བ།\n[104a.6]ལ་བབ།།ང་ཡི{TTiཏོeཆོeཏན་དུ་གཏོང་བར་ཕྱོགས་ཁ་བ་དང་མ་སུ་རྒྱུད་\n[104a.7]ཙ་པཚོའང་ད་སྟེ་ འོང་ཡོe 1:|:ཀ་ར་ཀ་ཏོ་ཚུ་ སྤྱི་ལོ་\n[104a.8]༡ ཝཱིཀྐའི་བདག ) ཡོ་125170\n[104a.9]༄༅། །ཆོས་ཀྱི་སྐུ་ལ་གནས་པའི་ཡོན་ཏན་ཐུན་མོང་\n[104a.10]12)ཎཝ་ཏུ།། པད་མ་ཡིན་པ་ལ་བསྟོད་པ། ལ་ལ་ལུང་བ་ཟེར་བ་\n[104a.11]\"g Ap762 'ਸਰਬਲ ਵਲੋਂ ਸਵਾਆਰਥਿਕ ਸਰੂ ਰ ਣ\n[104a.12]ਬਾਣoਨਾਲ ਰਸਗੋਂ 1 2\n[104a.13]ਸਮਾਜ\n[104a.14]15ཛིལ་ -༄༅། །ཆོས་ཀྱི་སྐུ་ལ་གནས་པའི་ཡོན་ཏན་ཐུན་མོང་མ་ཡིན་པ་ལ་བསྟོད་\n[104a.15]པ། དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ལ་ཕྱག་འཚལ་ལོ། །སེམས་ཅན་རྣམས་ལ་\n[104a.16]ཐུགས་བརྩེ་བ། །ཕྲད་དང་བྲལ་བར་དགོངས་པ་ཅན། །མི་འབྲལ་དགོངས་ཤིང་\n[104a.17]བདེ་བ་ཅན། །དགོངས་པ་ཁྱོད་ལ་ཕྱག་འཚལ་ལོ། །སྒྲིབ་པ་ཀུན་ལས་ངེས་པར་\n[104a.18]གྲོལ། །ཐུབ་པས་འཇིག་རྟེན་ཀུན་ཟིལ་མནན། །ཁྱོད་ཀྱི་མཁྱེན་པས་ཤེས་བྱ་་་\n[104a.19]ཁྱབ། །སེམས་གྲོལ་ཁྱོད་ལ་ཕྱག་འཚལ་ལོ། །སེམས་ཅན་ཀུན་གྱི་ཉོན་མོངས་་་\n[104a.20]ཀུན། །མ་ལུས་པ་དག་འདུལ་མཛད་པ། །ཉོན་མོངས་སེལ་བ་ཉོན་མོངས་པ། །\n[104a.21]བརྩེར་བཅས་ཁྱོད་ལ་ཕྱག་འཚལ་ལོ། །ལྷུན་གྱིས་གྲུབ་ཅིང་ཆགས་མི་མངའ། ཚོ།\n[104a.22]ཐོགས་པ་མི་མངའ་རྟག་ཏུ་ཡང་། །མཉམ་པར་གཞག་“ཅིང་འདྲི་ཀུན་གྱི། །ལན་\n[104a.23]ལྡོན་ཁྱོད་ལ་ཕྱག་འཚལ་ལོ། །གནས་དང་གནས་པ་བཤད་བྱ་དང་། །ཚིག་དང་\n[104a.24]ཤེས་པ་སྟོན་པ་ལ། །རྟག་ཏུ་བློ་གྲོས་མི་ཐོགས་པ། །སྟོན་མཆོག་ཁྱོད་ལ་ཕྱག་་་་\n[104a.25]1-169\n[104a.26]\n[104a.27]\n[104a.28]\n",
            name: "Page 207",
            vol: "1",
            image_link:
              "https://iiif.bdrc.io/bdr:I1PD95846::I1PD958460207.jpg/full/max/0/default.jpg",
            note_ref: "",
          },
          {
            id: "1ad72cf9d547474096d6c2f2d5c83ec4",
            page_no: 208,
            content:
              "[𰸏104b]\n[104b.1]༡༧。\n[104b.2]བསྟན་འགྱུར། བསྟོད་ཚོགས། ༼ཀ༽ ༡\n[104b.3]འཚལ་ལོ། །ཆེད་དུ་ཞུ་”དང་དེ་དག་གི། །ཚིག་དང་སྤྱོད་མཁྱེན་འོངས་པ་དང་། །\n[104b.4]འགྲོ་དང་ངེས་འབྱུང་སེམས་ཅན་ལ། །ལེགས་འདོམས་ཁྱོད་ལ་ཕྱག་འཚལ་ལོ། །\n[104b.5]ལུས་ཅན་ཀུན་གྱིས་ཁྱོད་མཐོང་ན། །སྐྱེས་བུ་མཆོག་ཏུ་རྟོགས་པར་འགྱུར། ::།\n[104b.6]མཐོང་བ་ཙམ་གྱིས་དད་འགྱུར་བར། །མཛད་པ་ཁྱོད་ལ་ཕྱག་འཚལ་ལོ། །ལེན་\n[104b.7]དང་གནས་དང་གཏོང་བ་དང་། །སྤྲུལ་པ་དང་ནི་བསྒྱུར་བ་དང་། །ཏིང་ངེ་་་\n[104b.8]འཛིན་དང་ཡེ་ཤེས་ལ། །མངའ་བརྙེས་ཁྱོད་ལ་ཕྱག་འཚལ་ལོ། །ཐབས་དང་་་་\n[104b.9]སྐྱབས་དང་དག་པ་དང༌། །ངེས་འབྱུང་ཐེག་པ་ཆེན་པོ་ལ། །སེམས་ཅན་རྣམས་\n[104b.10]ལ་སླུ་ཅིབ་ཡི། །བདུད་འཇོམས་ཁྱོད་ལ་ཕྱག་འཚལ་ལོ། །ཡེ་ཤེས་དང་ནི་སྤངས་པ་\n[104b.11]དང་། །ངེས་འབྱུང་བགེགས་བྱེད་སྟོན་མཛད་པ། །བདག་གཞན་དོན་ལ་མུ་་་\n[104b.12]སྟེགས་གཞན། །མི་ཚུགས་ཁྱོད་ལ་ཕྱག་འཚལ་ལོ། །འཁོར་དུ་ཚར་བཅད་གསུང་\n[104b.13]མཛད་པ། - །ཀུན་ནས་ཉོན་མོངས་གཏན་སྤངས་ལ། །བསྲུང་བ་མི་མངའ་བསྙེལ་\n[104b.14]མི་མངའ། །ཚོགས་སྡུད་ཁྱོད་ལ་ཕྱག་འཚལ་ལོ། །གཤེགས་བཞུགས་ཀུན་དུ་རྟག་\n[104b.15]པར་ཡང་། །ཀུན་མཁྱེན་མ་ལགས་སྤྱོད་མི་མངའ། །ཁྱོད་ནི་ཡང་དག་དོན་དུ་ན།།\n[104b.16]ཀུན་མཁྱེན་ཁྱོད་ལ་ཕྱག་འཚལ་ལོ། །སེམས་ཅན་ཀུན་གྱི་དོན་མཛད་པ། །ཁྱོད་ནི་\n[104b.17]དུས་ལས་ཡོང་མི་འདའ། །རྟག་ཏུ་འབྲས་བུ་ཡོད་མཛད་པ། །མི་བསྙེལ་ཁྱོད་ལ་\n[104b.18]ཕྱག་འཚལ་ལོ། །འཇིག་རྟེན་ཀུན་ལ་གདུགས་ཞག་གཅིག །ལན་དྲུག་ཏུ་ནི་་་་།\n[104b.19]གཟིགས་མཛད་པ། །ཐུགས་རྗེ་ཆེ་དང་ལྡན་པ་པོ། །ཕན་དགོངས་ཁྱོད་ལ་ཕྱག་\n[104b.20]འཚལ་ལོ། །གཤེགས་དང་ཐུགས་སུ་ཆུད་པ་དང༌། །མཁྱེན་པ་དང་ནི་ཕྲིན་ལས་\n[104b.21]ཀྱིས། །ཉན་ཐོས་དང་ནི་རང་སངས་རྒྱས། །ཀུན་མཆོག་ཁྱོད་ལ་ཕྱག་འཚལ་ལོ། །\n[104b.22]བྱང་ཆུབ་ཆེན་པོའི་རྣམ་པ་ཀུན། །སྐུ་གསུམ་”དག་གིས་བརྙེས་གྱུར་པ། །ཀུན་དུ་\n[104b.23]སེམས་ཅན་ཐམས་ཅད་ཀྱི། །དོགས་གཅོད་ཁྱོད་ལ་ཕྱག་འཚལ་ལོ། །སྲི་བ་མི་་་\n[104b.24]1-170\n[104b.25]\n[104b.26]\n[104b.27]\n[104b.28]\n",
            name: "Page 208",
            vol: "1",
            image_link:
              "https://iiif.bdrc.io/bdr:I1PD95846::I1PD958460208.jpg/full/max/0/default.jpg",
            note_ref: "",
          },
          {
            id: "eaeaca6e81db4cc4a3937a2ec1c3669a",
            page_no: 209,
            content:
              "[𰸐105a]\n[105a.1]༡༧ ༡\n[105a.2]ཆོས་ཀྱི་སྐུ་ལ་གནས་པའི་ཡོན་ཏན་ཐུན་མོང་མ་ཡིན་པ་ལ་བསྟོད་པ།\n[105a.3]མངའ་སྐྱོན་མི་མངའ།\t།རྙོག་པ་མི་མངའ་བཞུགས་མི་མངའ། །གཡོ་བ་མི་མངའ་\n[105a.4]ཆོས་ཀུན་ལ། །མ་སྤྲོས་ཁྱོད་ལ་ཕྱག་འཚལ་ལོ། །ཆོས་སྐུ་ལ་གནས་ཡོན་ཏན་འདི་\n[105a.5]ལ་བདག་གིས་རབ་བསྟོད་པས། །ཡོན་ཏན་དྲུག་ལྡན་སྐུ་གསུམ་པོ་ནི་ཡོངས་སུ་་་་\n[105a.6]རྫོགས་པར་ནི། ༩ །བདག་སོགས་འགྲོ་བ་རྣམས་ཀྱིས་མྱུར་དུ་རྟོགས་པར་ཤོག །\n[105a.7]ཆོས་ཀྱི་སྐུ་ལ་གནས་པའི་ཡོན་ཏན་ཐུན་མོང་མ་ཡིན་པ་ལ་བསྟོད་པ། སློབ་དཔོན་\n[105a.8]ཐོགས་མེད་ཀྱིས་མཛད་པ་རྫོགས་སོ།།\n[105a.9]རྒྱ་གར་གྱི་མཁན་པོ་ཛི་ན་མི་ཏྲ་དང་། ཤཱི་ལེནྡྲ་བོ་དྷི་དང་། ཞུ་ཆེན་གྱི་ལོ་\n[105a.10]ཙཱ་བ་བནྡེ་ཡེ་ཤེས་སྡེས་བསྒྱུར་ཅིང་ཞུས་ཏེ་གཏན་ལ་ཕབ་པ།། །\n[105a.11]( 3 praཚོ་སྤྲོ་པའོ\n[105a.12]1:|\n[105a.13]1:|\n[105a.14]།\n[105a.15]སྤངས་པ་\n[105a.16]དང་། །ཕྱི་དང་བྱེད་པ།\n[105a.17]ད\n[105a.18]ངན་འགྲོའི་བུ་ག་བ་ང་\n[105a.19]ད ་པ།\n[105a.20]ལ།\n[105a.21]པད\n[105a.22]གཏན་ལ་\n[105a.23]ང་ཚ་པ་ལོག་པ་དག་\n[105a.24]། རེ་བ་\n[105a.25]དྲི་ལེན་པ། |\n[105a.26]དུལ་ཞེས་པ་ད་ང་བ་\n[105a.27]རྒྱ་བལ་འབད་ན། །ཡང་རང་ལ་དགའ་ཞིང༌།\n[105a.28]དག་ཏུ་ཉེ།\n[105a.29]1-171\n[105a.30]\n[105a.31]\n[105a.32]\n[105a.33]\n",
            name: "Page 209",
            vol: "1",
            image_link:
              "https://iiif.bdrc.io/bdr:I1PD95846::I1PD958460209.jpg/full/max/0/default.jpg",
            note_ref: "",
          },
        ],
        namsel: [
          {
            id: "40b00d63653041798163cca80ef271ff",
            page_no: 207,
            content:
              "[𰸎104a]\n[104a.1]{D1115}\n[104a.2]\n[104a.3]\n[104a.4]\n[104a.5]\n[104a.6]\n[104a.7]\n[104a.8]་་\n[104a.9]\n[104a.10]༠༧༄། །ཆོས་ཀྱི་སྐུ་ལ་གནས་པའི་ཡོན་ཏན་ཐུན་མོང་\n[104a.11]མ་ཡིན་པ་ལ་བསྟོད་པ།\n[104a.12]\n[104a.13]\n[104a.14]\n[104a.15]①༄༧༅། །ཆོས་ཀྱི་སྐུ་ལ་གནས་པའི་ཡོན་ཏན་ཐུན་མོང་མ་ཡིན་པ་ལ་བསྟོད་\n[104a.16]པ་། དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ལ་ཕྱག་འཚལ་ལོ། །སེམས་ཅན་རྣམས་ལ་\n[104a.17]ཐུགས་བརྩེ་བ། །ཕྲད་དང་བྲལ་བར་དགོངས་པ་ཅན། །མི་འབྲལ་དགོངས་ཤིང་\n[104a.18]བདེ་བ་ཅན། །དགོངས་པ་ཡོ་ལ་ཕྱག་འ༅་ལོ། །སྒྲིབ་པ་ཀུན་ལས་ངེས་པར་\n[104a.19]གྲོལ་། །ཐུབ་པས་འཇིག་རྟེན་ཀུན་ཟིལ་མནན། །ཡོ་ཀྱི་མཡོ་པས་ཤེས་བྱ་་་\n[104a.20]ཁྱབ་། །སེམས་གྲོལ་ཁྱོད་ལ་ཕྱག་འཚལ་ལོ། །སེམས་ཅན་ཀུན་གྱི་ཉོན་མོངས་་་\n[104a.21]ཀུན་། །མ་ལུས་པ་དག་འདུལ་མཛད་པ། །ཉོན་མོངས་སེལ་བ་ཉོན་མོངས་པ། །\n[104a.22]བརྩེར་བཅས་ཁྱོད་ལ་ཕྱག་འཚལ་ལོ། །ལྷུན་གྱིས་གྲུབ་ཅིང་ཆགས་མི་མངའ །\n[104a.23]ཐོགས་པ་མི་མངའ་རྟག་ཏུ་ཡང་། །མཉམ་པར་གཞག་②ཅིང་འདྲི་ཀུན་གྱི། །ལན་\n[104a.24]ལྡོན་ང་ལ་ཕྱག་འ༅་ལོ། །གནས་དང་གནས་པ་བཤད་བྱ་དང་། །ཚིག་དང་\n[104a.25]ཤེས་པ་སྟོན་པ་ལ། །རྟག་ཏུ་བློ་གྲོས་མི་ཐོགས་པ། །སྟོན་མཆོག་ཁྱོད་ལ་ཕྱག་་་་\n[104a.26]1-169\n[104a.27]\n[104a.28]\n[104a.29]\n[104a.30]\n[104a.31]\n",
            name: "Page 207",
            vol: "1",
            image_link:
              "https://iiif.bdrc.io/bdr:I1PD95846::I1PD958460207.jpg/full/max/0/default.jpg",
            note_ref: "",
          },
          {
            id: "6ba9f2a59066413689a7e4848359de80",
            page_no: 208,
            content:
              "[𰸏104b]\n[104b.1]\n[104b.2]\n[104b.3]\n[104b.4]འ༅་ལོ། །ར་དུ་ཞུ་①དང་དེ་དག་གི། །ཚིག་དང་སྤྱོད་མལོ་འོངས་པ་དང་།།\n[104b.5]འགྲོ་དང་ངེས་འབྱུང་སེམས་ཅན་ལ། །ལེགས་འདོམས་ཡོ་ལ་ཕྱག་འཚལ་ལོ །\n[104b.6]ལུས་ཅན་ཀུན་གྱིས་ཡོ་མཐོང་ན། །སྐྱེས་བུ་མཆོག་ཏུ་རྟོགས་པར་འགྱུར། །\n[104b.7]མཐོང་བ་ཙམ་གྱིས་དད་འཕ་བར། །མཛད་པ་ལོ་ལ་ཕྱག་འ༅་ལོ། །ལེན་\n[104b.8]དང་གནས་དང་གཏོང་བ་དང་། །སྤྲུལ་པ་དང་ནི་བསྒྱུར་བ་དང་། །ཏིང་ངེ་་་་\n[104b.9]འཛིན་དང་ཡེ་ཤེས་ལ། །མངའ་བརྙེས་ཡོ་ལ་ཕྱག་འ༅་ལོ། །ཐབས་དང་་་་\n[104b.10]སྐྱབས་དང་དག་པ་དང་། །ངེས་འབྱུང་ཐེག་པ་ཇ་པོ་ལ། །སེམས་ཅན་རྣམས་\n[104b.11]ལ་སླུ་་་བ་ཡི། །བདུད་འཇོམས་ཡོ་ལ་ཕྱག་འ༅་ལོ། །ཡེ་ཤེས་དང་ནི་སྤངས་པ་\n[104b.12]དང་་། །ངེས་འབྱུང་བགེགས་བྱེད་སྟོན་མཛད་པ། །བདག་གཞན་དོན་ལ་མུ་་་\n[104b.13]སྟེགས་གཞན། །མི་ཚུགས་ཡོ་ལ་ཕྱག་འཚལ་ལོ། །འཁོར་དུ་ཚར་བཅད་གསུང་\n[104b.14]མཛད་པ། །ཀུན་ནས་ཉོན་མོངས་གཏན་སྤངས་ལ⑤། །བསྲུང་བ་མི་མངའ་བསྙེལ་\n[104b.15]མི་མངའ། །ཚོགས་སྡུད་ང་ལ་ཕྱག་འཚལ་ལོ། །གཤེགས་བཞུགས་ཀུན་དུ་རྟག་\n[104b.16]པར་ཡང་། །ཀུན་མཡོ་མ་ལགས་སྤྱོད་མི་མངའ། །ཡོ་ནི་ཡང་དག་དོན་དུ་ན།།\n[104b.17]ཀུན་མཡོ་ཡོ་ལ་ཕྱག་འ༅་ལོ། །སེམས་ཅན་ཀུན་གྱི་དོན་མཛད་པ། །ཡོ་ནི་\n[104b.18]དུས་ལས་ཡོང་མི་འདའ། །རྟག་ཏུ་༅ས་བུ་ཡོད་མཛད་པ། །མི་བསྙེལ་ཡོ་ལ་\n[104b.19]ཕྱག་འཚལ་ལོ། །འཇིག་རྟེན་ཀུན་ལ་གདུགས་ཞག་གཅིག །ལན་དྲུག་ཏུ་ནི་་་་\n[104b.20]་གཟིགས་མཛད་པ། །ཐུགས་རྗེ་ཆེ་དང་ལྡན་པ་པོ། །ཕན་དགོངས་ཡོ་ལ་ཕྱག་\n[104b.21]འ༅་ལོ། །གཤེགས་བ་ཐུགས་སུ་མ་པ་དང་། །མཡོ་པ་དང་ནི་ཕྲིན་ལས་\n[104b.22]ཀྱིས་། །ཉན་ཐོས་དང་ནི་རང་སངས་རྒྱས། །ཀུན་མཆོག་ལོ་ལ་ཕྱག་འ༅་ལོ། །\n[104b.23]བྱང་ས་པོ་པོའི་རྣམ་པ་ཀུན། །སྐུ་གསུམ༅དག་གིས་བརྙེས་གྱུར་པ། །ཀུན་དུ་\n[104b.24]སེམས་ཅན་ཐམས་ཅད་ཀྱི། །དོགས་གཅོད་ཁྱོད་ལ་ཕྱག་འཚལ་ལོ། །སྲི་བ་མི་་་\n[104b.25]1-170\n[104b.26]\n[104b.27]\n[104b.28]\n[104b.29]\n[104b.30]\n[104b.31]\n",
            name: "Page 208",
            vol: "1",
            image_link:
              "https://iiif.bdrc.io/bdr:I1PD95846::I1PD958460208.jpg/full/max/0/default.jpg",
            note_ref: "",
          },
          {
            id: "6a6f5fc42b564e199809d98a5438601f",
            page_no: 209,
            content:
              "[𰸐105a]\n[105a.1]\n[105a.2]\n[105a.3]\n[105a.4]མངའ་སྐྱོན་མི་མངའ། །རྙོག་པ་མི་མངའ་བཞུགས་མི་མངའ། །གཡོ་བ་མི་མངའ་\n[105a.5]ཆོས་ཀུན་ལ། །མ་སྤྲོས་ཁྱོད་ལ་ཕྱག་འཚལ་ལོ། །ཆོས་སྐུ་ལ་གནས་ཡོན་ཏན་འདི་\n[105a.6]ལ་བདག་གིས་རབ་བསྟོད་པས། །ཡོན་ཏན་དྲུག་ལྡན་སྐུ་གསུམ་པོ་ནི་ཡོངས་སུ་་་་་\n[105a.7]རྫོགས་པར་ནི། །བདག་སོགས་འགྲོ་བ་རྣམས་ཀྱིས་མྱུར་དུ་རྟོགས་པར་ཤོག །\n[105a.8]ཆོས་ཀྱི་སྐུ་ལ་གནས་པའི་ཡོན་ཏན་ཐུན་མོང་མ་ཡིན་པ་ལ་བསྟོད་པ། སློབ་དཔོན་\n[105a.9]ཐོགས་མེད་ཀྱིས་མཛད་པ་རྫོགས་སོ།།\n[105a.10]།།རྒྱ་གར་ཀྱི་མཁན་པོ་ཛི་ན་མི་ཏྲ་དང་། ཤཱི་ལེནྡྲ་བོ་དྷི་དང་། ཞུ་ཆེན་གྱི་ལོ་\n[105a.11]ཙཱ་①བ་བནྡེ་ཡེ་ཤེས་སྡེས་བསྒྱུར་ཅིང་ཞུས་ཏེ་གཏན་ལ་ཕབ་པ།། །\n[105a.12]\n[105a.13]\n[105a.14]\n[105a.15]།\n[105a.16]\n[105a.17]\n[105a.18]\n[105a.19]\n[105a.20]\n[105a.21]\n[105a.22]\n[105a.23]\n[105a.24]\n[105a.25]\n[105a.26]\n[105a.27]\n[105a.28]\n[105a.29]\n[105a.30]1-171\n[105a.31]\n[105a.32]\n[105a.33]\n[105a.34]\n[105a.35]\n[105a.36]\n",
            name: "Page 209",
            vol: "1",
            image_link:
              "https://iiif.bdrc.io/bdr:I1PD95846::I1PD958460209.jpg/full/max/0/default.jpg",
            note_ref: "",
          },
        ],
      },
      notes: {
        google: [
          {
            id: "8eb66aa1f0ba429f873356b8f3b5f6a6",
            page_no: 210,
            content:
              "[105b]\n[105b.1]<d༡༧༢\n[105b.2]/༢༣ བསྟན་འགྱུར། བསྟོད་ཚོགས། ཀ ༡ ཚོ\n[105b.3]2:༧ཟླ་ཚོ་ཁ་ཤོད་ཀྱི་སྐད་དུ་ལུང་། དགུ་པ། ཀ་ལུ་སྤྲོ་བ་ད ང ་།\n[105b.4]་ཆེ་བ་ལེ་ཀ་ཏ་ཏེ་ཁྱོན་བསྣམས་པ་ཚོ་ཁྱག་འ1-2\n[105b.5]\n[105b.6]e/jpཚོ\n[105b.7]ਉਰਲਰ ਉਸਦਾ ਸੁਖਵਰਸ਼ਕ ਰੋਬੋਟ ਤੋਂ ਆਖ਼Raਖਣ\n[105b.8]༡༦༩།ཨེམཚན་བྱང་འདི་གཞུང་ལས་བླངས་ཏེ་བཀོད་ཅིང་། «སྡེ་»ཆོས་ཀྱི་སྐུ་ལ་གནས་པའི་ཡོན་ཏན་ལ་བསྟོད་པ་བཞུགས།\n[105b.9]«པེ་»«སྣར་》ཆོས་ཀྱི་སྐུ་ལ་གནས་པའི་ཡོན་ཏན་ཐུན་མོང་མ་ཡིན་པ་ལ་བསྟོད་པ་བཞུགས་སོ།། ༄༅«སྣར་》བཞག\n[105b.10]༡༧༠ ༧«པེ་»«སྣར་»བཞུད། )«པེ་»«སྣར་»བསླུ། ཉི«པེ་»«སྣར་》པ། 8«པེ་»«སྣར་»གསུང་།\n[105b.11]༡༧༡ «པེ་»ཙྪ། སར ལ །\n[105b.12]ག ་པ་ལ་\n[105b.13]བདག་ག་་་་་་་་་་ པ་གླེང་པ་རྗེ་བྱ་ལོ་ཀོ་ཁཀ།བྱའི་གཡུ་རུ་མ་\n[105b.14]བ་ཁ་བས་བཟམ་>-aཔལ 1 འབག་\n[105b.15]།\n[105b.16]བསྟོད་ཚོགས། (༧)\n[105b.17]པེ་ཅིན།\n[105b.18]ཅོ་ནེ།\n[105b.19]དཔེ་གཞི། ། སྡེ་དགེ། །\n[105b.20]སྣར་ཐང་།\n[105b.21]སྡེ་ཚན། བ སྟོད་ཚོགས། བསྟོད་ཚོགས། བསྟོད་ཚོགས།\n[105b.22]ཚན་གྲངས།\n[105b.23]པོད་རྟགས། |\n[105b.24]ལྡེབ། ༦༡ བ༦-༦༢ བ་། ༧ ༡ན༣-༧༢ ན་། ༦༨ ན -༦༨ བ༦\n[105b.25]ཕྲེང༌། ། ༡༢ ། ༡༧ ། ༡༣\n[105b.26]ཚིག་རྐང་། ། ༨ ༡༡ ༡༣ ༨ ༡༡ ༡༣ ༨ ༡༡ ༡༣\n[105b.27]ཚེག་ཁྱིམ། །\n[105b.28]༦༡༨ ། ༦༡༩ །\n[105b.29]བ་ལ་\n[105b.30]༦༨༡༢\n[105b.31]༦ ༡ ༢\n[105b.32]འ་དང་ ། །ཕྱེ་བ་འདྲ་ བ་དང་།\n[105b.33]1:\n[105b.34]:\n[105b.35]: ། ་་་\n[105b.36]ན ་ ཚལ་ལོ། །\n[105b.37]བྱ་ཆེ་བ། དག་པོ། J་ཏུ་\n[105b.38]པ་དེ་ན་བས་དུད་ཀྱི ་ དབྱེ་བ་ལ་བྱ་བ། །སྐྱེ་བ་མི་\n[105b.39]1-172\n[105b.40]d>",
            name: "Page 210",
            vol: "1",
            image_link:
              "https://iiif.bdrc.io/bdr:I1PD95846::I1PD958460210.jpg/full/max/0/default.jpg",
          },
        ],
        namsel: [],
      },
    };
  },

  computed: {
    pagesDict() {
      const pagesDict = {};
      this.pages.namsel.forEach((page) => {
        pagesDict[page.id] = page;
      });
      return pagesDict;
    },

    notesDict() {
      const notesDict = {};
      const googleNotesDict = {};
      const namselNotesDict = {};
      this.notes.google.forEach((note) => {
        googleNotesDict[note.id] = note;
      });
      this.notes.namsel.forEach((note) => {
        namselNotesDict[note.id] = note;
      });
      notesDict["google"] = googleNotesDict;
      notesDict["namsel"] = namselNotesDict;
      return notesDict;
    },
  },

  methods: {
    pageText() {
      // this.getPreview();
      console.log(this.currentPageId);
      return this.pagesDict[this.currentPageId].content;
    },

    saveText() {
      console.log("Save text");
    },

    getNote(textType, currentPageNo) {
      const notesPageId = this.pages[textType][currentPageNo - 1][
        "notes_page_id"
      ];

      for (var notesPage in this.notes[textType]) {
        if (notesPage.id == notesPageId) {
          return notesPage.content;
        }
      }
    },

    getCurrentPage(textType) {
      return this.pages[textType][this.currentPageNo - 1];
    },

    getPageNote(textType, page) {
      return this.notes[textType].find(
        (notesPage) => notesPage.id == page.notes_page_id
      );
    },

    async getPreview() {
      const googleCurrentPage = this.getCurrentPage("google");
      const namselCurrentPage = this.getCurrentPage("namsel");
      const googlePageNote = this.getPageNote("google", googleCurrentPage);
      const namselPageNote = this.getPageNote("namsel", namselCurrentPage);

      await this.$axios
        .post(process.env.OPENPECHA_API_URL + "/api/v1/pedurma/preview", {
          google_page: googleCurrentPage,
          google_page_note: googlePageNote,
          namsel_page: namselCurrentPage,
          namsel_page_note: namselPageNote,
        })
        .then((response) => response.data)
        .then((data) => {
          this.currentPreview = data.content;
        });
    },

    async fetchText() {
      this.$q.loading.show();
      const textId = this.$route.params.textId;
      const googlePechaId = this.$route.query.google;
      const namselPechaId = this.$route.query.namsel;

      //load google-ocr pages
      await this.$axios
        .get(
          process.env.OPENPECHA_API_URL +
            "/api/v1/pedurma/" +
            googlePechaId +
            "/texts/" +
            textId
        )
        .then((response) => response.data)
        .then((data) => {
          this.pages.google = data.pages;
          this.notes.google = data.notes;
        });

      //load Namsel-ocr pages
      await this.$axios
        .get(
          process.env.OPENPECHA_API_URL +
            "/api/v1/pedurma/" +
            namselPechaId +
            "/texts/" +
            textId
        )
        .then((response) => response.data)
        .then((data) => {
          this.pages.namsel = data.pages;
          this.notes.namsel = data.notes;
        });

      this.loading = false;
      this.$q.loading.hide();
    },
  },

  async mounted() {
    // await this.fetchText();
    this.currentPageId = this.pages.namsel[0].id;
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  margin: 1rem;
  justify-content: space-between;
  justify-items: center;
  align-items: flex-start;
}

.image-card {
  width: 25%;
  margin-right: 0.625rem;
}

.edit {
  width: 40%;
  margin-right: 0.625rem;
}

.preview {
  width: 35%;

  &__content {
    padding: 5px;
    border: 1px solid #ccc;
  }
}
</style>