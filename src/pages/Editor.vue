<template>
  <q-page padding class="no-scroll">
    <editor
      v-if="pageReady"
      :content="text"
      :org="org"
      :pechaId="pechaId"
      :reviewBranch="reviewBranch"
      :userAccessToken="userAccessToken"
    />
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import Editor from "components/Editor/Editor";
import { getOrigin } from "src/utils";

export default {
  components: {
    Editor,
  },

  data() {
    return {
      text: "",
      // "<p><span class='book-title' id='b'>༄། །འབྲི་གུང་ཚོགས་ཆོས་ཆེན་མོ།</span></p>" +
      // "<p><span class='author' id='a'>༼ཚོགས་ཆོས་ཀྱི་རིམ་པ་ལེགས་པར་བཤད་པ་ཡིད་བཞིན་ནོར་བུ་ཞེས་བྱ་བ་བཞུགས་སོ།།༽</span></p>" +
      // "<p>ཚོགས་གཉིས་མཐར་ཕྱིན་མཚན་དང་དཔེ་བྱད་རིན་ཆེན་རི་བོ་ལྟར་མཛེས་སྐུ་ཡི་དཀྱིལ་འཁོར་བསམ་གྱིས་མི་ཁྱབ་མཁའ་མཉམ་སེམས་ཅན་ཁམས་དང་མཉམ་པར་འཇུག །ཆོས་རྣམས་གདོད་ནས་མ་སྐྱེས་སྟོང་པར་སྟོན་པའི་གསུང་གི་དཀྱིལ་འཁོར་བསམ་གྱིས་མི་ཁྱབ་ཐེ་ཚོམ་གཅོད་ཅིང་སེམས་ཅན་རྣམས་ཀྱི་སྐད་དང་མཐུན་པར་འཇུག །དུས་གསུམ་འགྱུར་མེད་འོད་གསལ་སྒྲིབ་གསུམ་རབ་སྤངས་རྣམ་དག་ཐུགས་ཀྱི་དཀྱིལ་འཁོར་བསམ་གྱིས་མི་ཁྱབ་ཡེ་ཤེས་དུས་རྣམས་ཀུན་ལ་ཆགས་ཐོགས་མེད་པར་འཇུག །ཡོན་ཏན་རྒྱ་མཚོ་སྐུ་གསུང་ཐུགས་དང་མཛད་པ་འཕྲིན་ལས་ལྷུན་གྲུབ་བསམ་གྱིས་མི་ཁྱབ་བློ་ལས་རྣམ་འདས་འགྲོ་བའི་དཔལ་གྱུར་ཆོས་ཀྱི་རྗེ་ལ་འདུད། །</P>",
      org: "OpenPecha",
      reviewBranch: "review",
      currentVol: "v001",
      pageReady: false,
    };
  },
  computed: {
    ...mapGetters("app", ["userAccessToken"]),

    pechaId() {
      return this.$route.params.pechaId;
    },
  },

  async created() {
    const res = await this.$axios.get(
      getOrigin() + `/api/v1/pechas/${this.pechaId}/${this.currentVol}/editor`,
      {
        headers: {
          token: this.userAccessToken,
        },
      }
    );
    this.text = res.data.content;
    this.pageReady = true;
    console.log(this.text);
  },
};
</script>