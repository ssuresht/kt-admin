<template>
  <v-select
    v-model="field.value"
    :class="field.class"
    :placeholder="field.placeholder"
    v-bind="$attrs"
    :items="times"
    color="grey"
  ></v-select>
</template>

<script>
export default {
  name: 'DatePicker',
  props: {
    field: {
      type: [Object],
      default: () => {
        return {
          class: '',
          value: '',
          placeholder: '00:00:00'
        }
      },
      required: true
    },
    start_time: {
      type: String,
      default: '08:00:00',
      required: false
    },
    end_time: {
      type: String,
      default: '19:00:00',
      required: false
    },
    interval: {
      type: [String, Number],
      default: 15,
      required: false
    },
    errors: {
      type: [String, Object, Array],
      default: () => {
        return ''
      },
      required: false
    }
  },
  data() {
    return {
      times: []
    }
  },
  created() {
    this.times = this.gettimes()
  },
  methods: {
    gettimes() {
      // transform the start_time and end_time to Date for easier comparison.
      let startTime = new Date(`1/1/1970 ${this.start_time}`)
      const endTime = new Date(`1/1/1970 ${this.end_time}`)

      // This interval is in Minutes.
      const interval = parseInt(this.interval) * 60000

      // The result array where we will store the time
      const results = []

      while (startTime.getTime() <= endTime.getTime()) {
        results.push(`${this.formatTime(startTime)}`)
        startTime = new Date(startTime.getTime() + interval)
      }

      return results
    },
    formatTime(date) {
      const hours = date
        .getHours()
        .toString()
        .padStart(2, '0')
      const minutes = date
        .getMinutes()
        .toString()
        .padStart(2, '0')
      const seconds = date
        .getSeconds()
        .toString()
        .padStart(2, '0')
      return `${hours}:${minutes}`
    }
  }
}
</script>
