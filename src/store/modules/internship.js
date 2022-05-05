import axios from '@/services/api'

function initialState() {
  return {
    status: '',
    internship: [],
    singleInternship: {},
    internshipPagination: {},
    internshipCounts: {},
    previewInternship: {}
  }
}

const state = initialState()

const getters = {
  getAllInternship: state => state.internship,
  getSingleInternship: state => state.singleInternship,
  getInternshipPagination: state => state.internshipPagination,
  getInternshipCounts: state => state.internshipCounts,
  getPreviewInternship: state => state.previewInternship
}

const actions = {
  ['INTERNSHIP_GET_ALL']: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      axios
        .get(`/admin/internship-post`, { params })
        .then(response => {
          commit('INTERNSHIP_GET_ALL_SUCCESS', response.data)
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

  ['INTERNSHIP_GET']: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      axios
        .get(`/admin/internship-post/${params.id}`)
        .then(response => {
          commit('INTERNSHIP_GET_SUCCESS', response.data)

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

  ['INTERNSHIP_CREATE']: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      axios
        .post(`/admin/internship-post`, params)
        .then(response => {
          commit('INTERNSHIP_CREATE_SUCCESS', response.data)
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

  ['INTERNSHIP_UPDATE']: ({ commit, dispatch }, params) => {
    dispatch('API_PROCESSING', true, { root: true })
    return new Promise((resolve, reject) => {
      axios
        .post(`/admin/internship-post-update/${params.get('id')}`, params)
        .then(response => {
          commit('INTERNSHIP_UPDATE_SUCCESS', response.data)

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

  ['INTERNSHIP_DELETE']: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      if (!params?.id) {
        return
      }

      dispatch('API_PROCESSING', true, { root: true })
      commit('USERS_REQUEST')
      axios
        .delete(`/admin/internship-post/${params.id}`)
        .then(response => {
          let data = response.data.data
          commit('INTERNSHIP_DELETE_SUCCESS', { data })
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
  ['INTERNSHIP_GET_ALL_SUCCESS']: (state, payload) => {
    state.status = 'success'
    state.internship = payload.data.data
    state.internshipPagination = payload.data.paginate
    state.internshipCounts = payload.data.counts
  },

  ['INTERNSHIP_GET_SUCCESS']: (state, payload) => {
    state.status = 'success'
    state.singleInternship = payload.data.data
  },

  ['INTERNSHIP_CREATE_SUCCESS']: (state, payload) => {
    state.status = 'success'
    state.singleInternship = payload.data.data
  },

  ['INTERNSHIP_UPDATE_SUCCESS']: (state, payload) => {
    state.status = 'success'
    state.singleInternship = payload.data.data
  },

  ['INTERNSHIP_DELETE_SUCCESS']: state => {
    state.status = 'success'
  },

  ['INTERNSHIP_PREVIEW']: (state, data) => {
    state.status = 'success'
    console.log('preview', data)
    state.previewInternship = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
