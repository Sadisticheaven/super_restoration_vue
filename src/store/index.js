import { createStore } from "vuex";
export default createStore({
  state: {
    dynamicRoutes: [],
    modelList: [],
    userInfo: {
      userId: 1,
      userName: '',
      userPwd: '',
      userPhone: '',
      userRegisterTime: '',
      userDir: '',
    },
  },
  getters: {
    dynamicRoutesData: state => state.dynamicRoutes,
    modelListData: state => state.modelList,
    userInfoData: state => state.userInfo,

  },
  mutations: {
    SETROUTES(state, routes){
      state.dynamicRoutes = routes
    },
    SETMODELS(state, models){
      state.modelList = models
    },
    SETUSER(state, user){
      state.userInfo = user
    }
  },
  actions: {
    SETROUTES({commit}, data){
      commit('SETROUTES', data)
    },

    SETMODELS({commit}, data){
      commit('SETMODELS', data)
    },

    SETUSER({commit}, data){
      commit('SETUSER', data)
    }
  },
  modules: {},
});
