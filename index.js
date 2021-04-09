import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./common.css";
import { store } from "./store/store";
import { Loading } from "element-ui";
import collapse from "./components/animation/ksk-collapse";
import wavesurfer from "./components/publicComponents/wavesurfer/index.vue";
import showlist from "./components/publicComponents/myShowList/index.vue";
import table from "./components/publicComponents/myTable";
import flexWrapper from "./components/publicComponents/flexWrapper";
import flexDiv from "./components/publicComponents/flexDiv";
import pagination from "./components/publicComponents/pagination";
import menuFrame from "./components/publicComponents/menuFrame";
import menu from "./components/publicComponents/menu";
const loadash = require("lodash");
const components = [
  collapse,
  wavesurfer,
  showlist,
  table,
  flexWrapper,
  flexDiv,
  pagination,
  menuFrame,
  menu,
];
class Kiseki {
  install(Vue, options) {
    //安装loadash
    Vue.prototype._ = loadash;
    //安装anxios
    store.commit("SET_CONFIG", options);
    Vue.prototype.$$axios = require("./axios.js").requestPool;
    //路由动画组件混入
    Vue.mixin({
      data() {
        return {
          $$transitionName: "",
        };
      },
      watch: {
        $route: function (to, from) {
          this.$$transitionName =
            (to.params && to.params.transition) || to.meta.transition || "";
        },
      },
    });
    //安装路由拦截器
    if (options.router.instance) {
      options.router.instance.beforeEach(async (to, from, next) => {
        if (store.state.privileges === null && options.feature.getFeaturesUrl) {
          //在有权限url设置且未拉取权限的情况下拉取权限
          await store.dispatch("_setPrivilege");
        }
        //执行权限拦截
        if (to.meta && to.meta.privilege) {
          if (!store.state.privileges[to.meta.privilege]) {
            next(options.router.unauthorizedPage);
          }
        }
        if (options.router.beforeEach) {
          options.router.beforeEach(to, from, next);
        } else {
          next();
        }
      });
    }
    //安装element-ui
    Vue.use(ElementUI);
    //安装自定义组件
    components.forEach((component) => {
      Vue.component(component.name, component);
    });
    //安装loading组件
    Vue.directive("$$loading", {
      inserted: function (el, binding, node) {
        //传入是boolean则直接控制启动
        if (typeof binding.value === "boolean") {
          if (binding.value) {
            let loadingInstance = Loading.service({ target: el });
            store.commit("SET_LOADING_MAP", { el, loadingInstance });
          }
        } else if (
          typeof binding.value === "object" &&
          binding.value !== null
        ) {
          //如果传入是对象则将其设置为option,其中active参数控制启动
          if (binding.value.active === true) {
            let option = Object.assign({}, binding.value);
            let loadingInstance = Loading.service(option);
            store.commit("SET_LOADING_MAP", { el, loadingInstance });
          }
        }
      },
      update(el, binding) {
        if (typeof binding.value === "boolean") {
          if (binding.value) {
            let loadingInstance = Loading.service({ target: el });
            store.commit("SET_LOADING_MAP", { el, loadingInstance });
          } else {
            if (store.state.loading.get(el)) {
              // 以服务的方式调用的 Loading 需要异步关闭
              store.state.loading.get(el).close();
              store.state.loading.delete(el);
            }
          }
        } else if (
          typeof binding.value === "object" &&
          binding.value !== null
        ) {
          if (binding.value.active === true) {
            let option = Object.assign({}, binding.value);
            let loadingInstance = Loading.service(option);
            store.commit("SET_LOADING_MAP", { el, loadingInstance });
          } else {
            if (store.state.loading.get(el)) {
              // 以服务的方式调用的 Loading 需要异步关闭
              store.state.loading.get(el).close();
              store.state.loading.delete(el);
            }
          }
        }
      },
    });
    //安装权限组件,用于元素级权限
    Vue.directive("$$feature", {
      inserted: function (el, binding, node) {
        let featured = true;
        if (
          !store.state.privileges ||
          !store.state.privileges[binding.value.feature]
        ) {
          featured = false;
          el.className += " " + binding.value.class;
        }
        binding.value.callback &&
          binding.value.callback instanceof Function &&
          binding.value.callback(el, binding, featured);
      },
    });
  }
}

export default new Kiseki();
