import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import global_config from '@/utils/global'

const service = axios.create({
  baseURL: global_config.BASEURL,
  timeout: 5000
})

// request 拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['x-token'] = getToken()
    }
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 做一下判断,如果是blob
    if (res instanceof Blob) {
      return res
    } else {
      if (res.status !== 200) {
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })

        if (res.status === 401) {
          MessageBox.confirm(
            '你已被登出，可以取消继续留在该页面，或者重新登录',
            '确定登出',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            store.dispatch('FedLogOut').then(() => {
              location.reload()
            })
          })
        }
        return Promise.reject('error')
      } else {
        return response.data
      }
    }
  },
  error => {
    Message({
      message: error.message,
      type: '发生异常',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
