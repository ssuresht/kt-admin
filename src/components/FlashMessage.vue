<template>
  <div>
    <transition-group name="fade">
      <p v-if="message" class="green--text ma-0" key="message">
        {{ message }}
      </p>
      <p
        v-if="error && getType(error) === 'string'"
        class="red--text ma-0"
        key="error"
      >
        {{ error }}
      </p>
      <ul
        v-if="getType(error) === 'object'"
        class="red--text pa-0 ma-0"
        key="error-list"
      >
        <li v-for="key in errorKeys" :key="key">
          <b class="font-bold capitalize">{{ key | titleCase }}</b> :
          <ul class="comma-list">
            <li v-for="(item, index) in getErrors(key)" :key="`${index}-error`">
              {{ item }}
            </li>
          </ul>
        </li>
      </ul>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'FlashMessage',
  props: {
    message: {
      type: String,
      default: null
    },
    error: {
      type: [Object, String],
      default: null
    }
  },
  computed: {
    errorKeys() {
      if (!this.error || this.getType(this.error) === 'string') {
        return null
      }
      return Object.keys(this.error)
    }
  },
  methods: {
    getErrors(key) {
      return this.error[key]
    },
    getType(obj) {
      return Object.prototype.toString
        .call(obj)
        .slice(8, -1)
        .toLowerCase()
    }
  },
  filters: {
    titleCase(value) {
      return value.replace('_', ' ')
    }
  }
}
</script>

<style scoped>
ol,
ul {
  list-style: none;
}
.comma-list {
  display: inline;
  list-style: none;
  padding: 0px;
}
.comma-list li {
  display: inline;
}
.comma-list li::after {
  content: ', ';
}
.comma-list li:last-child::after {
  content: '';
}
</style>
