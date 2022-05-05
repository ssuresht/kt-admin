<template>
  <v-dialog v-model="getLaunch" max-width="775px">
    <v-card :elevation="0" color="white" width="775px">
      <v-card-title class="d-flex justify-end pr-9 pb-2 pt-8">
        <v-btn
          color="transparent"
          @click="getLaunch = false"
          small
          class="pa-0"
          depressed
          ><v-icon size="22">$close</v-icon></v-btn
        >
      </v-card-title>
      <v-card-title
        v-if="edit"
        class="d-flex justify-center pt-0 pb-8 font-20px"
        >編集</v-card-title
      >
      <v-card-title v-else class="d-flex justify-center pt-0 pb-8 font-20px"
        >新規登録</v-card-title
      >
      <div class="d-flex flex-column align-center justify-space-between">
        <validation-observer ref="observer">
          <v-form>
            <div class="d-flex flex-column align-center justify-center">
              <div class="input-width">
                <label class="d-block font-14px mb-1">
                  <span>プルダウン表示項目</span>
                </label>
                <validation-provider
                  v-slot="{ errors }"
                  name="name"
                  rules="required:プルダウン表示項目"
                >
                  <v-text-field
                    :error-messages="errors"
                    :error="errors.length !== 0"
                    :hide-details="errors.length <= 0"
                    outlined
                    dense
                    v-model="fields.name"
                    placeholder="入力してください"
                  >
                  </v-text-field>
                </validation-provider>
              </div>

              <div class="input-width pt-2">
                <label class="d-block font-14px mb-1">
                  <span>位置</span>
                </label>
                <validation-provider
                  v-slot="{ errors }"
                  name="display_order"
                  rules=""
                >
                  <v-text-field
                    :error-messages="errors"
                    :error="errors.length !== 0"
                    :hide-details="errors.length <= 0"
                    outlined
                    dense
                    v-model="fields.display_order"
                    type="number"
                    placeholder="半角数字を入力してください"
                  >
                  </v-text-field>
                </validation-provider>
              </div>
            </div>
            <v-card-actions
              v-if="edit"
              class="d-flex justify-center pt-7 pb-16"
            >
              <v-btn
                outlined
                color="primary"
                width="188px"
                height="35px"
                @click="getLaunch = false"
                >戻る</v-btn
              >
              <v-btn
                color="primary"
                class="ml-5"
                width="188px"
                height="35px"
                @click="updateInternshipFeature"
                >保存</v-btn
              >
            </v-card-actions>
            <v-card-actions v-else class="d-flex justify-center pt-7 pb-16">
              <v-btn color="primary" @click="submit" width="188px" height="35px"
                >登録</v-btn
              >
            </v-card-actions>
          </v-form>
        </validation-observer>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'SchoolDialog',
  data() {
    return {
      fields: {
        name: null,
        display_order: null
      }
    }
  },
  props: {
    edit: {
      default: true
    },
    launch: {
      required: true
    },
    item: {
      required: false,
      default: null
    }
  },
  watch: {
    getLaunch: function(val) {
      if (val && this.item) {
        this.fields.name = this.item.name
        this.fields.display_order = this.item.display_order
      } else {
        this.fields.name = null
        this.fields.display_order = null
      }
    }
  },
  computed: {
    getLaunch: {
      get: function() {
        return this.launch
      },
      set: function(val) {
        this.$emit('update:launch', val)
      }
    }
  },
  methods: {
    submit() {
      this.$refs.observer.validate().then(success => {
        if (success) {
          this.$store
            .dispatch('INTERNSHIP_FEATURES_CREATE', this.fields)
            .then(() => {
              this.$emit('refresh')
              this.getLaunch = false
            })
            .catch(error => {
              if (error?.status == 422) {
                this.$refs.observer.setErrors(
                  error?.data?.error?.errors || error?.data?.errors
                )
              }
            })
        }
      })
    },
    updateInternshipFeature() {
      this.$refs.observer.validate().then(success => {
        if (success) {
          this.fields.id = this.item.id
          this.$store
            .dispatch('INTERNSHIP_FEATURES_EDIT', this.fields)
            .then(() => {
              this.getLaunch = false
              this.item.name = this.fields.name
              this.item.display_order = this.fields.display_order
            })
            .catch(error => {
              if (error?.status == 422) {
                this.$refs.observer.setErrors(
                  error?.data?.error?.errors || error?.data?.errors
                )
              }
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.input-width {
  width: 543px;
}
</style>
