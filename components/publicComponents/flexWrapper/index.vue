<template>
  <!-- class="agileFlex verticalFlexWrapper" -->
  <div
    v-if="!innerSpace"
    :style="{
      height,
      width,
      display: 'flex',
      'flex-direction': flexDirection,
      'justify-content': justifyContent,
    }"
  >
    <slot></slot>
  </div>
  <div
    v-else
    :style="{
      height,
      width,
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': justifyContent,
    }"
  >
    <div :style="spacedStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "ksk-flexWrapper",
  props: {
    innerSpace: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
    },
    flexDirection: {
      type: String,
      default: "column",
    },
    justifyContent: {
      type: String,
      default: "flex-start",
    },
    alignItems: {
      type: String,
      default: "stretch",
    },
    extraStyle: {
      type: Object,
    },
  },
  computed: {
    spacedStyle: function () {
      return {
        flex: "1 1 0px",
        "flex-direction": this.flexDirection,
        display: "flex",
        "justify-content": this.justifyContent,
        "align-items": this.alignItems,
        padding: this.innerSpace,
      };
    },
  },
  watch: {
    extraStyle: {
      handler: function (n, o) {
        this.spacedStyle = Object.assign(spacedStyle, n);
      },
      deep: true,
    },
  },
};
</script>
