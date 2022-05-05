<template>
  <v-dialog v-model="getLaunch" max-width="775px">
    <v-card :elevation="0" color="white" width="775px">
      <v-card-title
        v-if="edit"
        class="d-flex justify-center pt-15 pb-8 font-20px"
        >編集</v-card-title
      >
      <v-card-title v-else class="d-flex justify-center pt-15 pb-8 font-20px"
        >新規登録</v-card-title
      >
      <div class="d-flex flex-column align-center justify-space-between">
        <validation-observer ref="observer">
          <v-form @submit.prevent="submit">
            <div class="d-flex flex-column align-center justify-center">
              <div class="input-width pt-2">
                <label class="d-block font-14px mb-1">
                  <span>タグ名</span>
                </label>
                <validation-provider
                  v-slot="{ errors }"
                  name="タグ名"
                  rules="required:タグ名 "
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
                @click="updateMediaTag"
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
  name: 'MediaTagDialog',
  data() {
    return {
      fields: {
        name: null
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
      console.log(this.item)
      if (val && this.item) {
        this.fields.name = this.item.name
      } else {
        this.fields.name = null
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
          this.$store.dispatch('MEDIA_TAGS_CREATE', this.fields).then(() => {
            this.$emit('refresh')
            this.getLaunch = false
          })
        }
      })
    },
    updateMediaTag() {
      this.$refs.observer.validate().then(success => {
        if (success) {
          this.fields.id = this.item.id
          this.$store.dispatch('MEDIA_TAGS_EDIT', this.fields).then(() => {
            this.getLaunch = false
            this.item.name = this.fields.name
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" src="@/styles/forms.scss"></style>
<style lang="scss" scoped>
.input-width {
  width: 543px;
}
</style>
