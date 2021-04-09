<template>
  <ksk-flexWrapper
    style="padding:8px 48px;height:auto"
    justifyContent="space-between"
    alignItems="center"
    flexDirection="row"
  >
    <span
      >共{{ Math.ceil(pageData.total / pageData.pageSize) }}页&nbsp;&nbsp;第{{
        pageData.currentPage
      }}页</span
    >
    <el-pagination
      background
      :current-page.sync="pageData.currentPage"
      :pager-count="pagerCount"
      layout="prev, pager, next, jumper"
      :total="pageData.total"
      @current-change="currentChange"
      :pageSize="pageData.pageSize"
    >
    </el-pagination>
  </ksk-flexWrapper>
</template>

<script>
export default {
  name: "ksk-pagination",
  props: {
    pageData: {
      type: Object,
    },
    currentChange: {
      type: Function,
    },
    "pager-count": {
      type: Number,
      default: 5,
    },
  },
  data: function() {
    return {};
  },
  computed: {},
  created: function() {},
  mounted() {},
  watch: {},
  methods: {},
};
</script>
