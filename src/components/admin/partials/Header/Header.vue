<template>
  <v-app-bar class="main-header" height="64" fixed color="whie">
    <v-btn icon class="mx-1" @click.stop="TOGGLE_DRAWER">
      <v-icon size="28" color="#fff">mdi-menu</v-icon>
    </v-btn>
    <v-icon size="60">$Logo</v-icon>
    <v-spacer></v-spacer>

    <v-chip
      class="mr-0 font-14px no-background-hover"
      color="#fff"
      depressed
      v-if="user"
    >
      {{ user.name }} さん
    </v-chip>
  </v-app-bar>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Header',
  data: () => ({
    user: null
  }),
  watch: {
    "$store.state.auth.user": function() {
      this.user = this.$store.state.auth.user;
    }
  },
  computed: {
    ...mapState({
      drawer: state => state.drawer
    }),
    DRAWER_STATE: {
      get() {
        return this.drawer
      }
    }
  },
  methods: {
    ...mapActions(['TOGGLE_DRAWER'])
  },
  mounted() {
    this.user = this.$store.state.auth.user;
  }
}
</script>

<style src="./Header.scss" lang="scss"></style>
