<template>
  <div>
    <el-container>
      <el-aside>
        <el-menu router>
          <el-sub-menu index="SR">
            <template v-slot:title><h1>超分辨率</h1></template>
            <el-menu-item v-for="(item, index) in modelRoutes" :key="index" :index="item.path"
            :class="$route.path === item.path? 'is-active' : ''">
                <template v-slot:title>{{ index+1 }}、{{ item.name }}</template>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import router from "@/router";
import store from "@/store";
import {mapGetters} from 'vuex';
export default {
  name: "ModelList",
  data() {
    return {
      // modelRoutes: router.options.routes[router.options.modelListIdx],
    };
  },
  created() {
    console.log("modelview:", router.options.routes);
  },
  computed: {
    modelRoutes(){
      return store.state.dynamicRoutes
    },
    // ...mapGetters(['dynamicRoutesData']),
  },
  methods: {
  },
};
</script>
<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
