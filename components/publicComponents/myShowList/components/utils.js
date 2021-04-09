/*
 * @Author       : xuesong.li
 * @Date         : 2020-11-27 11:58:57
 * @LastEditors  : xuesong.li
 * @LastEditTime : 2020-11-27 12:21:22
 * @FilePath     : /hedy/components/myShowList/utils.js
 */
/**
 * 时间格式函数
 * @param {Date} tiem 时间
 * @param {Array | String} lienType 时间连接单位,当值为[]时表示用文字'年 月 日连接'
 * @param {Boolean} isallday  是否是全量时间
 */
export function GMTToStr(time, lienType = "-", isallday = true) {
    const date = new Date(time);
    let Str = "";
    //  判断连接单位
    if (Object.prototype.toString.call(lienType) === "[object Array]") {
        Str =
            date.getFullYear() +
            "年" +
            add0(date.getMonth() + 1) +
            "月" +
            add0(date.getDate()) +
            "日" +
            " ";
    } else {
        Str =
            date.getFullYear() +
            lienType +
            add0(date.getMonth() + 1) +
            lienType +
            add0(date.getDate()) +
            " ";
    }

    if (isallday) {
        Str +=
            add0(date.getHours()) +
            ":" +
            add0(date.getMinutes()) +
            ":" +
            add0(date.getSeconds());
    }
    return Str;
}

/**
 * 时间格式函数
 * @param cname cookie 名称
 */
export function add0(m) {
    return Number(m) < 10 ? "0" + Number(m) : "" + Number(m);
}
