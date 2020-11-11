<template>
  <q-page padding>
    <editor />
  </q-page>
</template>

<script>
export default {
  name: "PageIndex",
  components: {
    editor: require("components/Editor/Editor.vue").default,
  },
};
</script>
