import axios from '@/services/api'

function initialState() {
  return {
    status: '',
    company: [],
    singleCompany: {},
    companyPagination: null
  }
}

const state = initialState()

const getters = {
  getAllCompany: state => state.company,
  getSingleCompany: state => state.singleCompany,
  getCompanyPagination: state => state.companyPagination
}

const actions = {
  ['COMPANY_GET_ALL']: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      if (!params?.silent_loading) {
        dispatch('API_PROCESSING', true, { root: true })
      }
      commit('COMPANY_REQUEST')
      axios
        .get(`/admin/company`, { params })
        .then(response => {
          commit('COMPANY_GET_ALL_SUCCESS', response.data)
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

  ['COMPANY_GET']: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('COMPANY_REQUEST')
      axios
        .get(`/admin/company/${params.id}`)
        .then(response => {
          commit('COMPANY_GET_SUCCESS', response.data)

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

  ['COMPANY_CREATE']: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('COMPANY_REQUEST')
      axios
        .post(`/admin/company`, params)
        .then(response => {
          let data = response.data.data
          commit('COMPANY_CREATE_SUCCESS', { data })
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

  ['COMPANY_UPDATE']: ({ commit, dispatch }, params) => {
    dispatch('API_PROCESSING', true, { root: true })
    return new Promise((resolve, reject) => {
      commit('COMPANY_REQUEST')
      axios
        .put(`/admin/company/${params.id}`, params)
        .then(response => {
          let data = response.data.data
          commit('COMPANY_UPDATE_SUCCESS', { data })

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

  ['COMPANY_DELETE']: ({ commit, dispatch }, params) => {
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
          commit('COMPANY_DELETE_SUCCESS', { data })
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
  ['COMPANY_REQUEST']: state => {
    state.status = 'loading'
  },
  ['COMPANY_GET_ALL_SUCCESS']: (state, payload) => {
    state.status = 'success'
    state.company = payload.data.companies
    state.companyPagination = payload.paginate
  },

  ['COMPANY_GET_SUCCESS']: (state, payload) => {
    state.status = 'success'
    state.singleCompany = payload.data
  },

  ['COMPANY_CREATE_SUCCESS']: state => {
    state.status = 'success'
  },

  ['COMPANY_UPDATE_SUCCESS']: state => {
    state.status = 'success'
  },

  ['COMPANY_DELETE_SUCCESS']: state => {
    state.status = 'success'
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
