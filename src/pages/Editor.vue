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