<template>
  <span v-if="entityLabel" class="cursor-pointer">
    <span class="labeled-entity">
      {{ content }}
    </span>
    <q-menu v-model="showMenu">
      <q-list dense>
        <q-item v-for="(label, i) in labels" :key="i" clickable v-close-popup>
          <q-item-section>
            <q-item-label v-text="label.text" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </span>
  <span v-else :class="[newline ? 'newline' : '']">{{ content }}</span>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: "",
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#64FFDA",
    },
    labels: {
      type: Array,
      default: () => [],
      required: true,
    },
    newline: {
      type: Boolean,
    },
  },
  data() {
    return {
      showMenu: false,
    };
  },
  computed: {
    textColor() {
      return idealColor(this.color);
    },
  },
  methods: {
    update(label) {
      this.$emit("update", label);
      this.showMenu = false;
    },
    remove() {
      this.$emit("remove");
    },

    idealColor(hexString) {
      // W3c offers a formula for calculating ideal color:
      // https://www.w3.org/TR/AERT/#color-contrast
      const r = parseInt(hexString.substr(1, 2), 16);
      const g = parseInt(hexString.substr(3, 2), 16);
      const b = parseInt(hexString.substr(5, 2), 16);
      return (r * 299 + g * 587 + b * 114) / 1000 < 128 ? "#ffffff" : "#000000";
    },
  },
};
</script>

<style scoped>
.highlight.blue {
  background: #edf4fa !important;
}
.highlight.bottom {
  display: block;
  white-space: normal;
}
.highlight:first-child {
  margin-left: 0;
}
.highlight {
  border: 2px solid;
  margin: 4px 6px 4px 3px;
  vertical-align: middle;
  box-shadow: 2px 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  cursor: default;
  min-width: 26px;
  line-height: 22px;
  display: flex;
}
.highlight .delete {
  top: -15px;
  left: -13px;
  position: absolute;
  display: none;
}
.highlight:hover .delete {
  display: block;
}
.highlight__content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 2px 2px 0px 6px;
}
.highlight.bottom .highlight__content:after {
  content: " ";
  padding-right: 3px;
}
.highlight__label {
  line-height: 14px;
  padding-top: 1px;
  align-items: center;
  justify-content: center;
  display: flex;
  padding: 0 8px;
  text-align: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: white;
}
.highlight__label::after {
  content: attr(data-label);
  display: block;
  font-size: 14px;
  -webkit-font-smoothing: subpixel-antialiased;
  letter-spacing: 0.1em;
}
.newline {
  width: 100%;
}
</style>
