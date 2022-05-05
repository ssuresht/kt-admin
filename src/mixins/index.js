import Vue from 'vue'

Vue.mixin({
  computed: {
    getMasterData() {
      return this.$store.getters.getMasterData
    }
  },
  methods: {
    numberFormat: x => {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    dateFormat(date, format = 'YYYY/MM/DD') {
      return this.$moment(date).format(format)
    },
    capitalizeFirstLetter: str => str.charAt(0).toUpperCase() + str.slice(1),
    showAlert(error, status = true) {
      let errorText = null
      if (typeof error === 'string') {
        errorText = error
      } else {
        errorText =
          this.$t(error?.data?.message) || this.$t(error?.data?.errors?.message)
      }
      this.$store.commit('showAlert', {
        text: errorText,
        successStatus: status
      })
    },
    /**
     * @param {date|moment} start The start date
     * @param {date|moment} end The end date
     * @param {string} type The range type. eg: 'days', 'hours' etc
     */
    getDateRange(startDate, endDate, type, formatedDate = 'YYYY/MM/DD') {
      let fromDate = this.$moment(startDate)
      let toDate = this.$moment(endDate)
      let diff = toDate.diff(fromDate, type)
      let range = []
      for (let i = 0; i < diff; i++) {
        range.push(
          this.$moment(startDate)
            .add(i, type)
            .format(formatedDate)
        )
      }
      return range
    }
  }
})
