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
                  <span>教育機関タイプ</span>
                </label>
                <validation-provider
                  v-slot="{ errors }"
                  name="教育機関タイプ"
                  rules="required:教育機関タイプ s"
                >
                  <v-select
                    :error-messages="errors"
                    :error="errors.length !== 0"
                    :hide-details="errors.length <= 0"
                    outlined
                    dense
                    :items="getEducationFacilityType"
                    v-model="fields.type"
                    item-text="name"
                    :item-value="t => t"
                    placeholder="選択してください"
                  >
                  </v-select>
                </validation-provider>
              </div>
              <div class="input-width pt-2">
                <label class="d-block font-14px mb-1">
                  <span>大学名</span>
                </label>
                <validation-provider
                  v-slot="{ errors }"
                  name="大学名"
                  rules="required:大学名 "
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
                @click="updateEducationFacility"
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
import { mapGetters } from 'vuex'
export default {
  name: 'SchoolDialog',
  data() {
    return {
      fields: {
        type: "",
        name: ""
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
        this.fields.type = this.item.type
        this.fields.name = this.item.name
      }
    }
  },
  computed: {
    ...mapGetters(['getEducationFacilityType']),
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
          this.fields.type = this.fields.type.id
          this.$store.dispatch('FACILITIES_CREATE', this.fields).then(() => {
            this.$emit('refresh')
            this.getLaunch = false
          })
        }
      })
    },
    updateEducationFacility() {
      this.$refs.observer.validate().then(success => {
        if (success) {
          let selectedType = this.fields.type
          this.fields.id = this.item.id
          this.fields.type = this.fields.type.id
          this.$store.dispatch('FACILITIES_EDIT', this.fields).then(() => {
            this.getLaunch = false
            this.item.name = this.fields.name
            this.item.type = selectedType
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
