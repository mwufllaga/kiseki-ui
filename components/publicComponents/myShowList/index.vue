<!--
 * @Author       : xuesong.li
 * @Date         : 2020-11-27 11:45:02
 * @LastEditors  : xuesong.li
 * @LastEditTime : 2020-11-30 15:56:24
 * @FilePath     : /hedy/components/myShowList/index.vue
-->
<template>
  <div class="my-showlist-container">
    <el-row>
      <el-col
        :span="colSpan"
        class="label-warp"
        v-for="item in cardData"
        :key="item.keyWord"
      >
        <div class="label-content">{{ item.label }}:</div>
        <div class="message-content">
          <el-tooltip
            class="tooltip-item"
            effect="dark"
            :content="
              item.callback ? item.callback(item.message) : item.message
            "
            placement="left"
          >
            <span>
              {{ item.callback ? item.callback(item.message) : item.message }}
              <span v-if="item.haveBtn">
                <el-button
                  style="padding: 0"
                  type="text"
                  @click="item.btnClick(item)"
                  >{{ item.btnMsg }}</el-button
                >
              </span>
            </span>
          </el-tooltip>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "ksk-show-list",
  props: {
    // 24为一排, 例如传入 6 ->  四组数据一排
    colSpan: {
      type: Number,
      default: () => {
        return 6;
      },
    },
    // 构建的数组
    propsData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 详情对象数据
    detailisObj: {
      type: Object,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  mounted() {
    // 拼接数据
    if (this.propsData.length > 1 && Object.keys(this.detailisObj).length > 1) {
      this.cardData = this.getCardConfig(this.propsData, this.detailisObj);
    }
  },
  methods: {
    /**
     * 格式化显示数据
     * @param {Array} data 需要遍历的数组
     * @param {Object} itmeObj 详情对象
     */
    getCardConfig(data = [], itmeObj = {}) {
      let dataList = data.map((el) => {
        const detailisObj = itmeObj;
        return {
          label: el.label,
          keyWord: el.key,
          message: el.fixedMsg || detailisObj[el.key],
          callback: (d) => {
            if (el.callback) {
              return el.callback(d);
            } else if (el.isenumeration) {
              const listOption = el.listOption || [];
              let dataMsg = "";
              const compareKey =
                el.props &&
                Object.prototype.hasOwnProperty.call(el.props, "compareKey")
                  ? el.props.compareKey
                  : "id";
              const showKey =
                el.props &&
                Object.prototype.hasOwnProperty.call(el.props, "showKey")
                  ? el.props.showKey
                  : "name";
              for (let i = 0; i < listOption.length; i++) {
                if (listOption[i][compareKey] === detailisObj[el.key]) {
                  dataMsg = listOption[i][showKey];
                  break;
                }
              }
              return dataMsg;
            } else {
              return d;
            }
          },
          haveBtn: Boolean(el.haveBtn),
          btnMsg: el.btnMsg,
          btnClick: () => {
            return el.btnClick(detailisObj);
          },
        };
      });
      return dataList;
    },
  },
};
</script>

<style lang="scss">
.mapcard-container {
  .label-warp {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-bottom: 20px;

    .label-content {
      min-width: 100px;
    }
    .message-content {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;

      .tooltip-item {
        cursor: pointer;
      }
    }
  }
}
</style>
