import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import auth from './modules/auth'
import corporate from './modules/corporate'
import application from './modules/application'
import feedback from './modules/feedback'
import plans from './modules/plans'
import users from './modules/users'
import postalcode from './modules/postalcode'
import notifications from './modules/notifications'
import faqs from './modules/faqs'
import admins from './modules/admins'
import dashboards from './modules/dashboards'
import chats from './modules/chats'
import master from './modules/master'
import internship from './modules/internship'
import company from './modules/company'
import facilities from './modules/educational_facilities'
import internshipFeatures from './modules/internship_features'
import internshipOccupation from './modules/internship_occupation'
import student from './modules/student'
import mediaPosts from './modules/media_posts'
import mediaTags from './modules/media_tags'
Vue.use(Vuex)

const getDefaultState = () => {
  return {
    apiProcessing: false,
    alert: false,
    drawer: true,
    alertText: '',
    alertSuccess: false,
    errors: {}
  }
}

export default new Vuex.Store({
  state: getDefaultState(),

  mutations: {
    toggleDrawer(state) {
      state.drawer = !state.drawer
    },
    showAlert(state, { text, successStatus }) {
      state.alert = true
      state.alertText = text
      state.alertSuccess = successStatus
    },
    hideAlert(state) {
      state.alert = false
    },
    setApiProcessing(state, payload) {
      state.apiProcessing = payload
    },
    setFormErrors(state, payload) {
      state.errors = payload
    },
    clearFormErrors(state) {
      state.errors = {}
    }
  },

  actions: {
    TOGGLE_DRAWER({ commit }) {
      commit('toggleDrawer')
    },
    API_PROCESSING({ commit }, payload) {
      commit('setApiProcessing', payload)
    },
    SHOW_ALERT({ commit }, payload) {
      commit('showAlert', payload)
    }
  },

  getters: {
    DRAWER_STATE(state) {
      return state.drawer
    },
    getApiProcessingStatus: state => state.apiProcessing,
    getAlertStatus: state => state.alert,
    getAlertText: state => state.alertText,
    getAlertSuccess: state => state.alertSuccess,
    getErrors: state => state.errors
  },

  modules: {
    auth,
    corporate,
    plans,
    users,
    postalcode,
    notifications,
    faqs,
    admins,
    dashboards,
    chats,
    master,
    internship,
    company,
    facilities,
    student,
    internshipFeatures,
    internshipOccupation,
    mediaPosts,
    mediaTags,
    application,
    feedback
  },

  plugins: [createPersistedState()]
})
