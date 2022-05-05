import axios from '@/services/api'

import {
  FACILITIES_REQUEST,
  FACILITIES_GET_ALL,
  FACILITIES_GET_ALL_SUCCESS,
  FACILITIES_GET_SUCCESS,
  FACILITIES_DELETE,
  FACILITIES_EDIT,
  FACILITIES_CREATE
} from '@/store/actions/educational_facilities.js'

function initialState() {
  return {
    status: '',
    facilities: [],
    singleFacility: {},
    facilitiesPagination: null
  }
}

const state = initialState()

const getters = {
  getAllFacilities: state => state.facilities,
  getSingleFacility: state => state.singleFacility,
  getFacilitiesPagination: state => state.facilitiesPagination
}

const actions = {
  [FACILITIES_GET_ALL]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('FACILITIES_REQUEST')
      axios
        .get(`/admin/education-facility`, { params })
        .then(response => {
          commit('FACILITIES_GET_ALL_SUCCESS', response.data)
          resolve(response)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  },
  [FACILITIES_EDIT]: ({ dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      axios
        .put(`/admin/education-facility/${params.id}`, params)
        .then(response => {
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
  [FACILITIES_CREATE]: ({ dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      axios
        .post(`/admin/education-facility`, params)
        .then(response => {
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
  [FACILITIES_DELETE]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('FACILITIES_REQUEST')
      axios
        .delete(`/admin/education-facility/${params}`)
        .then(response => {
          commit('FACILITIES_DELETE_SUCCESS', response.data)
          resolve(response)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  }
}

const mutations = {
  [FACILITIES_REQUEST]: state => {
    state.status = 'loading'
  },

  [FACILITIES_GET_ALL_SUCCESS]: (state, payload) => {
    state.status = 'success'
    state.facilities = payload.data.education_facilities || []
    state.facilitiesPagination = payload.paginate
  },

  [FACILITIES_GET_SUCCESS]: (state, payload) => {
    state.status = 'success'
    state.getSingleFacility = payload.data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
