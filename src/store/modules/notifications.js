import axios from '@/services/api'

import {
  NOTIFICATIONS_REQUEST,
  NOTIFICATIONS_GET_ALL,
  NOTIFICATIONS_GET_ALL_SUCCESS,
  NOTIFICATIONS_GET,
  NOTIFICATIONS_GET_SUCCESS,
  NOTIFICATIONS_UPDATE,
  NOTIFICATIONS_UPDATE_SUCCESS,
  NOTIFICATIONS_CREATE,
  NOTIFICATIONS_CREATE_SUCCESS,
  NOTIFICATIONS_DELETE,
  NOTIFICATIONS_DELETE_SUCCESS
} from '@/store/actions/notifications'

function initialState() {
  return {
    status: '',
    notifications: [],
    singlenotifications: {},
    notificationsTotalPages: 0,
    notificationsTotalRecord: 0
  }
}

const state = initialState()

const getters = {
  getNotificationsStatus: state => state.status,
  getAllNotifications: state => state.notifications,
  singleNotifications: state => state.singleNotifications,
  getNotificationsTotalPages: state => state.notificationsTotalPages,
  getNotificationsTotalRecord: state => state.notificationsTotalRecord
}

const actions = {
  [NOTIFICATIONS_GET_ALL]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('NOTIFICATIONS_REQUEST')
      axios
        .get(`/admin/news/lists`, { params })
        .then(response => {
          let data = response.data.data
          commit('NOTIFICATIONS_GET_ALL_SUCCESS', { data })

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
  [NOTIFICATIONS_GET]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('NOTIFICATIONS_REQUEST')
      axios
        .get(`/admin/news/${params.id}`)
        .then(response => {
          let data = response.data.data
          commit('NOTIFICATIONS_GET_SUCCESS', { data })

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
  [NOTIFICATIONS_CREATE]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('NOTIFICATIONS_REQUEST')
      axios
        .post(`/admin/news`, params)
        .then(response => {
          let data = response.data.data
          commit('NOTIFICATIONS_CREATE_SUCCESS', { data })

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
  [NOTIFICATIONS_UPDATE]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('NOTIFICATIONS_REQUEST')
      axios
        .put(`/admin/news/${params.id}`, params)
        .then(response => {
          let data = response.data.data
          commit('NOTIFICATIONS_UPDATE_SUCCESS', { data })

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

  [NOTIFICATIONS_DELETE]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      if (!params?.id) {
        return
      }

      dispatch('API_PROCESSING', true, { root: true })
      commit('NOTIFICATIONS_REQUEST')
      axios
        .delete(`/admin/news/${params.id}`)
        .then(response => {
          let data = response.data.data
          commit('NOTIFICATIONS_DELETE_SUCCESS', { data })

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
  [NOTIFICATIONS_REQUEST]: state => {
    state.status = 'loading'
  },

  [NOTIFICATIONS_GET_ALL_SUCCESS]: (state, params) => {
    state.status = 'success'
    state.notifications = params.data
    state.notificationsTotalPages = params.data.page.total
    state.notificationsTotalRecord = params.data.page.records.total
  },

  [NOTIFICATIONS_GET_SUCCESS]: (state, params) => {
    state.status = 'success'
    state.singleNotifications = params.data
  },

  [NOTIFICATIONS_CREATE_SUCCESS]: state => {
    state.status = 'success'
  },

  [NOTIFICATIONS_UPDATE_SUCCESS]: state => {
    state.status = 'success'
  },

  [NOTIFICATIONS_DELETE_SUCCESS]: state => {
    state.status = 'success'
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
