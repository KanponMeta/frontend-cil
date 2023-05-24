// import localCache from "@/utils/cache";
import KPRequest from './kpAxios'
import { useUserInfoStore } from '../../stores'

const BASE_URL = 'http://127.0.0.1:9000'
// const BASE_URL = 'http://192.168.50.41:8056'
const TIME_OUT = 10000

const kpRequest = new KPRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  headers: {
    'Content-Type': 'application/json'
  },
  interceptors: {
    requestInterceptor: (config) => {
      // // 携带token的拦截

      const store = useUserInfoStore()
      const token = store.authorization
      if (token && token !== '') {
        config.headers.Authorization = token
      }
      return config
    },
    requestInterceptorCatch: (err) => {
      return err
    },
    responseInterceptor: (res) => {
      return res
    },
    responseInterceptorCatch: (err) => {
      return err
    }
  }
})

export default kpRequest
