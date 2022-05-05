import axios from '@/services/api'

import {
  INTERNSHIP_FEATURES_REQUEST,
  INTERNSHIP_FEATURES_GET_ALL,
  INTERNSHIP_FEATURES_GET_ALL_SUCCESS,
  INTERNSHIP_FEATURES_GET_ALL_ERROR,
  INTERNSHIP_FEATURES_GET_SUCCESS,
  INTERNSHIP_FEATURES_DELETE,
  INTERNSHIP_FEATURES_EDIT,
  INTERNSHIP_FEATURES_CREATE
} from '@/store/actions/internship_features.js'

function initialState() {
  return {
    status: '',
    internshipFeatures: [],
    singleInternshipFeature: {},
    internshipFeaturesPagination: null
  }
}

const state = initialState()

const getters = {
  getAllInternshipFeatures: state => state.internshipFeatures,
  getSingleInternshipFeature: state => state.singleInternshipFeature,
  getInternshipFeaturesPagination: state => state.internshipFeaturesPagination
}

const actions = {
  [INTERNSHIP_FEATURES_GET_ALL]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('INTERNSHIP_FEATURES_REQUEST')
      axios
        .get(`/admin/internship-feature`, { params })
        .then(response => {
          commit('INTERNSHIP_FEATURES_GET_ALL_SUCCESS', response.data)
          resolve(response)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  },
  [INTERNSHIP_FEATURES_EDIT]: ({ dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      axios
        .put(`/admin/internship-feature/${params.id}`, params)
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
  [INTERNSHIP_FEATURES_CREATE]: ({ dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      axios
        .post(`/admin/internship-feature`, params)
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
  [INTERNSHIP_FEATURES_DELETE]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('INTERNSHIP_FEATURES_REQUEST')
      axios
        .delete(`/admin/internship-feature/${params}`)
        .then(response => {
          commit('INTERNSHIP_FEATURES_DELETE', response.data)
          resolve(response)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  }
}

const mutations = {
  [INTERNSHIP_FEATURES_REQUEST]: state => {
    state.status = 'loading'
  },

  [INTERNSHIP_FEATURES_GET_ALL_SUCCESS]: (state, payload) => {
    state.status = 'success'
    state.internshipFeatures = payload.data.internship_features || []
    state.internshipFeaturesPagination = payload.paginate
  },

  [INTERNSHIP_FEATURES_GET_SUCCESS]: (state, payload) => {
    state.status = 'success'
    state.singleInternshipFeature = payload.data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
