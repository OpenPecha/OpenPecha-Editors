<template>
  <q-page>
    <div class="row justify-center q-pt-md q-pb-md">
      <add-text v-model="show" />
    </div>
  </q-page>
</template>

<script>
import AddText from "src/components/Modals/AddText";

export default {
  components: {
    AddText,
  },

  data() {
    return {
      show: true,
    };
  },
};
</script>