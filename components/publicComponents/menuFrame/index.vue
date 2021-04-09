<template>
  <flex-wrapper flexDirection="row">
    <div :style="{ width: menuWidth, height: '100%' }">
      <el-menu style="height: 100%" ref="menu">
        <slot name="menuTop"></slot>
        <template v-for="item in menu">
          <el-menu-item
            :key="item.label"
            @click="menuClick(item)"
            :class="{
              selected: activeName === (item.index ? item.index : item.label),
            }"
            v-if="!item.children"
            v-show='!item.hidden'
          >
            <i
              v-if="item.icon"
              :class="item.icon ? item.icon : 'el-icon-menu'"
            ></i>
            <span slot="title">{{ item.label }}</span>
          </el-menu-item>
          <el-submenu
            v-else
            :index="item.index ? item.index : item.label"
            :key="item.label"
          >
            <template slot="title">
              <i
                v-if="item.icon"
                :class="item.icon ? item.icon : 'el-icon-menu'"
              ></i>
              <span>{{ item.label }}</span>
            </template>
            <el-menu-item
              v-for="subitem of item.children"
              :key="subitem.label"
              :class="{
                selected:
                  activeName ===
                  (subitem.index ? subitem.index : subitem.label),
              }"
              @click="menuClick(subitem)"
               v-show='!subitem.hidden'
              ><i
                v-if="subitem.icon"
                :class="subitem.icon ? subitem.icon : 'el-icon-menu'"
              ></i>
              <span slot="title">{{ subitem.label }}</span></el-menu-item
            >
          </el-submenu>
        </template>
      </el-menu>
    </div>
    <flex-div>
      <flex-wrapper>
        <div>
          <div style="float: right">
            <slot name="topRight"> </slot>
          </div>
          <div style="">
            <el-tabs
              v-model="activeName"
              type="card"
              @tab-click="tabClick"
              closable
              @edit="tabClose"
              style="padding-left: 10px"
            >
              <el-tab-pane
                v-for="item in tabs"
                :key="item.name"
                :label="item.label"
                :name="item.name"
              ></el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <flex-div :scroll="true">
          <flex-wrapper>
            <keep-alive>
              <component :is="view" ref="comp" :key='activeName' :params="params"></component>
            </keep-alive>
          </flex-wrapper>
        </flex-div>
      </flex-wrapper>
    </flex-div>
  </flex-wrapper>
</template>

<script>
import uuidjs from "uuidjs";
import getView from "./getView.js";
import flexWrapper from "../flexWrapper";
import flexDiv from "../flexDiv";
export default {
  name: "ksk-menu-frame",
  components: { flexWrapper, flexDiv },
  data: function () {
    return {
      keepAliveInstance: null,
      tabs: [], //维护当前打开的tab页属性
      view: null, //当前页组件
      activeName: "",
      defaultPage: "", //TODO set initial page
      pageMap: {}, //维护tab页对应的vue实例
      params: {},
    };
  },
  props: {
    menu: {
      type: Array,
    },
    menuWidth: {
      type: String,
      default: "200px",
    },
  },
  computed: {},
  created: function () {},
  watch: {},
  methods: {
    getMenuInstance() {
      return this.$refs["menu"];
    },
    tabClose(tab) {
      //销毁已缓存实例,必须在对应实例中添加destorySelf方法,并调用this.destroy()
      for (let index in this.tabs) {
        index = Number(index);
        if (this.tabs[index].name === tab) {
          this.activeName = this.tabs[index + 1]
            ? this.tabs[index + 1].name
            : this.tabs[index - 1]
            ? this.tabs[index - 1].name
            : "";
          if (this.activeName) {
            this.view = this.pageMap[this.activeName];
          } else {
            //TODO change into default page,expand default menu
            this.view = null;
          }
          this.tabs.splice(index, 1);
          break;
        }
      }
      this.keepAliveInstance || (this.keepAliveInstance = this.$refs.comp.$vnode.parent.componentInstance)
       //删除keepAlive中缓存
      delete this.keepAliveInstance.cache[tab]
      delete this.pageMap[tab];
      //手动触发对应页面的destory钩子,自动无法触发
      this.$refs.comp.$vnode.parent.componentInstance.cache[
        tab
      ].componentInstance.$destroy();
    },
    //不通过菜单添加新tab页,由此添加的tab页互相独立
    async addPage(page, { label, params }) {
      let currentView = await getView(page);
      this.view = currentView;
      const uuid = uuidjs.generate();
      this.pageMap[page + uuid] = this.view;
      //将tabName传入打开的页面
      this.params = Object.assign(
        {},
        { tabName: page + uuid, tabLabel: label },
        params
      );
      this.tabs.push({ name: page + uuid, label });
      this.activeName = page + uuid;
    },
    //通过菜单添加tab页,每个菜单仅可添加一个tab
    menuClick: async function (menu) {
      let menuIndex = menu.index ? menu.index : menu.label;
      if (!this.pageMap[menuIndex]) {
        let currentView = await getView(menu.url);
        this.view = currentView;
        this.pageMap[menuIndex] = this.view;
        this.tabs.push({ name: menuIndex, label: menu.label });
      } else {
        this.activeName = menuIndex;
        this.view = this.pageMap[menuIndex];
      }
      this.activeName = menuIndex;
    },
    tabClick() {
      let currentView = this.pageMap[this.activeName];
      this.view = currentView;
      //TO DOtraverse menu list ,find activeName menuItem ,check if there is a submenu, open submenu
    },
  },
};
</script>
<style>
.selected {
  background-color: #ecf5ff;
}
</style>
