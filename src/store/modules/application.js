import axios from '@/services/api'

import {
  APPLICATION_REQUEST,
  APPLICATION_GET_ALL,
  APPLICATION_GET_ALL_SUCCESS,
  APPLICATION_GET,
  APPLICATION_GET_SUCCESS,
  APPLICATION_CREATE,
  APPLICATION_CREATE_SUCCESS,
  APPLICATION_UPDATE,
  APPLICATION_UPDATE_SUCCESS,
  APPLICATION_DELETE,
  APPLICATION_DELETE_SUCCESS,
  GET_APPLICATION_CATEGORY_DATA,
  GET_APPLICATION_CATEGORY_SUCCESS
} from '@/store/actions/application'

function initialState() {
  return {
    status: '',
    application: [],
    singleApplication: {},
    applicationPagination: null,
    csvData: null,
    applicationCounts: {}
  }
}

const state = initialState()

const getters = {
  getAllApplication: state => state.application,
  getSingleApplication: state => state.singleApplication,
  getApplicationPagination: state => state.applicationPagination,
  getApplicationCategories: state => state.applicationCategories,
  getApplicationCsvData: state => state.csvData,
  getApplicationCounts: state => state.applicationCounts,
}

const actions = {
  ['APPLICATION_EXPORT_CSV']: ({ commit, dispatch }) => {
    dispatch('API_PROCESSING', true, { root: true })
    return new Promise((resolve, reject) => {
      axios
        .get('/admin/export/application')
        .then(response => {
          commit('APPLICATION_EXPORT_CSV_SUCCESS', response.data.data.csv)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  },
  [GET_APPLICATION_CATEGORY_DATA]: ({ commit, dispatch }) => {
    dispatch('API_PROCESSING', true, { root: true })
    return new Promise((resolve, reject) => {
      axios
        .get('/admin/business_industry')
        .then(response => {
          commit(GET_APPLICATION_CATEGORY_SUCCESS, response.data)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  },
  [APPLICATION_GET_ALL]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('APPLICATION_REQUEST')
      axios
        .get(`/admin/applications`, { params })
        .then(response => {
          commit('APPLICATION_GET_ALL_SUCCESS', response.data)
          resolve(response)
        })
        .catch(err => {
          commit('APPLICATION_GET_ALL_ERROR')
          reject(err)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  },

  [APPLICATION_GET]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('APPLICATION_REQUEST')
      axios
        .get(`/admin/company/${params.id}`)
        .then(response => {
          commit('APPLICATION_GET_SUCCESS', response.data)

          resolve(response)
        })
        .catch(err => {
          commit('APPLICATION_GET_ERROR')
          reject(err)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  },

  [APPLICATION_CREATE]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('APPLICATION_REQUEST')
      axios
        .post(`/admin/company`, params)
        .then(response => {
          let data = response.data.data
          commit('APPLICATION_CREATE_SUCCESS', { data })
          resolve(response)
        })
        .catch(err => {
          commit('APPLICATION_CREATE_ERROR')
          reject(err)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  },

  [APPLICATION_UPDATE]: ({ commit, dispatch }, params) => {
    dispatch('API_PROCESSING', true, { root: true })
    return new Promise((resolve, reject) => {
      commit('APPLICATION_REQUEST')
      axios
        .put(`/admin/applications/${params.id}`, params)
        .then(response => {
          let data = response.data.data
          commit('APPLICATION_UPDATE_SUCCESS', { data })

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

  [APPLICATION_DELETE]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      if (!params?.id) {
        return
      }

      dispatch('API_PROCESSING', true, { root: true })
      commit('USERS_REQUEST')
      axios
        .delete(`/admin/company/${params.id}`)
        .then(response => {
          let data = response.data.data
          commit('APPLICATION_DELETE_SUCCESS', { data })
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
  ['APPLICATION_EXPORT_CSV_SUCCESS']: (state, payload) => {
    state.csvData = payload
  },
  [APPLICATION_REQUEST]: state => {
    state.status = 'loading'
  },
  [GET_APPLICATION_CATEGORY_SUCCESS]: (state, payload) => {
    state.applicationCategories = payload
  },
  [APPLICATION_GET_ALL_SUCCESS]: (state, payload) => {
    state.status = 'success'
    state.application = payload.data.data.data
    state.applicationPagination = payload.paginate
    state.applicationCounts = payload.data.counts
  },

  [APPLICATION_GET_SUCCESS]: (state, payload) => {
    state.status = 'success'
    state.singleApplication = payload.data
  },

  [APPLICATION_CREATE_SUCCESS]: state => {
    state.status = 'success'
  },

  [APPLICATION_UPDATE_SUCCESS]: state => {
    state.status = 'success'
  },

  [APPLICATION_DELETE_SUCCESS]: state => {
    state.status = 'success'
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
