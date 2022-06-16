import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
/**Vue 2.x**/
// import "./plugins/axios";
// createApp(App).use(store).use(router).mount("#app");
/**Vue 3.x**/
// element ui
import ElementUI from "element-plus";
import "element-plus/theme-chalk/index.css";
console.log("main.js");
createApp(App).use(store).use(router).use(ElementUI).mount("#app");
console.log("main.js->createApp");