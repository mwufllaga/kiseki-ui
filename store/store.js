import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);
const options = {
  state: {
    privileges: null,
    loading: new Map(),
    config: {},
  },
  mutations: {
    SET_CONFIG(state, config) {
      state.config = config;
    },
    SET_USER_PRIVILEGE(state, privilege) {
      state.privileges = privilege;
    },
    SET_LOADING_MAP(state, { el, loadingInstance }) {
      if (!state.loading.has(el)) state.loading.set(el, loadingInstance);
      else {
        state.loading.get(el).close();
        state.loading.set(el, loadingInstance);
      }
    },
    STOP_ALL_LOADING(state) {
      state.loading.forEach(function (value, key) {
        Vue.nextTick(() => {
          value.close();
        });
      });
    },
  },
  actions: {
    async _setPrivilege({ commit, state }) {
      const requestPool = require("../axios.js").requestPool;
      const res = await requestPool.send({
        method: "POST",
        url: state.config.feature.getFeaturesUrl,
      });
      commit("SET_USER_PRIVILEGE", res.data.data);
    },
  },
};
const store = new Vuex.Store(options);
export { store };
