<template>
  <!-- SimpleModel Dialog -->
  <v-dialog v-model="selfDialog" max-width="775" content-class="no-shadow">
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
            v-if="!buttonOption.hideCancel"
            outlined
            color="primary"
            min-width="236"
            class="mr-6"
            @click.prevent="selfDialog = false"
          >
            {{ cancelButtonText }}
          </v-btn>
          <v-btn
            v-if="!buttonOption.hideSubmit"
            color="primary"
            class="white--text"
            min-width="236"
            @click.prevent="submit()"
            :loading="loading"
          >
            {{ submitButtonText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <!-- SimpleModel Dialog end -->
</template>

<script>
export default {
  name: 'SimpleModel',
  props: {
    dialog: {
      type: Boolean,
      default: false,
      required: true
    },
    text: {
      type: [String, Array],
      default: 'この企業情報を削除しますか？',
      required: false
    },
    submitButtonText: {
      type: String,
      default: '保存する',
      required: false
    },
    cancelButtonText: {
      type: String,
      default: '戻る',
      required: false
    },
    loading: {
      type: Boolean,
      default: false,
      required: false
    },
    buttonOption: {
      type: [Object],
      default: () => {
        return {
          hideSubmit: false,
          hideCancel: false
        }
      },
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
  methods: {
    submit() {
      this.$emit('submitSuccess', true)
    }
  }
}
</script>
<style lang="css" scope></style>
