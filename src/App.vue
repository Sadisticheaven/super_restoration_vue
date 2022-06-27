<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/model_list">Models</router-link> |
    <router-link to="/img_restore">Restore</router-link>
  </nav>

  <router-view v-slot="{ Component }">
    <keep-alive include="RestoreView">
      <component :is="Component" :key="$route.name"/>
    </keep-alive>
  </router-view>
<!--  <transition name="slide-left" mode="out-in">-->

<!--  </transition>-->

</template>

<script>
import modelList from "@/utils/modelList";
console.log("App.vue->export");

export default {
  data() {
    return {
    };
  },
  methods: {
  },
  created() {
    console.log("App.vue->created");
  },
  watch:{
    $route(to, from){
      if(from.name === 'imageRestore'){

        console.log(from)
        console.log(to)
      }
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  background-attachment: scroll, scroll, fixed;
  background-color: rgba(138,188,159,0.5);
  background-image: url(http://www.csszengarden.com/214/contours-opaque.png),
                    url(http://www.csszengarden.com/214/gridlines-opaque.png),
                    url(http://www.csszengarden.com/214/bamboo.png);
  background-repeat: repeat, repeat, no-repeat;
  background-size: auto, auto, cover;
  position: fixed;
  height: 100%;
  width: 100%;
}

nav {
  padding-block: 10px;

  background-image: url(http://www.csszengarden.com/214/contours@2x.png),
                    url(http://www.csszengarden.com/214/gridlines.png),
                    url(http://www.csszengarden.com/214/noise.png),
                    url(http://www.csszengarden.com/214/koi.jpg);
  background-size: 50% auto, auto, auto, cover;

  a {
    font-weight: bold;
    color: #2c3e50;
    display: inline-block;
    margin-left: 15px;
    margin-right: 15px;
    text-decoration: none;
    &.router-link-exact-active {
      color: #ffffff;
    }
  }
}

.slide-left-enter {
  opacity: 0;
  -webkit-transform: translate(0px, 30px);
  transform: translate(0px, 30px);
}
.slide-left-enter-active{
  transition: all .5s ease;
}
.slide-left-leave-to{
  opacity: 0;
  -webkit-transform: translate(0px, -30px);
  transform: translate(0px, -30px);
}
.slide-left-leave-active {
  transition: all .5s ease;
}


</style>
