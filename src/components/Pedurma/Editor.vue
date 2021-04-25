<template>
  <div class="full-width">
    <q-input v-model="text" type="textarea" />
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      require: true,
    },
  },
};
</script>