<!--
 * @Author       : xuesong.li
 * @Date         : 2020-11-27 11:45:18
 * @LastEditors  : xuesong.li
 * @LastEditTime : 2020-11-27 12:25:23
 * @FilePath     : /hedy/components/myShowList/components/demo.vue
-->
<template>
  <div class="deal-workdetails-container">
    <my-showlist :propsData="eventCard"  :detailisObj="mokeItem" ></my-showlist>
  </div>
</template>

<script>
import myShowlist from "../index";
import { eventCard } from "./configData";
export default {
  components: {
    myShowlist
  },
  data() {
    return {
      eventCard,
      mokeItem: {
        axisWorkOrderId: "111111",
        status: 1,
        eventScene: 1001,
        gmtCreate: 1606204213093,
        distributeTime: 1606204213093,
        assigneeName: "老王",
        remark: "哈哈",
        gmtModify: 1606204213093,
        source: 101,
        offendRuleList: 1,
        defendantType: 301,
        cityName: "杭州",
        ruleName: "固定值"
      }
    };
  },
  mounted() {
    //  原始回调无法满足我的需求
    //  callback同理
    this.eventCard[4].btnClick = this.testBtnClick;
  },
  methods: {
    // 实例中的函数
    testBtnClick(item) {
      console.log(item, 666);
    }
  }
};
</script>

<style lang="scss" scoped>
.deal-workdetails-container {
  padding: 10;
}
</style>
