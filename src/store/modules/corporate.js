import axios from '@/services/api'

import {
  CORPORATE_REQUEST,
  CORPORATE_GET_ALL,
  CORPORATE_GET_ALL_SUCCESS,
  CORPORATE_GET,
  CORPORATE_GET_SUCCESS,
  CORPORATE_CREATE,
  CORPORATE_CREATE_SUCCESS,
  CORPORATE_UPDATE,
  CORPORATE_UPDATE_SUCCESS,
  CORPORATE_DELETE,
  CORPORATE_DELETE_SUCCESS,
  GET_CORPORATE_CATEGORY_DATA,
  GET_CORPORATE_CATEGORY_SUCCESS
} from '@/store/actions/corporate'

function initialState() {
  return {
    status: '',
    corporate: [],
    singleCorporate: {},
    corporatePagination: null,
    csvData: null
  }
}

const state = initialState()

const getters = {
  getAllCorporate: state => state.corporate,
  getSingleCorporate: state => state.singleCorporate,
  getCorporatePagination: state => state.corporatePagination,
  getCorporateCategories: state => state.corporateCategories,
  getCsvData: state => state.csvData
}

const actions = {
  ['CORPORATE_EXPORT_CSV']: ({ commit, dispatch }) => {
    dispatch('API_PROCESSING', true, { root: true })
    return new Promise((resolve, reject) => {
      axios
        .get('/admin/export/company')
        .then(response => {
          commit('CORPORATE_EXPORT_CSV_SUCCESS', response.data.data.csv)
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
  [GET_CORPORATE_CATEGORY_DATA]: ({ commit, dispatch }) => {
    dispatch('API_PROCESSING', true, { root: true })
    return new Promise((resolve, reject) => {
      axios
        .get('/admin/business_industry')
        .then(response => {
          commit(GET_CORPORATE_CATEGORY_SUCCESS, response.data)
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
  [CORPORATE_GET_ALL]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('CORPORATE_REQUEST')
      axios
        .get(`/admin/company`, { params })
        .then(response => {
          commit('CORPORATE_GET_ALL_SUCCESS', response.data)
          resolve(response)
        })
        .catch(err => {
          commit('CORPORATE_GET_ALL_ERROR')
          reject(err)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  },

  [CORPORATE_GET]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('CORPORATE_REQUEST')
      axios
        .get(`/admin/company/${params.id}`)
        .then(response => {
          commit('CORPORATE_GET_SUCCESS', response.data)

          resolve(response)
        })
        .catch(err => {
          commit('CORPORATE_GET_ERROR')
          reject(err)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  },

  [CORPORATE_CREATE]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('CORPORATE_REQUEST')
      axios
        .post(`/admin/company`, params)
        .then(response => {
          let data = response.data.data
          commit('CORPORATE_CREATE_SUCCESS', { data })
          resolve(response)
        })
        .catch(err => {
          commit('CORPORATE_CREATE_ERROR')
          reject(err)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  },

  [CORPORATE_UPDATE]: ({ commit, dispatch }, params) => {
    dispatch('API_PROCESSING', true, { root: true })
    return new Promise((resolve, reject) => {
      commit('CORPORATE_REQUEST')
      axios
        .put(`/admin/company/${params.id}`, params)
        .then(response => {
          let data = response.data.data
          commit('CORPORATE_UPDATE_SUCCESS', { data })

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

  [CORPORATE_DELETE]: ({ commit, dispatch }, params) => {
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
          commit('CORPORATE_DELETE_SUCCESS', { data })
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
  ['CORPORATE_EXPORT_CSV_SUCCESS']: (state, payload) => {
    state.csvData = payload
  },
  [CORPORATE_REQUEST]: state => {
    state.status = 'loading'
  },
  [GET_CORPORATE_CATEGORY_SUCCESS]: (state, payload) => {
    state.corporateCategories = payload
  },
  [CORPORATE_GET_ALL_SUCCESS]: (state, payload) => {
    state.status = 'success'
    state.corporate = payload.data.companies
    state.corporatePagination = payload.paginate
  },

  [CORPORATE_GET_SUCCESS]: (state, payload) => {
    state.status = 'success'
    state.singleCorporate = payload.data
  },

  [CORPORATE_CREATE_SUCCESS]: state => {
    state.status = 'success'
  },

  [CORPORATE_UPDATE_SUCCESS]: state => {
    state.status = 'success'
  },

  [CORPORATE_DELETE_SUCCESS]: state => {
    state.status = 'success'
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
