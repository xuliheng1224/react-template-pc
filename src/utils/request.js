import axios from 'axios'
import { message } from 'antd'
import {
  getQueryString,
  // rmUrlParams,
} from './validate'

// 创建axios实例
const service = axios.create({
  baseURL: '', // api 的 base_url
  timeout: 200000, // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    const ticket = getQueryString('ticket', 'hash')
    const token = localStorage.getItem('token')

    if(ticket && ticket !== 'undefined' && ticket !== 'null') {
      config.headers.ticket = ticket
      localStorage.setItem('token', ticket)
    } else if (token && token !== 'undefined' && token !== 'null') {
      config.headers.ticket = token
    } else {
      config.headers.ticket = ''
    }

    config.isRequestEnd = false // 标记这次请求是否结束

    config.headers = {
      ...config.headers,
      ...{
        redirect_uri: `${location.href}`,
        client_id: 'rdfa-bp', // 项目代号
        client_type: 'web',
      },
    }

    return config
  },
  (error) => {
    // Do something with request error
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response) => {
    /**
     * code为非000是抛错
     */
    if (response.config.responseType === 'blob') return response

    const res = response.data
    const resCode = parseInt(res.code, 0)

    if (resCode === 200 || resCode === 0) {
      if (res.msg) {
        // 信息展示
      }
      return response

    } else if (resCode === 3002) {
      if (response.config.url === '/api/v1/api/logout') localStorage.setItem('token', '')

      // 重定向地址
      location.href = res.data

    } else {
      message.error(res.msg)

      return Promise.reject(res)
    }
  },
  (error) => {
    message.error(error.message)

    return Promise.reject(error)
  }
)

export default service
