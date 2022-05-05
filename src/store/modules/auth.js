import axios from '@/services/api'

import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  AUTH_FORGOT,
  AUTH_RESET
} from '@/store/actions/auth'
import router from '@/router/index.js'

function initialState() {
  return {
    token: '',
    status: '',
    user: null
  }
}

const state = initialState()

const getters = {
  token: state => state.token,
  isLoggedIn: state => !!state.token,
  authStatus: state => state.status,
  user: state => state.user
}

const actions = {
  [AUTH_REQUEST]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('AUTH_REQUEST')
      axios
        .post(`admin/log-in`, params)
        .then(response => {
          const token = response.data.data.token
          const user = response.data.data.admin

          axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

          commit('AUTH_SUCCESS', { token, user })

          resolve(response)
        })
        .catch(err => {
          commit('AUTH_ERROR')
          reject(err)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  },

  [AUTH_LOGOUT]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('AUTH_REQUEST')
      axios
        .post(`admin/logout`)
        .then(resp => {
          commit('AUTH_LOGOUT')
          // if (resp.status == 204) {
          // }
          resolve(resp)
        })
        .catch(err => {
          commit('AUTH_ERROR')
          reject(err)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
          commit('AUTH_LOGOUT')
        })
    })
  },
  [AUTH_FORGOT]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('AUTH_REQUEST')
      axios
        .post(`admin/forget-password`, params)
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          commit('AUTH_ERROR')
          reject(err)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  },
  [AUTH_RESET]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      axios
        .post(`/admin/reset-password`, params)
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          commit('AUTH_ERROR')
          reject(err)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  }
}

const mutations = {
  [AUTH_REQUEST]: state => {
    state.status = 'loading'
  },

  [AUTH_SUCCESS]: (state, params) => {
    state.status = 'success'
    state.user = params.user
    state.token = params.token
    // state.user.full_name = params.user.last_name + ' ' + params.user.first_name
  },

  [AUTH_ERROR]: state => {
    state.status = 'error'
  },

  [AUTH_LOGOUT]: state => {
    state.isLoggedIn = false
    router.push({ name: 'Login' }).catch(() => {})

    const s = initialState()
    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })
    window.localStorage.clear()
    state.status = ''
    state.user = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
