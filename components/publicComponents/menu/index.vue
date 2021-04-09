<template>
    <div :style="{width:menuWidth,height:'100%'}" >
      <el-menu style="height:100%" ref="menu" :default-active='activeName' :collapse='collapse'>
         <slot name='menuTop'></slot>
        <template v-for="item in menu">
          <el-menu-item
            :key="item.label"
            @click="menuClick(item)"
            v-if="!item.children || allHidden(item)"
            v-show='!item.hidden'
            :index='item.url'
          >
            <i v-if='item.icon' :class="item.icon?item.icon:'el-icon-menu'"></i>
            <span slot="title">{{ item.label }}</span>
          </el-menu-item>
          <el-submenu v-else :index="item.index?item.index:item.label" :key="item.label" @click="menuClick(item)">
            <template slot="title">
              <i v-if='item.icon' :class="item.icon?item.icon:'el-icon-menu'"></i>
              <span>{{ item.label }}</span>
            </template>
            <el-menu-item
            :index='subitem.url'
              v-for="subitem of item.children"
              v-show='!subitem.hidden'
              :key="subitem.label"
              @click="menuClick(subitem)"
              ><i v-if='subitem.icon' :class="subitem.icon?subitem.icon:'el-icon-menu'"></i>
              <span slot="title">{{ subitem.label }}</span></el-menu-item
            >
          </el-submenu>
        </template>
      </el-menu>
    </div>
</template>

<script>
export default {
  name: "ksk-menu",
  data: function() {
    return {
      activeName:''
    };
  },
  props: {
    menu: {
      type: Array,
    },
    menuWidth:{
      type:String,
      default:"200px"
    },
    defaultActive:{
      type:String,
      default:""
    },
    highLightPath:{
      type:String,
      default:""
    },
    collapse:{
      type:Boolean,
      default:false
    }
  },
   created(){
    this.activeName = this.defaultActive

  },
  watch:{
    $route(route){
      this.activeName =this.highLightPath ||  route.path
    }
  },
  methods: {
    allHidden(menu){
      for(let item of menu.children){
        if(!item.hidden){
          return false
        }
      }
      return true
    },
    getMenuInstance(){
       return this.$refs['menu']
    },
    menuClick(item){
      if(!item.url)
       return false
      this.$router.push({
        path:item.url
      })
    }
  },
};
</script>
<style>
.selected {
  background-color: #ecf5ff;
}
</style>
