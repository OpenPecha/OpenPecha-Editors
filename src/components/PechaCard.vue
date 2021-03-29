<template>
  <q-card>
    <q-img :src="img">
      <div class="absolute-bottom">
        <div>{{ title }}</div>
      </div>
    </q-img>
  </q-card>
</template>

<script>
export default {
  props: {
    img: String,
    title: String,
    id: String,
  },
};
</script>