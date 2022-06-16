import axios from "./request"

export function getModelList(){
    return axios({
        method: 'get',
        url: 'model/findAll',
    })
}

export function requestLogin(userName, userPwd){
    return axios({
        method: 'post',
        url: 'user/login',
        params: {
            userName: userName,
            userPwd: userPwd
        }
    })
}

export function restoreImg(userId, modelId, picture){
    let formData = new FormData()
    formData.append("picture", picture)
    return axios({
        method: 'post',
        url: '/process/singleImage',
        params: {
            userId: userId,
            modelId: modelId
        },
        data: formData
    })
}

export function getImgFromBackend(imgUrl){
    return axios({
        method: 'get',
        url: imgUrl
    })
}
