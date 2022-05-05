<template>
  <div class="full-width border-radius elevation">
    <div
      class=" form white d-flex flex-column align-center justify-center h-585"
    >
      <validation-observer ref="observer">
        <v-form @submit.prevent="submit">
          <div
            class="d-flex flex-column ma-4 align-center justify-center main "
          >
            <div class="d-flex justify-space-between full-width ">
              <div id="details">
                <v-row justify="space-between" no-gutters>
                  <!-- surname -->
                  <v-col cols="auto">
                    <div class="input-width">
                      <label class="d-block font-14px mb-1">
                        <span>姓</span>
                      </label>
                      <validation-provider
                        v-slot="{ errors }"
                        name="姓"
                        rules="required"
                      >
                        <v-text-field
                          :error-messages="errors"
                          :error="errors.length !== 0"
                          :hide-details="errors.length <= 0"
                          outlined
                          dense
                          v-model="form.family_name"
                        >
                        </v-text-field>
                      </validation-provider>
                    </div>
                  </v-col>
                  <!-- name -->
                  <v-col cols="auto">
                    <div class="input-width ">
                      <label class="d-block font-14px mb-1">
                        <span>名</span>
                      </label>
                      <validation-provider
                        v-slot="{ errors }"
                        name="名"
                        rules="required"
                      >
                        <v-text-field
                          outlined
                          :error-messages="errors"
                          :error="errors.length !== 0"
                          :hide-details="errors.length <= 0"
                          dense
                          v-model="form.first_name"
                        >
                        </v-text-field>
                      </validation-provider>
                    </div>
                  </v-col>
                  <!-- surname -->
                  <v-col cols="auto" class="mt-2">
                    <div class="input-width ">
                      <label class="d-block font-14px mb-1">
                        <span>セイ</span>
                      </label>
                      <validation-provider
                        v-slot="{ errors }"
                        name="セイ"
                        rules="required"
                      >
                        <v-text-field
                          outlined
                          :error-messages="errors"
                          :error="errors.length !== 0"
                          :hide-details="errors.length <= 0"
                          dense
                          v-model="form.family_name_furigana"
                        >
                        </v-text-field>
                      </validation-provider>
                    </div>
                  </v-col>
                  <!-- name -->
                  <v-col cols="auto" class="mt-2">
                    <div class="input-width ">
                      <label class="d-block font-14px mb-1">
                        <span>メイ</span>
                      </label>
                      <validation-provider
                        v-slot="{ errors }"
                        name="セイ"
                        rules="required"
                      >
                        <v-text-field
                          outlined
                          :error-messages="errors"
                          :error="errors.length !== 0"
                          :hide-details="errors.length <= 0"
                          dense
                          v-model="form.first_name_furigana"
                        >
                        </v-text-field>
                      </validation-provider>
                    </div>
                  </v-col>
                  <!-- email -->
                  <v-col cols="12" class="mt-2">
                    <label class="d-block font-14px mb-1">
                      <span>メールアドレス</span>
                    </label>
                    <validation-provider
                      v-slot="{ errors }"
                      name="メールアドレス"
                      rules="required|email"
                    >
                      <v-text-field
                        outlined
                        :error-messages="errors"
                        :error="errors.length !== 0"
                        :hide-details="errors.length <= 0"
                        dense
                        v-model="form.email_valid"
                      >
                      </v-text-field>
                    </validation-provider>
                  </v-col>
                  <!-- school name -->
                  <v-col cols="12" class="mt-2">
                    <label class="d-block font-14px mb-1">
                      <span>学校名</span>
                    </label>
                    <validation-provider
                      v-slot="{ errors }"
                      name="学校名"
                      rules="required"
                    >
                      <v-autocomplete
                        outlined
                        :error-messages="errors"
                        :error="errors.length !== 0"
                        :hide-details="errors.length <= 0"
                        dense
                        v-model="form.education_facility_id"
                        :items="getEducationFacilities"
                        item-text="name"
                        item-value="id"
                      >
                      </v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <!-- year to graduate  -->
                  <v-col cols="12" class="mt-2">
                    <label class="d-block font-14px mb-1">
                      <span>卒業予定年</span>
                    </label>
                    <div class="d-flex justify-center align-baseline">
                      <!-- year -->
                      <validation-provider
                        v-slot="{ errors }"
                        name="年"
                        rules="required"
                      >
                        <v-select
                          outlined
                          :error-messages="errors"
                          :error="errors.length !== 0"
                          :hide-details="errors.length <= 0"
                          :items="yearList"
                          dense
                          v-model="form.year"
                        >
                        </v-select>
                      </validation-provider>
                      <label class="font-14px ml-4 mr-3">
                        <span>年</span>
                      </label>
                      <validation-provider
                        v-slot="{ errors }"
                        name="月"
                        rules="required"
                      >
                        <v-select
                          outlined
                          :error-messages="errors"
                          :error="errors.length !== 0"
                          :hide-details="errors.length <= 0"
                          dense
                          v-model="form.month"
                          :items="monthList"
                        >
                        </v-select>
                      </validation-provider>
                      <label class="font-14px ml-4">
                        <span>月</span>
                      </label>
                    </div>
                  </v-col>
                </v-row>
              </div>
              <div id="description">
                <label class="d-block font-14px mb-1">
                  <span>一言アピール</span>
                </label>
                <v-textarea
                  class="text-area"
                  height="306px"
                  hide-details
                  outlined
                  dense
                  placeholder="メモ"
                  v-model="form.self_introduction"
                  :readonly="true"
                >
                </v-textarea>
              </div>
            </div>
            <!-- active switch -->
            <div class="d-flex align-center justify-center full-width">
              <v-switch
                color="primary"
                :label="switchLabel"
                class="font-14px pt-0 mt-9 fw-400"
                v-model="form.status"
                hide-details
              ></v-switch>
            </div>
            <!-- submit -->
            <v-row no-gutters class="full-width mt-4">
              <v-col class="">
                <v-btn
                  class="px-0"
                  @click="dialog.submit = true"
                  depressed
                  color="transparent"
                >
                  <v-icon>$WarningRed</v-icon>
                  <span class="ml-2 text-red">削除する</span>
                </v-btn>
              </v-col>
              <v-col offset="1" class="font-14px">
                <v-btn
                  v-if="membership"
                  width="148px"
                  height="35px"
                  color="primary"
                  @click="updateStudentDetails"
                  >更新する</v-btn
                >
              </v-col>
              <v-col></v-col>
            </v-row>
          </div>
        </v-form>
      </validation-observer>
    </div>
    <SuccessModel
      :text="`学生の基本情報を更新しました。 `"
      :buttonText="`一覧へ戻る`"
      :routeName="`Students`"
      :dialog="successDialog"
      @closeModel="successDialog = false"
    ></SuccessModel>
    <SimpleModel
      :text="`このユーザーを削除しますか？`"
      :dialog="dialog.submit"
      :submitButtonText="`削除する`"
      @submitSuccess="deleteInformation"
      @closeModel="dialog.submit = false"
    ></SimpleModel>
  </div>
