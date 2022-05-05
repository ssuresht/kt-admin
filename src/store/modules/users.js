import axios from '@/services/api'

import {
  USERS_REQUEST,
  USERS_GET_ALL,
  USERS_GET_ALL_SUCCESS,
  USERS_GET,
  USERS_GET_SUCCESS,
  USERS_DELETE,
  USERS_DELETE_SUCCESS,
  USERS_CHANGE_STATUS,
  USERS_CHANGE_STATUS_SUCCESS,
  USERS_JOBS,
  USERS_JOBS_SUCCESS
} from '@/store/actions/users'

function initialState() {
  return {
    status: '',
    users: [],
    singleUser: {},
    userTotalPages: 0,
    userTotalRecord: 0,
    userJobs: [],
    userJobTotalPages: 0,
    userJobTotalRecord: 0
  }
}

const state = initialState()

const getters = {
  getUserStatus: state => state.status,
  getAllUser: state => state.users,
  singleUser: state => state.singleUser,
  getUserTotalPages: state => state.userTotalPages,
  getUserTotalRecord: state => state.userTotalRecord,
  getUserJobs: state => state.userJobs,
  getUserJobTotalPages: state => state.userJobTotalPages,
  getUserJobTotalRecord: state => state.userJobTotalRecord
}

const actions = {
  [USERS_GET_ALL]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('USERS_REQUEST')
      axios
        .get(`/admin/users`, { params })
        .then(response => {
          let data = response.data.data
          commit('USERS_GET_ALL_SUCCESS', { data })

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
  [USERS_GET]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('USERS_REQUEST')
      axios
        .get(`/admin/user/${params.id}`)
        .then(response => {
          let data = response.data.data
          commit('USERS_GET_SUCCESS', { data })

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
  [USERS_DELETE]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      if (!params?.id) {
        return
      }

      dispatch('API_PROCESSING', true, { root: true })
      commit('USERS_REQUEST')
      axios
        .delete(`/admin/user/${params.id}`)
        .then(response => {
          let data = response.data.data
          commit('USERS_DELETE_SUCCESS', { data })

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

  [USERS_CHANGE_STATUS]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('USERS_REQUEST')
      axios
        .post(`/admin/user/change-status`, params)
        .then(response => {
          let data = response.data.data
          commit('USERS_CHANGE_STATUS_SUCCESS', { data })

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

  [USERS_JOBS]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('USERS_REQUEST')
      axios
        .post(`/admin/job/myJobs`, params)
        .then(response => {
          let data = response.data.data
          commit('USERS_JOBS_SUCCESS', { data })

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
  [USERS_REQUEST]: state => {
    state.status = 'loading'
  },

  [USERS_GET_ALL_SUCCESS]: (state, params) => {
    state.status = 'success'
    state.users = params.data
    state.userTotalPages = params.data.page.total
    state.userTotalRecord = params.data.page.records.total
  },

  [USERS_GET_SUCCESS]: (state, params) => {
    state.status = 'success'
    state.singleUser = params.data
  },

  [USERS_DELETE_SUCCESS]: state => {
    state.status = 'success'
  },

  [USERS_CHANGE_STATUS_SUCCESS]: state => {
    state.status = 'success'
  },

  [USERS_JOBS_SUCCESS]: (state, params) => {
    state.status = 'success'
    state.userJobs = params.data.jobs
    state.userJobTotalPages = params.data.page.total
    state.userJobTotalRecord = params.data.page.records.total
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
