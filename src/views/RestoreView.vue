<template>
<div id="wrapper">
  <el-container>
    <el-aside>
      <keep-alive>
        <UploadImage ref="uploadImgRef" v-loading="loading"></UploadImage>
      </keep-alive>
      <el-select v-model="modelName" class="modelNameSelect" placeholder="Select" size="large">
        <el-option
            v-for="(value, key) in modelsInfo"
            :key="key"
            :label="key"
            :value="key"
        />
      </el-select>
      <el-select v-model="modelScale" class="modelScaleSelect" placeholder="Select" size="default">
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
              <el-image :src="bicubicUrl" class="images">
                <template #error>
                  <div class="image-slot">
                    <Picture></Picture>
                  </div>
                </template>
              </el-image>
            </template>
            <template #right>
              <el-image :src="srUrl" class="images">
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
      // bicubicUrl: '', // 用于img标签显示图片
      bicubicUrl: 'http://192.168.108.66:8181/result/root/realRes/bicubic/x4/2022-06-16_10-29-31/origin.jpg', // 用于img标签显示图片
      // srUrl: ''
      srUrl: 'http://192.168.108.66:8181/result/root/realRes/SRCNN/x4/2022-06-16_10-29-31/origin.jpg'
    }
  },
  components:{
    UploadImage, ContrastImageWithPreview,// PreviewImage
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
      if(newValue != "") this.isImgOk(newValue, 'bicubicUrl')
    },
    sr(newValue, oldValue){
      if(newValue != "") this.isImgOk(newValue, 'srUrl')
    },
    bicubicUrl(newValue, oldValue){
      if(newValue != "" && this.srUrl!="") this.loading = false
    }
  },
  methods: {
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

  },

  created() {
    console.log("created RV")
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