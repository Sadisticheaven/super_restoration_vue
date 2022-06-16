<template>
  <div>
    <div class='login'>
      <div class='login_title'>
        <span>用户登录</span>
      </div>
      <div class='login_fields'>
        <div class='login_fields__user'>
          <el-input v-model="userName" >
            <template #prefix>
              <el-icon class="el-input__icon"><avatar /></el-icon>
            </template>
          </el-input>
        </div>
        <div class='login_fields__password'>
          <el-input v-model="userPwd" @keyup.enter="login">
            <template #prefix>
              <el-icon class="el-input__icon"><lock /></el-icon>
            </template>
          </el-input>
        </div>
        <div class='login_fields__submit'>
          <input type='button' value='登录' @click="login">
        </div>
      </div>
      <div class='success'>
      </div>
      <div class='disclaimer'>
        <p>欢迎使用图像超分辨率！</p>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import {Avatar, Lock} from "@element-plus/icons-vue";
import {requestLogin} from "@/utils/http";

export default {
  name: "LoginComponent",
  data(){
    return { userName: '' , userPwd: ''}
  },
  components: {
    Lock,
    Avatar
  },
  methods: {
    async login(){
      let { data } = await requestLogin(this.userName, this.userPwd)
      if(data.userId != null){
        console.log("login success")
        console.log(data)
        await store.dispatch('SETUSER', data)
        console.log(store.state.userInfo)
        this.$router.back()
      }else{
        console.log("login failed")
      }
    },
  },
}
</script>

<style scoped>

.login
{
  box-shadow: -15px 15px 15px rgba(59, 94, 88, 0.7);
  width: 240px;
  height: 300px;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  top: 0;
  bottom: 0;
  padding: 100px 40px 40px 40px;
  /* Chrome10+,Safari5.1+ */
  /* Opera 11.10+ */
  /* IE10+ */
  background: linear-gradient(230deg, rgba(53, 57, 74, 0) 0%, rgba(38, 76, 79, 0.29) 100%);
}

.login .disclaimer {
  position: absolute;
  bottom: 20px;
  left: 35px;
  width: 250px;
}
.login_title {
  color: #2c625a;
  height: 60px;
  text-align: left;
  font-size: 16px;
}
.login_fields {
  height: 208px;
  left: 0;
}

.login_fields__user, .login_fields__password {
  z-index: 1;
  left: 36px;
  top: 8px;
  /*opacity: .5;*/
  padding-bottom: 5%;
}
.login_fields__submit {
  position: relative;
  top: 20px;
}
.login_fields__submit .forgot {
  float: right;
  font-size: 10px;
  margin-top: 11px;
  text-decoration: underline;
}
.login_fields__submit .forgot a {
  color: #606479;
}
.login_fields__submit input {
  border-radius: 50px;
  background: transparent;
  padding: 10px 50px;
  border: 2px solid #4FA1D9;
  color: #4FA1D9;
}
.login_fields__submit input:focus {
  box-shadow: none;
  outline: none;
}
.login_fields__submit input:hover {
  color: white;
  background: #4FA1D9;
  cursor: pointer;
  transition-property: background,color;
  transition-duration: .2s;
}
</style>