import axios from 'axios'
import router from "./router";
import Element from 'element-ui'

axios.defaults.baseURL = "http://localhost:8081"

const request = axios.create({
    timeout: 50000,
    headers: {
        'Content-Type':'application/json; charset=utf-8'
    }
})

// 在每次发送请求时带上请求头Authorization 也就是jwt
request.interceptors.request.use(config => {
    config.headers['Authorization'] = localStorage.getItem('token')
    return config
})
// 返回结果的处理
request.interceptors.response.use(response => {
    let res = response.data
    if (res.code === 200){
        return response
    } else {
        Element.Message.error(res.msg ? res.msg : '系统异常')
        return Promise.reject(response.data.msg)
    }
},error => {

    if (error.response.data){
        error.message = error.response.data.msg
    }
    if (error.response.status === 401){
        router.push('/login')
    }
    Element.Message.error(error.message,{duration:3000})
    return Promise.reject(error)
})

export default request
