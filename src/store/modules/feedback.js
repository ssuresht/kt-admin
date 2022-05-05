import axios from '@/services/api'

function initialState() {
  return {
    status: '',
    feedbacks: [],
    singleFeedback: {},
    feedbackCounts: {},
    feedbackPagination: 0
  }
}

const state = initialState()

const getters = {
  getFeedbacksStatus: state => state.status,
  getAllFeedbacks: state => state.feedbacks,
  getSingleFeedback: state => state.singleFeedback,
  getFeedbackCounts: state => state.feedbackCounts,
  getFeedbackPagination: state => state.feedbackPagination
}

const actions = {
  ['FEEDBACK_GET_ALL']: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('FEEDBACK_REQUEST')
      axios
        .get(`/admin/feedback`, { params })
        .then(response => {
          let data = response.data.data
          commit('FEEDBACK_GET_ALL_SUCCESS', { data })

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

  ['FEEDBACK_GET']: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('FEEDBACK_REQUEST')
      axios
        .get(`/admin/feedback/${params.id}`)
        .then(response => {
          let data = response.data
          commit('FEEDBACK_GET_SUCCESS', { data })

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

  ['FEEDBACK_CREATE']: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('FEEDBACK_REQUEST')
      axios
        .post(`/admin/feedback`, params)
        .then(response => {
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

  ['FEEDBACK_UPDATE']: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('FEEDBACK_REQUEST')
      axios
        .put(`/admin/feedback/${params.id}`, params)
        .then(response => {
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
  ['FEEDBACK_REQUEST']: state => {
    state.status = 'loading'
  },

  ['FEEDBACK_GET_ALL_SUCCESS']: (state, { data }) => {
    state.status = 'success'
    state.feedbacks = data.data
    state.feedbackPagination = data.paginate
    state.feedbackCounts = data.counts
  },

  ['FEEDBACK_GET_SUCCESS']: (state, { data }) => {
    state.status = 'success'
    state.singleFeedback = data.data.data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
