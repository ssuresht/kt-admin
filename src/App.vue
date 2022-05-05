<template>
  <v-app class="pa-0 main-app-container">
    <v-progress-linear
      color="bg-green"
      style="z-index: 100"
      indeterminate
      :active="getApiProcessingStatus"
      fixed
      top
    ></v-progress-linear>
    <router-view />
    <v-snackbar
      v-model="alertStatus"
      :color="getAlertSuccess ? 'success' : ''"
      :timeout="10000"
    >
      {{ getAlertText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="alertStatus = false">
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  components: {},
  data() {
    return {}
  },
  async mounted() {
    await this.$store.dispatch('GET_MASTER_DATA')
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn
    },
    alertStatus: {
      get: function() {
        return this.$store.getters.getAlertStatus
      },
      set: function() {
        this.$store.commit('hideAlert')
      }
    },
    ...mapGetters(['getAlertText', 'getApiProcessingStatus', 'getAlertSuccess'])
  }
}
</script>

<style lang="css" scope>
.v-snack__wrapper.theme--dark.success {
  background-color: #4caf50;
  color: rgba(255, 255, 255, 0.87);
}
.v-snack__wrapper .v-snack__action {
  padding: 0 4px;
}
.v-snack__wrapper .v-snack__content {
  font-size: 1.1em;
  font-weight: 500;
}
</style>
