<template>
  <!-- class="agileFlex verticalFlexWrapper" -->
  <div
    :style="{
      flex: `${flexGrow} ${flexShrink} ${flexBasis}`,
      overflow: scroll ? 'auto' : 'hidden',
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ksk-flexDiv",
  props: {
    flexGrow: {
      type: String,
      default: "1",
    },
    flexShrink: {
      type: String,
      default: "1",
    },
    flexBasis: {
      type: String,
      default: "200px",
    },
    scroll: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
