import axios from '@/services/api'
import {
  STUDENT_CSV,
  GET_EDUCATION__FACILITY_DATA,
  STUDENT_GET_ALL,
  STUDENT_REQUEST,
  STUDENT_GET_ALL_SUCCESS,
  GET_STUDENT_FEEDBACK,
  GET_STUDENT_FEEDBACK_SUCCESS
} from '../actions/student'

function initialState() {
  return {
    status: '',
    student: [],
    singleStudent: {},
    studentPagination: null,
    studentCsvData: null,
    educationFacilities: null,
    getTotalStudentActive: null,
    getTotalStudentInactive: null,
    getMembershipCancelled: null,
    studentFeedback: null,
    studentComments: null
  }
}
const state = initialState()

const getters = {
  getAllStudent: state => state.student,
  getStudentCsvData: state => state.studentCsvData,
  getEducationFacilities: state => state.educationFacilities,
  getSingleStudent: state => state.singleStudent,
  getStudentPagination: state => state.studentPagination,
  getTotalStudentActive: state => state.totalStudentActive,
  getTotalStudentInactive: state => state.totalStudentInactive,
  getMembershipCancelled: state => state.totalMembershipCancelled,
  getStudentFeedback: state => state.studentFeedback,
  getStudentComments: state => state.studentComments
}

const actions = {
  [GET_STUDENT_FEEDBACK]: ({ commit, dispatch }, params) => {
    dispatch('API_PROCESSING', true, { root: true })
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/student-feedback/${params}`)
        .then(response => {
          commit(GET_STUDENT_FEEDBACK_SUCCESS, response.data)
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
  [STUDENT_GET_ALL]: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      if (!params?.silent_loading) {
        dispatch('API_PROCESSING', true, { root: true })
      }
      commit('STUDENT_REQUEST')
      axios
        .get(`/admin/student`, { params })
        .then(response => {
          commit('STUDENT_GET_ALL_SUCCESS', response.data)
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

  [STUDENT_CSV]: ({ commit, dispatch }) => {
    dispatch('API_PROCESSING', true, { root: true })
    return new Promise((resolve, reject) => {
      axios
        .get('/admin/export/student')
        .then(response => {
          commit('STUDENT_EXPORT_CSV_SUCCESS', response.data.data.csv)
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
  [GET_EDUCATION__FACILITY_DATA]: ({ commit, dispatch }) => {
    dispatch('API_PROCESSING', true, { root: true })
    return new Promise((resolve, reject) => {
      axios
        .get('/admin/education-facility')
        .then(response => {
          commit('STUDENT_EDUCATION_FACILITY_SUCCESS', response.data)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
        .finally(() => {
          dispatch('API_PROCESSING', false, { root: true })
        })
    })
  }
}

const mutations = {
  [GET_STUDENT_FEEDBACK_SUCCESS]: (state, payload) => {
    state.studentComments = payload.data.comments
    state.studentFeedback = payload.data.feedbacks
  },
  [STUDENT_GET_ALL_SUCCESS]: (state, payload) => {
    state.status = 'success'
    state.student = payload.data.students || []
    state.studentPagination = payload.paginate
    state.totalStudentInactive = payload.data.totalStudentInactive
    state.totalStudentActive = payload.data.totalStudentActive
    state.totalMembershipCancelled = payload.data.membershipCancelled
  },

  [STUDENT_REQUEST]: state => {
    state.status = 'loading'
  },
  ['STUDENT_EXPORT_CSV_SUCCESS']: (state, payload) => {
    state.studentCsvData = payload
  },
  ['STUDENT_EDUCATION_FACILITY_SUCCESS']: (state, payload) => {
    state.educationFacilities = payload?.data?.education_facilities || []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
