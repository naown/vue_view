import axios from 'axios'
import router from "./router";
import Element from 'element-ui'
import store from "./store"
import { MessageBox,Message } from 'element-ui'
import errorCode from '@/utils/errorCode'

//axios.defaults.baseURL = "/api"
axios.defaults.baseURL = "http://localhost:8089"

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
    // 未设置状态码则默认成功状态
    const code = response.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || response.data.msg || errorCode['default']
    if (code === 401) {
        MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }
        ).then(() => {
            store.commit('REMOVE_TOKEN')
            router.push('/login')
        }).catch(() => {});
    } else if (code === 500) {
        Message({
            message: msg,
            type: 'error'
        })
        return Promise.reject(new Error(msg))
    } else if (code !== 200) {
        Notification.error({
            title: msg
        })
        return Promise.reject('error')
    } else{
        return response.data
    }

    /*let res = response.data
    if (code === 200 || response.status === 200){
        return response
    } else {
        Element.Message.error(res.msg ? res.msg : '系统异常')
        return Promise.reject(response.data.msg)
    }*/
},error => {
    console.log('err' + error)
    let { message } = error;
    if (message === "Network Error") {
        message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
        message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
        message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
        message: message,
        type: 'error',
        duration: 5 * 1000
    })
    return Promise.reject(error)
})

export default request
