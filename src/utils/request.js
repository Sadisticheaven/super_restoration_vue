import axios from "axios";
// ajax跨域请求
// axios.defaults.baseURL = 'http://localhost:8181/';
// axios.defaults.baseURL = 'http://192.168.137.1:8181/';
// axios.defaults.baseURL = 'http://192.168.108.66:8181/';
// axios.defaults.baseURL = 'http://192.168.1.102:8181/';
// axios.defaults.baseURL = 'http://192.168.1.100:8181/';
axios.defaults.baseURL = 'http://172.20.131.62:8181/';
axios.interceptors.request.use(config=>config);
axios.interceptors.response.use(res=>{
    return res;
}, error => {
    return Promise.reject(error);
});

export default axios;