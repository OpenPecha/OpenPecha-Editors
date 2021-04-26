<template>
  <q-input
    outlined
    :value="text"
    @input="updateValue"
    type="textarea"
    :input-style="{ height: '700px' }"
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