</template>
<script>
import SimpleModel from '@/components/models/SimpleModel'
import axios from '@/services/api'
import SuccessModel from '@/components/models/SuccessModel'
import { mapGetters } from 'vuex'
export default {
  components: {
    SimpleModel,
    SuccessModel
  },
  data() {
    return {
      dialog: {
        submit: false
      },
      membership: {},
      yearList: Array.from({ length: 11 }, (_, i) => this.$moment().year() + i),
      monthList: Array.from({ length: 12 }, (_, i) => i + 1),
      switchStatus: false,
      studentId: '',
      successDialog: false,
      form: {
        family_name: '',
        first_name: '',
        family_name_furigana: '',
        first_name_furigana: '',
        email_valid: '',
        education_facility_id: '',
        year: 0,
        month: 0,
        self_introduction: '',
        status: ''
      }
    }
  },

  computed: {
    switchLabel() {
      if (this.form.status) {
        return 'アクティブ'
      } else {
        return 'インアクティブ'
      }
    },
    ...mapGetters(['getEducationFacilities'])
  },
  async created() {
    await this.$store.dispatch('GET_EDUCATION__FACILITY_DATA')
    var url = document.URL
    var id = url.substring(url.lastIndexOf('/') + 1)
    if (id) {
      this.studentId = id
      this.getStudentDetails(this.studentId)
    }
  },

  methods: {
    deleteInformation() {
      this.dialog.submit = false
    },

    getStudentDetails(studentId) {
      axios
        .get(`admin/student/` + studentId)
        .then(response => {
          var value = response.data.data.data

          this.form.family_name = value.family_name
          this.form.first_name = value.first_name
          this.form.family_name_furigana = value.family_name_furigana
          this.form.first_name_furigana = value.first_name_furigana
          this.form.email_valid = value.email_valid
          this.form.education_facility_id = value.education_facility_id
          this.form.year = value.graduate_year
          this.form.month = parseInt(value.graduate_month)
          this.form.self_introduction = value.self_introduction
          this.form.status = value.status

          this.$emit('info', response.data.data.data)
        })
        .catch(error => console.log(error))
    },

    updateStudentDetails() {
      axios
        .patch(`/student/` + this.studentId, this.form)
        .then(response => {
          if (response.status === 200) {
            this.successDialog = true
            this.form = response.data.data.data
          }
        })
        .catch(error => console.log(error))
    },

    submit() {
      //   this.$refs.observer.validate().then(result => {
      //   })
    }
  }
}
</script>
<style src="./index.scss" lang="scss"></style>
<style src="@/styles/forms.scss" lang="scss"></style>
