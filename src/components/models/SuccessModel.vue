<template>
  <!-- Success Dialog -->
  <v-dialog
    v-model="selfDialog"
    persistent
    max-width="775"
    content-class="no-shadow"
  >
    <template v-slot:default>
      <v-card class="pa-15">
        <v-card-text class="pb-5">
          <template v-if="Array.isArray(text)">
            <div
              v-for="(tt, index) in text"
              :key="index"
              class="my-1 text-center d-flex justify-center align-center"
              :class="[index == 0 ? 'font-20px mb-7' : 'font-14px']"
              v-html="tt"
            ></div>
          </template>
          <template v-else>
            <div
              class="my-1 d-flex justify-center align-center font-20px"
              v-html="text"
            ></div>
          </template>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            color="primary"
            min-width="236"
            @click="$router.push({ name: routeName ? routeName : '' })"
          >
            {{ buttonText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <!-- Success Dialog end -->
</template>

<script>
export default {
  name: 'SuccessModel',
  props: {
    dialog: {
      type: Boolean,
      default: false,
      required: true
    },
    text: {
      type: [String, Array],
      default: '承認された登録',
      required: false
    },
    buttonText: {
      type: String,
      default: 'へ戻る',
      required: false
    },
    routeName: {
      type: String,
      default: '',
      required: false
    }
  },
  computed: {
    selfDialog: {
      get() {
        return this.dialog
      },
      set() {
        return this.$emit('closeModel', true)
      }
    }
  },
  watch: {
    selfDialog(val) {
      if (val) {
        this.$store.commit('hideAlert')
      }
    }
  }
}
</script>
<style lang="css" scope></style>
