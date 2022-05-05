import axios from '@/services/api'

import {
  CHATS_REQUEST,
  CHATS_GET_ALL,
  CHATS_GET_ALL_SUCCESS,
  CHATS_GET,
  CHATS_GET_SUCCESS,
  CHATS_SAVE_FAVORITE,
  CHATS_SAVE_FAVORITE_SUCCESS
} from '@/store/actions/chats'

function initialState() {
  return {
    chats: [],
    singleChat: {},
    chatTotalPages: 0,
    chatTotalRecord: 0
  }
}

const state = initialState()

const getters = {
  singleChat: state => state.chat,
  getAllChats: state => state.chats,
  getChatTotalPages: state => state.chatTotalPages,
  getChatTotalRecord: state => state.chatTotalRecord
}

const actions = {
  [CHATS_GET_ALL]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('CHATS_REQUEST')
      axios
        .get(`/admin/chats/admin/list`, { params })
        .then(response => {
          let data = response.data
          commit('CHATS_GET_ALL_SUCCESS', { data })

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

  [CHATS_GET]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      axios
        .get(`/admin/chats/admin/${params.id}`)
        .then(resp => {
          var data = resp.data
          commit('CHATS_GET_SUCCESS', { data })
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  },

  [CHATS_SAVE_FAVORITE]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      axios
        .post(`/admin/chats/admin/favorite`, params)
        .then(resp => {
          var data = resp.data
          commit('CHATS_SAVE_FAVORITE_SUCCESS', { data })
          resolve(resp)
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
  [CHATS_REQUEST]: state => {
    state.status = 'loading'
  },

  [CHATS_GET_ALL_SUCCESS]: (state, params) => {
    state.status = 'success'
    state.chats = params.data.chats
    state.chatTotalPages = params.data.paginate.page.current
    state.chatTotalRecord = params.data.paginate.page.records.total
  },

  [CHATS_GET_SUCCESS]: (state, params) => {
    state.status = 'success'
    state.chat = params.data.chats
  },

  [CHATS_SAVE_FAVORITE_SUCCESS]: state => {
    state.status = 'success'
  }
}

export default {
  actions,
  mutations,
  getters,
  state
}
