<template>
  <v-app class="pa-0">
    <Header />
    <Sidebar />
    <v-main class="content">
      <router-view />
      <!-- <Footer /> -->
    </v-main>
    <div
      class="loader-application d-flex align-center justify-center"
      v-if="$store.getters.getApiProcessingStatus"
    >
      <v-progress-circular
        size="64"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>
  </v-app>
</template>

<script>
import Header from '@/components/admin/partials/Header/Header'
import Sidebar from '@/components/admin/partials/Sidebar/Sidebar'
// import Footer from '@/components/admin/partials/Footer/Footer'
import './Layout.scss'

export default {
  name: 'Layout',
  components: { Header, Sidebar }
}
</script>

<style src="./Layout.scss" lang="scss" />
