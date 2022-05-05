import Vue from 'vue'
import i18n from '@/plugins/i18n'
import {
  ValidationProvider,
  ValidationObserver,
  extend
} from 'vee-validate/dist/vee-validate.full'

import {
  required,
  email,
  max,
  min,
  size,
  max_value,
  min_value,
  confirmed,
  integer,
  regex,
  ext
} from 'vee-validate/dist/rules.umd'

const maxDimensionsRule = {
  getMessage(field, [width, height], data) {
    return (
      (data && data.message) ||
      `The ${field} field must be UP TO ${width} pixels by ${height} pixels.`
    )
  },
  validate(files, [width, height]) {
    const validateImage = (file, width, height) => {
      const URL = window.URL || window.webkitURL
      return new Promise(resolve => {
        const image = new Image()
        image.onerror = () => resolve({ valid: false })
        image.onload = () =>
          resolve({
            valid:
              image.width <= Number(width) && image.height <= Number(height) // only change from official rule
          })

        image.src = URL.createObjectURL(file)
      })
    }
    const list = []
    for (let i = 0; i < files.length; i++) {
      // if file is not an image, reject.
      if (!/\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(files[i].name)) {
        return false
      }
      list.push(files[i])
    }
    return Promise.all(list.map(file => validateImage(file, width, height)))
  }
}

extend('required', {
  ...required,
  message(value, placeholders) {
    if (placeholders.args && typeof placeholders.args != 'undefined') {
      return (
        placeholders.args + i18n.t('field_required_message_with_field_name')
      )
    } else {
      return i18n.t('field_required_message')
    }
  },
  params: ['args']
})

extend('maxDimensions', {
  ...maxDimensionsRule,
  message: i18n.t('dimension')
})
extend('integer', {
  ...integer,
  message: i18n.t('数字のみ入力してください。')
})

extend('max', {
  ...max,
  message: i18n.t('field_max_message')
})

extend('ext', ext)
// extend('dimensions',{
//   ...dimensions,
//   message: i18n.t('The dimensions must be bigger than 250 * 250')
// })

extend('min', {
  ...min,
  message: i18n.t('field_min_message')
})

extend('size', {
  ...size,
  message: i18n.t('field_size_message')
})

extend('email', {
  ...email,
  message: i18n.t('field_email_message')
})

extend('min_value', {
  ...min_value,
  message: i18n.t('field_min_value_message')
})

extend('max_value', {
  ...max_value,
  message: i18n.t('field_max_value_message')
})

extend('url', {
  message: i18n.t('field_must_be_url_message'),
  validate: value => {
    if (value) {
      return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
        value
      )
    }

    return false
  }
})

extend('password_confirmed', {
  ...confirmed,
  message: i18n.t('field_password_confirmed_message')
})
extend('regex', regex)

extend('verify_password', {
  message: i18n.t('field_verify_password_message'),
  validate: value => {
    var strongRegex = new RegExp(
      '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
    )
    let length = value.length
    return strongRegex.test(value) && length >= 8 && length <= 20
  }
})

extend('only_english_lang_allowed', {
  message: `Only english charactor's are allowed`,
  validate: value => {
    // validation allowing only english language
    var strongRegex = new RegExp(`[^\u0000-\u0080]+`)
    return !strongRegex.test(value)
  }
})

extend('enter_half_width_numbers_hyphens', {
  message: i18n.t('field_enter_half_width_numbers_hyphens'),
  validate: value => {
    // validation allowing only english language

    let regexElevenPhoneHyphen = /^\(?\d{3}\)?[-]?(\d{4})[-]?(\d{4})$|^\(?\d{3}\)?[-]?(\d{3})[-]?(\d{4})$|^\(?\d{2}\)?[-]?(\d{4})[-]?(\d{4})$|^\(?\d{4}\)?[-]?(\d{2})[-]?(\d{4})$|^\(?\d{4}\)?[-]?(\d{3})[-]?(\d{3})$|^\(?\d{5}\)?[-]?(\d{1})[-]?(\d{4})$/
    let regexTenPhoneHyphen = /^(1-)?\d{3}-\d{3}-\d{4}$/
    return regexElevenPhoneHyphen.test(value)
      ? true
      : regexTenPhoneHyphen.test(value) // Validate 10 or 11 digit phone number hyphens
  }
})

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
