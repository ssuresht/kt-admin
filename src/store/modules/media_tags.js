import axios from '@/services/api'

import {
  MEDIA_TAGS_REQUEST,
  MEDIA_TAGS_GET_ALL,
  MEDIA_TAGS_GET_ALL_SUCCESS,
  MEDIA_TAGS_GET_ALL_ERROR,
  MEDIA_TAGS_GET_SUCCESS,
  MEDIA_TAGS_DELETE,
  MEDIA_TAGS_EDIT,
  MEDIA_TAGS_CREATE
} from '@/store/actions/media_tags.js'

function initialState() {
  return {
    status: '',
    mediaTags: [],
    singleMediaTag: {},
    mediaTagsPagination: null
  }
}

const state = initialState()

const getters = {
  getAllMediaTags: state => state.mediaTags,
  getSingleMediaTag: state => state.singleMediaTag,
  getMediaTagsPagination: state => state.mediaTagsPagination
}

const actions = {
  [MEDIA_TAGS_GET_ALL]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('MEDIA_TAGS_REQUEST')
      axios
        .get(`/admin/media-tag`, { params })
        .then(response => {
          commit('MEDIA_TAGS_GET_ALL_SUCCESS', response.data)
          resolve(response)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  },
  [MEDIA_TAGS_EDIT]: ({ dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      axios
        .put(`/admin/media-tag/${params.id}`, params)
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
  [MEDIA_TAGS_CREATE]: ({ dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      axios
        .post(`/admin/media-tag`, params)
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
  [MEDIA_TAGS_DELETE]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('MEDIA_TAGS_REQUEST')
      axios
        .delete(`/admin/media-tag/${params}`)
        .then(response => {
          commit('MEDIA_TAGS_DELETE', response.data)
          resolve(response)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  }
}

const mutations = {
  [MEDIA_TAGS_REQUEST]: state => {
    state.status = 'loading'
  },

  [MEDIA_TAGS_GET_ALL_SUCCESS]: (state, payload) => {
    state.status = 'success'
    state.mediaTags = payload.data.media_tags || []
    state.mediaTagsPagination = payload.paginate
  },

  [MEDIA_TAGS_GET_SUCCESS]: (state, payload) => {
    state.status = 'success'
    state.singleMediaTag = payload.data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
