import axios from '@/services/api'

import {
  DASHBOARDS_REQUEST,
  DASHBOARDS_GET_ALL,
  DASHBOARDS_GET_ALL_SUCCESS
} from '@/store/actions/dashboards'

function initialState() {
  return {
    status: '',
    dashboards: []
  }
}

const state = initialState()

const getters = {
  getAllDashboard: state => state.dashboards
}

const actions = {
  [DASHBOARDS_GET_ALL]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      axios
        .get(`/admin/admin/dashboard/${params.id}`)
        .then(response => {
          let data = response.data
          commit('DASHBOARDS_GET_ALL_SUCCESS', { data })

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
  [DASHBOARDS_GET_ALL_SUCCESS]: (state, params) => {
    state.status = 'success'
    state.dashboards = params.data.data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
