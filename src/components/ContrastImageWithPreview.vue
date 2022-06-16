<template>
  <div class="PictureComparison"
       :style="'width:' + width + 'px;height:' + height + 'px'">
    <div class="drag-outer"
         ref="dragWrap"
         :style="outerOptions"
         @mouseenter="isHover = true"
         @mouseleave="isHover = false">
      <div class="drag-inner"
           ref="dragElement"
           :style="innerOptions"
           @mousedown.stop="dragMousedown">
        <div class="before-image" :style="'width:' + x + 'px'">
          <div ref="before" :style="'width:' + width + 'px;height:' + height + 'px'">
            <slot name="left"></slot>
          </div>
        </div>

        <div class="after-image">
          <div ref="after" :style="'width:' + width + 'px;height:' + height + 'px'">
            <slot name="right"></slot>
          </div>
        </div>

        <div
            class="divider-bar"
            :style="'left:' + x + 'px'"
            @mousedown.stop="onmouseDownOnBar"
        ></div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'ContrastImageWithPreview',
  props: {
    width: { type: String, default: "500" },
    height: { type: String, default: "300" },
    outerOptions: {
      type: Object,
      default () {
        return {
          background: 'rgba(0,0,0,0.9)'
        }
      }
    },
    innerOptions: {
      type: Object,
      default () {
        return {
          background: 'rgba(0,0,0,0.1)',
        }
      }
    },
    scaleZoom: {
      type: Object,
      default () {
        return {
          max: 5,
          min: 0.2
        }
      }
    }
  },
  data(){
    return {
      moveX: 0, //鼠标移动的位置
      x: this.width / 2, //设置位置

      isHover: false,
      moveStart: {},
      translate: {x: 0, y: 0},
      scale: 1
    }
  },
  methods: {
    onmouseDownOnBar(e){
      console.log("onmouseDownOnBar")
      this.x = event.target.offsetLeft
      var disX = event.clientX - event.target.offsetLeft
      let that = this
      document.onmousemove = function (event) {
        that.x = event.clientX - disX
        if (that.x >= that.width) {
          that.x = that.width
        } else if (that.x <= 0) {
          that.x = 0
        }
      }
      document.onmouseup = function () {
        console.log("onmouseup")
        document.onmousemove = document.onmouseup = null;
        return false;
      };
    },

    handleScroll(e) {
      if(this.isHover) {
        let speed = e.wheelDelta/120
        if(e.wheelDelta > 0 && this.scale < this.scaleZoom.max) {
          this.scale+=0.04*speed
        }else if(e.wheelDelta < 0 && this.scale > this.scaleZoom.min){
          this.scale+=0.04*speed
        }
        this.$refs.before.style.transform = `scale(${this.scale}) translate(${this.translate.x}px, ${this.translate.y}px)`
        this.$refs.after.style.transform = `scale(${this.scale}) translate(${this.translate.x}px, ${this.translate.y}px)`
      }
    },

    dragMousedown() {
      this.moveStart.x = event.clientX
      this.moveStart.y = event.clientY
      let that = this
      document.onmousemove = function (event) {
        event.preventDefault()
        event.stopPropagation()
        that.translate.x += (event.clientX - that.moveStart.x) / that.scale
        that.translate.y += (event.clientY - that.moveStart.y) / that.scale
        that.$refs.before.style.transform = `scale(${that.scale}) translate(${that.translate.x}px, ${that.translate.y}px)`
        that.$refs.after.style.transform = `scale(${that.scale}) translate(${that.translate.x}px, ${that.translate.y}px)`
        that.moveStart.x = event.clientX
        that.moveStart.y = event.clientY
      }
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null;
        return false;
      }
    },
  },
  mounted() {
    window.addEventListener('mousewheel',this.handleScroll,false)
  }
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
<style lang="scss" scoped>
.drag-outer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  .drag-inner {
    transform-origin: center center;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: move;
    user-select: none;
    >* {
      -webkit-user-drag: none;
      user-drag: none;
    }
  }
}
</style>