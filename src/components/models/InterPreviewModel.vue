<template>
  <!-- SimpleModel Dialog -->
  <v-dialog v-model="selfDialog" max-width="775" content-class="no-shadow">
    <template v-slot:default>
      <v-card class="pa-15">
        <v-card-text class="pb-5">
          <h6 class="fw-400 font-20px text-light-dark text-center ma-0">
            プレビューリンク作成
          </h6>
          <div class="d-block my-8">
            <!-- Roll: spacer -->
            &nbsp;
          </div>
          <div class="d-flex align-center justify-center">
            <v-text-field
              hide-details
              solo
              dense
              outlined
              single-line
              color="#13ABA3"
              class="mr-3"
              v-model="getPreviewPageURL"
            >
            </v-text-field>
            <v-btn
              width="84"
              @click="copyURL()"
              height="35"
              color="#B8B8B8"
              class="white--text"
            >
              コピー
            </v-btn>
          </div>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            outlined
            color="primary"
            min-width="236"
            class="mr-6"
            @click.prevent="selfDialog = false"
          >
            戻る
          </v-btn>
          <v-btn
            color="primary"
            class="white--text"
            min-width="236"
            @click.prevent="openPreviewURL()"
          >
            プレビュー確認
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
    }
  },
  computed: {
    getPreviewPageURL: {
      get() {
        return this.$store.getters.getPreviewPageURL
      },
      set(value) {
        return value
      }
    },
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
    openPreviewURL() {
      window.open(this.getPreviewPageURL, '_blank')
    },
    async copyURL() {
      try {
        await navigator.clipboard.writeText(this.getPreviewPageURL)
        alert('Copied')
      } catch ($e) {
        alert('Cannot copy')
      }
    }
  }
}
</script>
<style lang="css" scope></style>
