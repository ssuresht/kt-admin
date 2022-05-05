<template>
  <v-text-field
    v-model="_value"
    :placeholder="placeholder"
    v-bind="$attrs"
    :append-icon="appendToggleEye ? (fieldType ? '$EyeClose' : '$EyeOpen') : ''"
    @click:append="() => (fieldType = !fieldType)"
    :type="fieldType ? 'password' : 'text'"
  >
  </v-text-field>
</template>

<script>
export default {
  name: 'InputPassword',
  data() {
    return {
      fieldType: String
    }
  },
  props: {
    appendToggleEye: {
      type: Boolean,
      default: false,
      required: false
    },
    value: {
      type: String,
      default: '',
      required: true
    },
    label: {
      type: String,
      default: function() {
        return this.$t('password')
      },
      required: false
    },
    placeholder: {
      type: String,
      default: function() {
        return 'パスワード'
      },
      required: false
    },
    name: {
      type: String,
      default: 'password',
      required: false
    }
  },
  computed: {
    _value: {
      get: function() {
        return this.value
      },
      set: function(newValue) {
        this.$emit('input', newValue)
      }
    }
  }
}
</script>

<style scoped></style>
