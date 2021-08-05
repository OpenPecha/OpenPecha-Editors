<template>
  <q-input
    outlined
    :value="text"
    @input="updateValue"
    type="textarea"
    :input-style="{ height: '85vh' }"
  />
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      require: true,
    },
  },

  methods: {
    updateValue(value) {
      this.$emit("input", value);
    },
  },
};
</script>

<style>
.q-textarea .q-field__native {
  padding: 5px 0px;
  font-size: 1.3rem;
  line-height: 1.3;
}
</style>