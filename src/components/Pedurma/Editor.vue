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
  font-size: 1.5rem;
  line-height: 1.5;
  padding-left: 2rem;
}
</style>