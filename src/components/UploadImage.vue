<template>
<div :style="'padding: 10px'">
  <el-upload
      ref="upLoadRef"
      class="avatar-uploader"
      list-type="picture"
      :on-change="handleAvatarChangeIcon"
      :on-success="handleAvatarSuccessThree"
      :before-upload="beforeAvatarUpload"
      :action="''"

      :show-file-list="false"
      :auto-upload="false"
  >
    <el-image v-if="imgUrl" :src="imgUrl" class="avatar"/>
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</div>
</template>

<script>
import { Plus } from '@element-plus/icons-vue'
export default {
  name: "UploadImage",
  data(){
    return {
      imgUrl: '',
      picture: {}
    }
  },
  components:{
    Plus
  },
  methods: {
    handleAvatarChangeIcon(file,fileList){
      const isJPG = file.raw.type === 'image/jpeg'
      const isPNG = file.raw.type === 'image/png'
      const isLt2M = file.raw.size / 1024 / 1024 < 2
      if (!isPNG && !isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
        return false
      } else if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      } else if (isLt2M && (isPNG || isJPG)) {
        this.imgUrl = file.url
        console.log(this.imgUrl)
      }
    },

    handleAvatarSuccessThree(res, file) {
      this.imgUrl = URL.createObjectURL(file.raw);
      this.formData.imageUrl = res[0].newFileName;
      this.$message({ //上传成功返回的消息
        type: 'success',
        showClose: true,
        message: res[0].info
      })
    },

    beforeAvatarUpload(picture) {
      this.picture = picture
      console.log(this.picture)
      return false
    },
  }
}
</script>

<style scoped>
.avatar-uploader{
  width: 50%;
  height: 100px;
  display: block;
  margin: auto;

  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  padding-top: 35px;
  color: #8c939d;
  text-align: center;
}

.avatar {
  position: absolute;
  top: 0;
  bottom: 0;
  text-align: center;
}
</style>