import "./index.scss";
export default {
  name: "myTable",
  data() {
    return {};
  },
  props: {
    // 操作按钮
    actionList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 列表数据
    tableData: {
      // 表格内容数据
      type: Array,
      require: true
    },
    // 表头数据
    header: {
      type: Array,
      require: true
    },
    // 表格类型
    tableType: {
      type: String,
      default: () => {
        return "index";
      }
    },
    // 表格类型
    tableBorder: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    // 是否显示默认的第一列
    showFirstCol: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  render(h) {
    // table渲染
    let self = this;
    return h(
      "el-table",
      {
        ref: "table",
        props: {
          data: this.tableData,
          "header-cell-style": { background: "#F9FBFF" },
          border: this.tableBorder
        },
        on: {
          // table的事件
          "selection-change": function(val) {
            self.handleSelectionChange(val);
          }
        },
        style: {
          width: "100%"
        }
      },
      [
        this.showFirstCol
          ? h("el-table-column", {
              // 左侧多选，根据需求增加
              props: {
                type: self.tableType,
                width: "55",
                align: "center",
                fixed: "left"
              }
            })
          : null,
        this.header.map(item => {
          return h("el-table-column", {
            props: {
              width: item.width,
              label: item.label,
              prop: item.prop,
              fixed: item.fixed || false,
              type: item.type || "",
              align: item.align || "center"
            },
            style: {
              background: "#F9FBFF",
              fontSize: item.fontSize || "20px",
              color: "#fff"
            },
            scopedSlots: {
              default: scope => {
                if (item.slotName) {
                  return h("div", {}, [
                    this.$scopedSlots[item.slotName]({ scope })
                  ]);
                }
                if (item.isRight) {
                  return this.actionList.map(el => {
                    return h(
                      "el-button",
                      {
                        props: {
                          type: el.props.type,
                          size: el.props.size,
                          disabled: el.disabled
                        },
                        on: {
                          click: function() {
                            self.$emit(el.emit, scope.row);
                          }
                        }
                      },
                      el.label
                    );
                  });
                } else {
                  return h(
                    "span",
                    {
                      props: {}
                    },
                    item.callback
                      ? item.callback(
                          item.fullData ? scope.row : scope.row[item.prop]
                        )
                      : scope.row[item.prop] || ""
                  );
                }
              }
            }
          });
        })
      ]
    );
  },
  methods: {
    /**
     *
     * @param {Array} val 对外传出的数组
     * @description 复选框选择后对外暴露事件
     */
    handleSelectionChange(val) {
      this.$emit("SelectionChange", val); // 可以根据需求自定义事件  ，引入的vue的界面处理
    },
    /**
     *
     * @param {Boolean} radio
     * @param {Boolean} isAllClear true 清空所有选择项
     * @description 提供父组件直接改变select选项
     */
    checkedFn(radio, isAllClear = false) {
      let _this = this;
      // 清空所有选择项目
      if (isAllClear) {
        _this.$refs.table.clearSelection();
        return;
      }
      if (this.tableData && this.tableData.length > 0) {
        this.tableData.forEach(element => {
          if (radio && element) {
            _this.$refs.table.toggleRowSelection(element, true);
          } else {
            _this.$refs.table.toggleRowSelection(element, false);
          }
        });
      }
    }
  }
};
