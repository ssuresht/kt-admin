import axios from '@/services/api'

import {
  PLANS_REQUEST,
  PLANS_GET_ALL,
  PLANS_GET_ALL_SUCCESS,
  PLANS_GET,
  PLANS_GET_SUCCESS,
  PLANS_UPDATE,
  PLANS_UPDATE_SUCCESS
} from '@/store/actions/plans'

function initialState() {
  return {
    status: '',
    plans: [],
    singlePlan: {},
    planTotalPages: 0,
    planTotalRecord: 0
  }
}

const state = initialState()

const getters = {
  getAllPlans: state => state.plans,
  singlePlan: state => state.singlePlan,
  getPlanTotalPages: state => state.planTotalPages,
  getPlanTotalRecord: state => state.planTotalRecord
}

const actions = {
  [PLANS_GET_ALL]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('PLANS_REQUEST')
      axios
        .get(`/admin/plans`, { params })
        .then(response => {
          let data = response.data.data
          commit('PLANS_GET_ALL_SUCCESS', { data })

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
  [PLANS_REQUEST]: state => {
    state.status = 'loading'
  },

  [PLANS_GET_ALL_SUCCESS]: (state, params) => {
    state.status = 'success'
    state.plans = params.data.plans
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
