<template>
  <ArticleSkeleton>
    <template #title>
      <h1>{{ modelName }}</h1>
    </template>
    <template #model>
      <h2>此处为架构</h2>
    </template>
    <template #description>
      <h2>此处为描述</h2>
    </template>
    <template #footer>
      <h2>此处为末尾</h2>
    </template>
  </ArticleSkeleton>
</template>

<script>
import ArticleSkeleton from "@/components/Article";
export default {
  name: "HCFlow",
  data() {
    return {
      modelName: "HCFlow",
    };
  },
  components: { ArticleSkeleton },

};
</script>

<style scoped></style>
