<template>
<div id="wrapper">
  <el-container>
    <el-aside>
      <keep-alive>
        <UploadImage ref="uploadImgRef" v-loading="loading"></UploadImage>
      </keep-alive>
      <el-select v-model="modelName" class="modelNameSelect" @change="modelChange"
                 placeholder="请选择算法" filterable size="large">
        <el-option
            v-for="(value, key) in modelsInfo"
            :key="key"
            :label="key"
            :value="key"
        />
      </el-select>
      <el-select v-model="modelScale" class="modelScaleSelect"
                 clearable @clear="modelScale = ''"
                 placeholder="请选择倍率" size="default">
        <el-option
            v-for="(value, key) in modelsInfo[modelName]"
            :key="key"
            :label="key"
            :value="key"
        />
      </el-select>
      <el-button @click="uploadImg">一键高清</el-button>


    </el-aside>
    <el-main class="chooseModel" height="50px" width="100%">
      <div>
        <ContrastImageWithPreview width="800" height="600">
            <template #left>
              <el-image :src="leftUrl" class="images" id="leftImg" ref="leftRef" @load="imageLoadSuccess">
                <template #error>
                  <div class="image-slot">
                    <Picture></Picture>
                  </div>
                </template>
              </el-image>
            </template>
            <template #right>
              <el-image :src="rightUrl" class="images" id="rightImg" ref="rightRef" @load="imageLoadSuccess">
                <template #error>
                  <div class="image-slot">
                    <Picture></Picture>
                  </div>
                </template>
              </el-image>
            </template>
        </ContrastImageWithPreview>
<!--        <el-button @click="test"></el-button>-->
      </div>
      <div class="imageInfo" style="margin-bottom: 50px;">
        <el-descriptions title="图片信息" :column="2" border>
          <el-descriptions-item label="算法">
            <el-tag size="small" v-text="this.modelName!=''?this.modelName:'无'"></el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="处理前尺寸">
            <el-tag size="small" v-text="this.leftImgInfo.hasOwnProperty('width')
                                ?this.leftImgInfo.width+'x'+this.leftImgInfo.height:'无'"></el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="放大倍率">
            <el-tag size="small" v-text="this.modelScale!=''?'x'+this.modelScale:'无'"></el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="处理后尺寸">
            <el-tag size="small" v-text="this.rightImgInfo.hasOwnProperty('width')
                                ?this.rightImgInfo.width+'x'+this.rightImgInfo.height:'无'"></el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-main>
  </el-container>
</div>
</template>

<script>
import axios from "@/utils/request.js"
import UploadImage from '@/components/UploadImage.vue';
import ContrastImage from '@/components/ContrastImage.vue';
import ContrastImageWithPreview from '@/components/ContrastImageWithPreview.vue';
import PreviewImage from '@/components/PreviewImage.vue';
import store from "@/store";
import {restoreImg, getImgFromBackend} from "@/utils/http";
import { Picture  } from '@element-plus/icons-vue'
import mitt from 'mitt'
const emitter = mitt()
export default {
  name: "RestoreView",
  data(){
    return {
      loading: false,
      baseUrl: axios.defaults.baseURL + 'result/',
      modelName: '',
      modelScale: '',
      res: {},
      bicubic: '',
      sr: '',
      leftUrl: '', // 用于img标签显示图片
      rightUrl: '',
      leftImgInfo: {},
      rightImgInfo: {},
    }
  },
  components:{
    UploadImage, Picture, ContrastImageWithPreview,// PreviewImage
  },
  computed: {
    modelsInfo(){
      let rawData = store.state.modelList
      let modelDict = {}
      rawData.forEach((item, index) =>{
        modelDict[item.modelName] = {}
      })
      rawData.forEach((item, index) =>{
        modelDict[item.modelName][item.modelScale+""] = item.modelId
      })
      console.log(modelDict)
      return modelDict
    },
  },
  watch:{
    res:{
      deep: true,
      handler(newValue, oldValue){
        if(newValue.code == 200){
          this.bicubic = newValue.originUrl
          this.sr = newValue.resultUrl
          this.$message.success('正在处理，喝口水吧~')
          this.loading = true
        }else{
          this.bicubic = ''
          this.sr = ''
          this.$message.error('网络出错，请重试！')
          this.loading = false
        }
      },
    },
    bicubic(newValue, oldValue){
      if(newValue != "") this.isImgOk(newValue, 'leftUrl')
    },
    sr(newValue, oldValue){
      if(newValue != "") this.isImgOk(newValue, 'rightUrl')
    },
    leftUrl(newValue, oldValue){
      // console.log("watch: "+newValue)
      // console.log("watch: "+this.srUrl)
      if(newValue != "" && this.rightUrl!="") {
        console.log("loading off")
        this.loading = false
      }
    }
  },
  methods: {
    modelChange(){
      this.modelScale = ''
      console.log(this.modelScale == "")
    },

    checkLoginStatus(){
      let userId = store.state.userInfo.userId
      if(userId == null || userId < 0) {
        this.$router.push('/login')
        this.$message.warning('请先登录~')
        return false
      }
      return true
    },

    async uploadImg(){
      if(this.$refs.uploadImgRef.imgUrl == ''){
        this.$message.warning('请先上传图片~')
        return
      }
      if(this.modelName == '' || this.modelScale == ''){
        this.$message.warning('请先选择算法和倍率~')
        return
      }
      if(this.checkLoginStatus()){
        // 发送请求
        this.$refs.uploadImgRef.$refs.upLoadRef.submit()
        let picture = this.$refs.uploadImgRef.picture
        let formData = new FormData()
        formData.append("picture", picture)
        console.log(this.modelsInfo)
        let modelId = this.modelsInfo[this.modelName][this.modelScale]

        let { data } = await restoreImg(store.state.userInfo.userId, modelId, picture)
        this.res = data
      }else{
        this.$message.warning('请先登录~')
      }
    },

    isImgOk(url, target, timeout=2000){
      let that = this
      let imgUrl = this.baseUrl+url
      let finish = this.baseUrl+url.replace('.', '_finish.')
      const timer = window.setInterval(() => {
        getImgFromBackend(finish).then(res => {
          //终止轮询
          console.log("polling succeed.")
          that[target] = imgUrl
          clearInterval(timer)
        }).catch(error => {
          console.log("polling...")
        })
      }, timeout)
      // 清除定时器
      emitter.on('beforeDestroy', () => { clearInterval(timer) })
    },

    imageLoadSuccess(e){
      if(e.currentTarget.id == 'leftImg'){
        this.leftImgInfo = {
          'height': e.currentTarget.naturalHeight/this.modelScale,
          'width': e.currentTarget.naturalWidth/this.modelScale,
        }
      }else{
        this.rightImgInfo = {
          'height': e.currentTarget.naturalHeight,
          'width': e.currentTarget.naturalWidth,
        }
      }
    }
  },

  created() {

  },

  beforeUnmount() {
    emitter.emit('beforeDestroy')
  }

}
</script>

<style scoped>
.el-aside {
  padding-top: 10px;
  background-image: url(http://www.csszengarden.com/214/contours@2x.png),
                    url(http://www.csszengarden.com/214/gridlines.png),
                    url(http://www.csszengarden.com/214/noise.png),
                    url(http://www.csszengarden.com/214/koi.jpg);
  background-size: 50% auto, auto, auto, cover;
}
.el-select {
  padding: 5px;
}
.el-container {
  height: 100%;
}
#wrapper {
  height: 100%;
}
</style>