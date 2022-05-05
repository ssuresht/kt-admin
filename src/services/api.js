import axios from 'axios'
import store from '@/store/index.js'
import i18n from '@/plugins/i18n'

// Add a request interceptor
axios.interceptors.request.use(
  config => {
    store.commit('clearFormErrors')
    const token = store.getters.token
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }

    config.headers['Accept-Language'] = 'ja'
    config.headers['Content-Type'] = 'application/json'
    config.baseURL = process.env.VUE_APP_API_URL

    return config
  },
  error => {
    Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    return response
  },
  function(error) {
    // Do something with response error
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      store.commit('AUTH_LOGOUT')
    }
    if (error?.response?.status === 422) {
      store.commit('showAlert', {
        text:
          i18n.t(error?.response?.data?.errors?.message) ||
          i18n.t(error?.response?.data?.message),
        successStatus: true
      })
    }
    return Promise.reject(error.response)
  }
)

export default axios
