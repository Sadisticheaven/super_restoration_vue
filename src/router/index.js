import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import {getModelList} from "@/utils/http";
import store from "@/store";
console.log("index.js");
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
  },
  {
    path: "/model_list",
    name: "modelList",
    component: () => import("../views/ModelsView"),
    children: [
    ],
  },
  {
    path: "/img_restore",
    name: "imageRestore",
    component: () => import("../views/RestoreView"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginView"),
  }
];


console.log("createRouter");
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  modelListIdx: 2,
});

router.beforeEach(async (to, from, next)=>{
  if(store && store.state.dynamicRoutes.length === 0){
    let res = await getModelList();
    let models = res.data;

    let parentRoute = routes[2]; // /model_list
    console.log("getModelList:", models);
    models.forEach(v => {
      const newRoute = {
        path: parentRoute.path + '/' + v.modelName,
        name: v.modelName,
        component: () => import('../views/modelDesc/' + v.modelName)
      };
      if(!parentRoute.children.some(item=> item.name == newRoute.name))
        parentRoute.children.push(newRoute);
      // router.addRoute(parentRoute.name, newRoute);
    });

    parentRoute.redirect = parentRoute.children[0].path;
    router.addRoute(parentRoute);
    console.log("routes:", routes);
    await store.dispatch('SETROUTES', parentRoute.children); // 缓存数据
    await store.dispatch('SETMODELS', models); // 缓存数据
    next({...to});
  }else{
    next(); // 放行
  }
});
export default router;


