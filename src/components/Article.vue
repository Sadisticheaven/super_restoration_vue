<template>
  <div class="title">
    <slot name="title"></slot>
  </div>

  <div class="main">
    <div class="model">
      <slot name="model"></slot>

    </div>
    <div class="description">
      <slot name="description"></slot>
    </div>
  </div>

  <div class="footer">
    <slot name="footer"></slot>
  </div>
</template>

<script>
export default {
  name: "ArticleSkeleton"
}
</script>

<style scoped>

</style>