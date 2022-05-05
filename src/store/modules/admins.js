import axios from '@/services/api'

import {
  ADMINS_REQUEST,
  ADMINS_GET_ALL,
  ADMINS_GET_ALL_SUCCESS,
  ADMINS_GET,
  ADMINS_GET_SUCCESS,
  ADMINS_UPDATE,
  ADMINS_UPDATE_SUCCESS,
  ADMINS_CREATE,
  ADMINS_CREATE_SUCCESS,
  ADMINS_DELETE,
  ADMINS_DELETE_SUCCESS
} from '@/store/actions/admins'

function initialState() {
  return {
    status: '',
    admins: [],
    admin: null
  }
}

const state = initialState()

const getters = {
  getAllAdmins: state => state.admins,
  getAdmin: state => state.admin
}

const actions = {
  [ADMINS_GET_ALL]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('ADMINS_REQUEST')
      axios
        .get(`/admin/admin`)
        .then(response => {
          let data = response.data.data
          commit('ADMINS_GET_ALL_SUCCESS', data)

          resolve(response)
        })
        .catch(err => {
          reject(err)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  },

  [ADMINS_GET]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('ADMINS_REQUEST')
      axios
        .get(`/admin/admin/${params.id}`)
        .then(response => {
          let data = response.data.data
          commit('ADMINS_GET_SUCCESS', data)

          resolve(response)
        })
        .catch(err => {
          reject(err)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  },

  [ADMINS_CREATE]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('ADMINS_REQUEST')
      axios
        .post(`/admin/admin`, params)
        .then(response => {
          let data = response.data.data
          commit('ADMINS_CREATE_SUCCESS', { data })

          resolve(response)
        })
        .catch(err => {
          reject(err)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  },

  [ADMINS_UPDATE]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('ADMINS_REQUEST')
      axios
        .put(`/admin/admin/${params.id}`, params)
        .then(response => {
          let data = response.data.data
          commit('ADMINS_UPDATE_SUCCESS', { data })

          resolve(response)
        })
        .catch(err => {
          reject(err)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  },

  [ADMINS_DELETE]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('ADMINS_REQUEST')
      axios
        .delete(`/admin/admin/${params.id}`)
        .then(response => {
          let data = response.data.data
          commit('ADMINS_DELETE_SUCCESS', { data })

          resolve(response)
        })
        .catch(err => {
          reject(err)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  }
}

const mutations = {
  [ADMINS_REQUEST]: state => {
    state.status = 'loading'
  },

  [ADMINS_GET_ALL_SUCCESS]: (state, params) => {
    state.admins = params[0]
  },

  [ADMINS_GET_SUCCESS]: (state, params) => {
    state.admin = params[0]
  },

  [ADMINS_CREATE_SUCCESS]: state => {
    state.status = 'success'
  },

  [ADMINS_UPDATE_SUCCESS]: state => {
    state.status = 'success'
  },

  [ADMINS_DELETE_SUCCESS]: state => {
    state.status = 'success'
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
