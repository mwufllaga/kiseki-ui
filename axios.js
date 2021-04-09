/*
 * @Author       : xuesong.li
 * @Date         : 2020-08-12 15:02:21
 * @LastEditors  : xuesong.li
 * @LastEditTime : 2020-08-12 16:37:09
 * @FilePath     : /iot-min/src/utils/request.js
 */
import Vue from "vue";
const bus = new Vue();
import axios from "axios";
import uuidjs from "uuidjs";
import { store } from "./store/store.js";
const service = axios.create(store.state.config.axios.create);

// 请求池定义
class RequestPool {
  constructor(concurrentNum) {
    this.dataStore = [];
    this.concurrentNum = concurrentNum;
  }
  //入列,植入唯一id,植入cancelToken
  _enqueue(config) {
    //写入唯一标识,cancelToken
    config.req_id = uuidjs.generate();
    var CancelToken = axios.CancelToken;
    var source = CancelToken.source();
    config.cancelToken = source.token;
    config.cancelSource = source;
    this.dataStore.push(config);
  }
  //出列,并检验发送下一个请求
  async _dequeue(req_id) {
    for (let index in this.dataStore) {
      if (this.dataStore[index].req_id === req_id) {
        this.dataStore.splice(index, 1);
        break;
      }
    }
    const nextReq = this.dataStore[this.concurrentNum - 1];
    if (nextReq) {
      const res = await service(nextReq);
      bus.$emit(nextReq.req_id, res);
    }
  }
  //判断是否需等待
  _queuewaitSequence(config) {
    return (
      this.dataStore.length <= this.concurrentNum ||
      this.dataStore.indexOf(config) <= this.concurrentNum - 1
    );
  }
  //暴露的发送请求
  async send(config) {
    this._enqueue(config);
    if (this._queuewaitSequence(config)) {
      return await service(config);
    } else {
      return new Promise(function (resolve, reject) {
        bus.$once(config.req_id, function (event) {
          resolve(event);
        });
      });
    }
  }
  //删除并取消某请求
  async cancelRequest(data) {
    let cancelReqIndex = null;
    this.dataStore.some((item, index) => {
      if (item.req_id === data) {
        cancelReqIndex = index;
      }
    });
    if (typeof cancelReqIndex === "number") {
      this.dataStore[cancelReqIndex].cancelSource &&
        (await this.dataStore[cancelReqIndex].cancelSource.cancel());
      this.dataStore.splice(cancelReqIndex, 1);
      return;
    }
    throw new Error("can not match req_id to exist request");
  }
  //获取当前队列中请求
  getRequestList() {
    return JSON.parse(JSON.stringify(this.dataStore));
  }
  //删除并取消所有请求
  cancelPendingRequests() {
    for (let item of this.dataStore) {
      item.cancelSource && item.cancelSource.cancel();
    }
    this.dataStore = [];
  }
}
if (Number(store.state.config.axios.maximumRequst) === "NaN") {
  throw new Error("axios.maximumRequst must be a number");
}
const requestPool = new RequestPool(store.state.config.axios.maximumRequst);
const err = (error) => {
  error.config && requestPool._dequeue(error.config.req_id);
  //植入暴露的钩子函数
  store.state.config.axios.onerror(error);
  store.commit("STOP_ALL_LOADING");
  return Promise.reject(error);
};
// request interceptor
service.interceptors.request.use((config) => {
  config.headers["x-requested-with"] = "XMLHttpRequest";
  //植入暴露的钩子函数
  store.state.config.axios.requestInterceptor(config);
  return config;
}, err);
// response interceptor
service.interceptors.response.use((response) => {
  requestPool._dequeue(response.config.req_id);
  //植入暴露的钩子函数
  store.state.config.axios.responseInterceptor(response);
  return response;
}, err);

export { requestPool };
