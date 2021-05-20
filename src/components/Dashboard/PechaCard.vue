<template>
  <div @click="open">
    <img class="pecha-cover" :src="img" />
    <q-menu
      touch-position
      context-menu
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <q-list style="min-width: 100px">
        <q-item clickable v-close-popup @click="update">
          <q-item-section>Update</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="remove">
          <q-item-section class="text-red">Remove</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getOrigin } from "src/utils";

export default {
  props: {
    img: String,
    title: String,
    id: String,
  },

  computed: {
    ...mapGetters("app", ["userAccessToken"]),
  },

  methods: {
    open() {
      this.$router.push("/editor/" + this.id);
    },

    update() {
      console.log("update ", this.id);
    },

    async remove() {
      try {
        const response = await this.$axios.delete(
          getOrigin() + `/api/v1/pechas/${this.id}`,
          {
            headers: {
              token: this.userAccessToken,
            },
          }
        );
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          console.log("Server Error:", err);
        } else if (err.request) {
          // client never received a response, or request never left
          console.log("Network Error:", err);
        } else {
          console.log("Client Error:", err);
        }
      }
      this.$q.notify({
        type: "positive",
        message: "pecha deleted",
        position: "bottom-right",
      });
      this.$emit("remove-pecha", this.id);
    },
  },
};
</script>

<style scoped>
.pecha-cover {
  height: 100%;
  width: 100%;
}
</style>