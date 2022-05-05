import axios from '@/services/api'

import {
  INTERNSHIP_OCCUPATIONS_REQUEST,
  INTERNSHIP_OCCUPATIONS_GET_ALL,
  INTERNSHIP_OCCUPATIONS_GET_ALL_SUCCESS,
  INTERNSHIP_OCCUPATIONS_GET_SUCCESS,
  INTERNSHIP_OCCUPATIONS_DELETE,
  INTERNSHIP_OCCUPATIONS_EDIT,
  INTERNSHIP_OCCUPATIONS_CREATE
} from '@/store/actions/internship_occupation.js'

function initialState() {
  return {
    status: '',
    internshipOccupations: [],
    singleInternshipOccupation: {},
    internshipOccupationsPagination: null
  }
}

const state = initialState()

const getters = {
  getAllInternshipOccupations: state => state.internshipOccupations,
  getSingleInternshipOccupation: state => state.singleInternshipOccupation,
  getInternshipOccupationsPagination: state =>
    state.internshipOccupationsPagination
}

const actions = {
  [INTERNSHIP_OCCUPATIONS_GET_ALL]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('INTERNSHIP_OCCUPATIONS_REQUEST')
      axios
        .get(`/admin/work-category`, { params })
        .then(response => {
          commit('INTERNSHIP_OCCUPATIONS_GET_ALL_SUCCESS', response.data)
          resolve(response)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  },
  [INTERNSHIP_OCCUPATIONS_EDIT]: ({ dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      axios
        .put(`/admin/work-category/${params.id}`, params)
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
  [INTERNSHIP_OCCUPATIONS_CREATE]: ({ dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      axios
        .post(`/admin/work-category`, params)
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
  [INTERNSHIP_OCCUPATIONS_DELETE]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('INTERNSHIP_OCCUPATIONS_REQUEST')
      axios
        .delete(`/admin/work-category/${params}`)
        .then(response => {
          commit('INTERNSHIP_OCCUPATIONS_DELETE', response.data)
          resolve(response)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  }
}

const mutations = {
  [INTERNSHIP_OCCUPATIONS_REQUEST]: state => {
    state.status = 'loading'
  },

  [INTERNSHIP_OCCUPATIONS_GET_ALL_SUCCESS]: (state, payload) => {
    state.status = 'success'
    state.internshipOccupations = payload.data.working_categories || []
    state.internshipOccupationsPagination = payload.paginate
  },

  [INTERNSHIP_OCCUPATIONS_GET_SUCCESS]: (state, payload) => {
    state.status = 'success'
    state.singleInternshipOccupation = payload.data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
