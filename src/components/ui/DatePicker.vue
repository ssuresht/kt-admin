<template>
  <v-menu
    v-if="field"
    v-model="field.menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :placeholder="field.placeholder"
        :class="field.class"
        v-model="field.value"
        @blur="field.date = parseDate(field.value)"
        v-bind="[$attrs, attrs]"
        v-on="on"
        readonly
        :disabled="disabled"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      :type="field.datePickerType"
      no-title
      @input="field.menu = false"
      locale="ja"
      :max="max"
      :min="min"
      :disabled="disabled"
      :day-format="changeDayFormat"
    ></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  name: 'DatePicker',
  props: {
    field: {
      type: [Object],
      default: () => {
        return {
          menu: false,
          locale: 'ja',
          value: '',
          placeholder: ''
        }
      },
      required: true
    },
    errors: {
      type: [String, Object, Array],
      default: () => {
        return ''
      },
      required: false
    },
    separator: {
      type: String,
      default: '/',
      required: false
    },
    max: {
      type: String,
      default: '',
      required: false
    },
    min: {
      type: String,
      default: '',
      required: false
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      date: this.$moment().format(`YYYY-MM-DD`)
    }
  },
  watch: {
    date(val) {
      this.field.value = this.formatDate(val)
      this.$emit('input', this.formatDate(val))
    }
  },
  created() {
    this.field.value = this.formatDate(this.field.value)
  },
  methods: {
    formatDate(date) {
      if (!date || date == '') return null

      if (this.field?.date_format) {
        return this.$moment(date)
          .locale(this.field.locale ?? 'ja')
          .format(this.field.date_format)
      } else {
        return this.$moment(date).format(
          `YYYY${this.separator}MM${this.separator}DD`
        )
      }
    },
    parseDate(date) {
      if (!date || date == '') return null

      return this.$moment(date).format(
        `YYYY${this.separator}MM${this.separator}DD`
      )
    },
    changeDayFormat(date) {
      return this.$moment(date).format('DD')
    }
  }
}
</script>
