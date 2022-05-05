import axios from '@/services/api'

import {
  FAQS_REQUEST,
  FAQS_GET_ALL,
  FAQS_GET_ALL_SUCCESS,
  FAQS_GET,
  FAQS_GET_SUCCESS,
  FAQS_CREATE,
  FAQS_CREATE_SUCCESS,
  FAQS_UPDATE,
  FAQS_UPDATE_SUCCESS,
  FAQS_DELETE,
  FAQS_DELETE_SUCCESS,
  FAQS_CATEGORIES,
  FAQS_CATEGORIES_SUCCESS
} from '@/store/actions/faqs'

function initialState() {
  return {
    status: '',
    faqs: [],
    singleFaq: {},
    faqCategories: {},
    faqsTotalPages: 0,
    faqsTotalRecord: 0
  }
}

const state = initialState()

const getters = {
  getfaqsStatus: state => state.status,
  getAllFaqs: state => state.faqs,
  singleFaq: state => state.singleFaq,
  getFaqCategories: state => state.faqCategories,
  getFaqsTotalPages: state => state.faqsTotalPages,
  getFaqsTotalRecord: state => state.faqsTotalRecord
}

const actions = {
  [FAQS_GET_ALL]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('FAQS_REQUEST')
      axios
        .get(`/admin/faqs`, { params })
        .then(response => {
          let data = response.data.data
          commit('FAQS_GET_ALL_SUCCESS', { data })

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
  [FAQS_CATEGORIES]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('FAQS_REQUEST')
      axios
        .get(`/admin/faqs/categories`, { params })
        .then(response => {
          let data = response.data
          commit('FAQS_CATEGORIES_SUCCESS', { data })

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
  [FAQS_GET]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('FAQS_REQUEST')
      axios
        .get(`/admin/faq/${params.id}`)
        .then(response => {
          let data = response.data.data
          commit('FAQS_GET_SUCCESS', { data })

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

  [FAQS_CREATE]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('FAQS_REQUEST')
      axios
        .post(`/admin/faq`, params)
        .then(response => {
          let data = response.data.data
          commit('FAQS_CREATE_SUCCESS', { data })

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

  [FAQS_UPDATE]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('FAQS_REQUEST')
      axios
        .put(`/admin/faq/${params.id}`, params)
        .then(response => {
          let data = response.data.data
          commit('FAQS_UPDATE_SUCCESS', { data })

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

  [FAQS_DELETE]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      if (!params?.id) {
        return
      }

      dispatch('API_PROCESSING', true, { root: true })
      commit('FAQS_REQUEST')
      axios
        .delete(`/admin/faq/${params.id}`)
        .then(response => {
          let data = response.data.data
          commit('FAQS_DELETE_SUCCESS', { data })

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
  [FAQS_REQUEST]: state => {
    state.status = 'loading'
  },

  [FAQS_GET_ALL_SUCCESS]: (state, params) => {
    state.status = 'success'
    state.faqs = params.data
    state.faqsTotalPages = params.data.page.total
    state.faqsTotalRecord = params.data.page.records.total
  },

  [FAQS_GET_SUCCESS]: (state, params) => {
    state.status = 'success'
    state.singleFaq = params.data
  },

  [FAQS_UPDATE_SUCCESS]: state => {
    state.status = 'success'
  },

  [FAQS_CATEGORIES_SUCCESS]: (state, params) => {
    state.status = 'success'
    state.faqCategories = params.data
  },

  [FAQS_CREATE_SUCCESS]: state => {
    state.status = 'success'
  },

  [FAQS_DELETE_SUCCESS]: state => {
    state.status = 'success'
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
