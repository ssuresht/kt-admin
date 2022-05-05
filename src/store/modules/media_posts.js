import axios from '@/services/api'

function initialState() {
  return {
    status: '',
    allMedia: [],
    singleMedia: {},
    mediaPagination: null,
    mediaCounts: {}
  }
}

const state = initialState()

const getters = {
  getAllMedia: state => state.allMedia,
  getSingleMedia: state => state.singleMedia,
  getMediaPagination: state => state.mediaPagination,
  getMediaCounts: state => state.mediaCounts
}

const actions = {
  ['MEDIA_POST_GET_ALL']: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      axios
        .get(`/admin/media-post`, { params })
        .then(response => {
          commit('MEDIA_POST_GET_ALL_SUCCESS', response.data)
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

  ['MEDIA_POST_GET']: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      axios
        .get(`/admin/media-post/${params.id}`)
        .then(response => {
          commit('MEDIA_POST_GET_SUCCESS', response.data)

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

  ['MEDIA_POST_CREATE']: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      axios
        .post(`/admin/media-post`, params)
        .then(response => {
          let data = response.data.data
          commit('MEDIA_POST_CREATE_SUCCESS', { data })
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

  ['MEDIA_POST_UPDATE']: ({ commit, dispatch }, params) => {
    dispatch('API_PROCESSING', true, { root: true })
    return new Promise((resolve, reject) => {
      axios
        .post(`/admin/media-post-update/${params.get('id')}`, params)
        .then(response => {
          let data = response.data.data
          commit('MEDIA_POST_UPDATE_SUCCESS', { data })

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

  ['MEDIA_POST_DELETE']: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      if (!params?.id) {
        return
      }

      dispatch('API_PROCESSING', true, { root: true })
      commit('USERS_REQUEST')
      axios
        .delete(`/admin/media-post/${params.id}`)
        .then(response => {
          let data = response.data.data
          commit('MEDIA_POST_DELETE_SUCCESS', { data })
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
  ['MEDIA_POST_GET_ALL_SUCCESS']: (state, payload) => {
    state.status = 'success'
    state.allMedia = payload.data.data
    state.mediaPagination = payload.data.paginate
    state.mediaCounts = payload.data.counts
  },

  ['MEDIA_POST_GET_SUCCESS']: (state, payload) => {
    state.status = 'success'
    state.singleMedia = payload.data.data
  },

  ['MEDIA_POST_CREATE_SUCCESS']: state => {
    state.status = 'success'
  },

  ['MEDIA_POST_UPDATE_SUCCESS']: state => {
    state.status = 'success'
  },

  ['MEDIA_POST_DELETE_SUCCESS']: state => {
    state.status = 'success'
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
