/*
 * @Author       : xuesong.li
 * @Date         : 2020-11-27 11:45:14
 * @LastEditors  : xuesong.li
 * @LastEditTime : 2020-11-27 12:31:06
 * @FilePath     : /hedy/components/myShowList/components/configData.js
 */

//事件类型  可能会改key
import {
    GMTToStr
} from "./utils";


const sourceOption = [{
        idName: 100,
        value: "客服工单"
    },
    {
        idName: 101,
        value: "安全屋"
    }
];

const eventCard = [
    {
        key: "axisWorkOrderId",
        label: "工单号"
        // 无需任何处理只展示对应数据
    },
    {
        label: "创建时间",
        key: "gmtCreate",
        // 我需要对数据做处理
        callback: data => {
            return GMTToStr(data);
        }
    },
    {
        label: "事件来源",
        key: "source",
        // 我需要通过枚举获取数据
        isenumeration: true,
        // 枚举对应的数组
        listOption: sourceOption,
        // 我们默认会对比枚举数组中id，显示对应的name
        // 如果不是默认比对id，显示对应的name
        props: {
            // 需要对比的key
            compareKey: "idName",
            // 需要显示的key
            showKey: "value"
        },
    },
    {
        // 左侧的lable
        label: "关联系统工单",
        // 唯一值，这是你详情数据中的一个key
        key: "axisWorkOrderId",
        // 固定显示(有此值后不显示原值)
        // 如果需要加上原始值 可以增加callback
        fixedMsg: "客服工单",
        // 是否需要加一个按钮
        haveBtn: true,
        // 按钮的value
        btnMsg: "原始数据满足我的需求",
        btnClick: list => {
            // 你想要对数据(详情对象)做的事情
            console.log(list);
        }
    },
    {
        label: "命中规则",
        key: "ruleName",
        btnMsg: "11111",
        // 原始数据无法满足，或者我要在实例里去做事情，那么你可以不定义btnClick，或者任意写一个函数
        btnClick: () => {

        }
    },
    {
        label: "处理对象",
        key: "defendantType",
        isenumeration: true,
        listOption: defendantTypeOption
    },
    {
        label: "所属城市",
        key: "cityName",
        isenumeration: false
    }
]
export {
    eventCard
}