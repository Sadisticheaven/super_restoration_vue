<template>
  <div class="PictureComparison"
      :style="'width:' + width + 'px;height:' + height + 'px'"
  >
    <div class="before-image" :style="'width:' + x + 'px'">
      <div :style="'width:' + width + 'px;height:' + height + 'px'">
        <slot name="left"></slot>
      </div>
    </div>
    <div class="after-image">
      <div :style="'width:' + width + 'px;height:' + height + 'px'">
        <slot name="right"></slot>
      </div>
    </div>
    <div
        class="divider-bar"
        :style="'left:' + x + 'px'"
        @mousedown.prevent="onmouseDown()"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    width: { type: String, default: "500" },
    height: { type: String, default: "300" },
  },
  data(){
    return {
      isDown: false, //鼠标是否正按住
      moveX: 0, //鼠标移动的位置
      x: this.width / 2, //设置位置
    }
  },
  methods: {
    onmouseDown(){
      this.isDown = true
      this.x = event.target.offsetLeft
      var disX = event.clientX - event.target.offsetLeft
      let that = this
      document.onmousemove = function (event) {
        if (that.isDown == false) return
        that.x = event.clientX - disX
        if (that.x >= that.width) {
          that.x = that.width
        } else if (that.x <= 0) {
          that.x = 0
        }
      }
      document.onmouseup = function () {
        that.isDown = false;
        document.onmousemove = document.onmouseup = null;
        return false;
      };
    },
    //
    // goLeft(){
    //   this.x = 0
    // },
    //
    // goRight(){
    //   this.x = this.width
    // }
  },
};
</script>

<style lang="less" scoped>
.PictureComparison {
  position: relative;
  display: inline-block;
  margin: 0 auto;
  min-height: 273px;
  margin-bottom: 40px;
  overflow: hidden;

  .before-image {
    position: absolute; top: 0; left: 0;
    z-index: 1; width: 50%;
    overflow: hidden;
  }

  .after-image {
    position: absolute; top: 0; left: 0;
    z-index: 0;
  }

  .divider-bar {
    cursor: move;
    width: 1px; height: 100%;
    position: absolute;  left: 50%; top: 0px;
    display: block; z-index: 2;
    background: white;
    box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.4);
    &::after {
      font-family: 华文楷体; font-size: 5px;
      content: "前|后";
      position: absolute;
      top: 50%; left: 50%;
      color: #e75c96;
      text-align: center;
      line-height: 18px;
      width: 40px; height: 20px;
      background: #fff;
      border-radius: 10px;
      transform: translate(-50%, -50%);
    }
  }
}
</style>