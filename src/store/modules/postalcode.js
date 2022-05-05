import axios from '@/services/api'

import {
  POSTAL_CODE_REQUEST,
  POSTAL_CODE_GET_ALL,
  POSTAL_CODE_GET_ALL_ERROR,
  POSTAL_CODE_GET_ALL_SUCCESS
} from '@/store/actions/postalcode'

function initialState() {
  return {
    status: '',
    postalcodes: []
  }
}

const state = initialState()

const getters = {
  getPostalcodes: state => state.postalcodes
}

const actions = {
  [POSTAL_CODE_GET_ALL]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      dispatch('API_PROCESSING', true, { root: true })
      commit('POSTAL_CODE_REQUEST')
      axios
        .get(`https://geoapi.heartrails.com/api/json?method=searchByPostal`, {
          params
        })
        .then(response => {
          let data = response?.data?.response
          commit('POSTAL_CODE_GET_ALL_SUCCESS', { data })

          resolve(response)
        })
        .catch(err => {
          commit('POSTAL_CODE_GET_ALL_ERROR')
          reject(err)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  }
}

const mutations = {
  [POSTAL_CODE_REQUEST]: state => {
    state.status = 'loading'
  },

  [POSTAL_CODE_GET_ALL_SUCCESS]: (state, params) => {
    state.status = 'success'
    state.postalcodes = params?.location
  },

  [POSTAL_CODE_GET_ALL_ERROR]: (state, params) => {
    state.status = 'success'
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
