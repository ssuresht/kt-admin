<template>
  <div class="notifications-create-page">
    <div
      class="heading-text fw-500 d-flex justify-space-between flex-wrap align-center mt-5 mb-8"
    >
      <h2 class="font-24px mb-1 mr-4">
        <span class="fw-500">お知らせ管理</span>
        <span class="line"></span>
        <span class="font-20px fw-400">お知らせ編集</span>
      </h2>
      <v-btn :to="{ name: 'Notifications' }" text class="text-7d transparent">
        <v-icon size="17" class="mr-1" style="fill: #7d7d7d">
          $PreviousAngleCircle
        </v-icon>
        戻る
      </v-btn>
    </div>
    <v-card class="pa-5 rounded-sm py-10">
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-form @submit.prevent="submit">
          <v-container class="container-main py-10">
            <v-row>
              <v-col cols="12" md="12" class="mb-n3">
                <label class="d-block font-14px">
                  <span>タイトル</span>
                </label>
                <validation-provider
                  v-slot="{ errors }"
                  :name="$t(fields.title.name)"
                  rules="required"
                >
                  <v-text-field
                    :error-messages="errors"
                    :error="errors.length !== 0"
                    :hide-details="errors.length <= 0"
                    outlined
                    v-model="fields.title.value"
                    dense
                    placeholder="タイトルを50文字以内で入力してください"
                  >
                  </v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" md="4">
                <label class="d-block font-14px">
                  <span>お知らせ内容</span>
                </label>
                <!-- <validation-provider
                  v-slot="{ errors }"
                  :name="$t(fields.memo.name)"
                  rules="required"
                >
                </validation-provider> -->
              </v-col>
              <v-col cols="12" md="8">
                <v-row>
                  <v-col cols="12" md="12" class="mb-n3">
                    <validation-provider
                      v-slot="{ errors }"
                      :name="$t(fields.is_release.name)"
                      rules="required"
                    >
                      <v-switch
                        :error-messages="errors"
                        :error="errors.length !== 0"
                        :hide-details="errors.length <= 0"
                        v-model="fields.is_release.value"
                        label="公開"
                        color="red"
                        false-value="1"
                        true-value="2"
                      ></v-switch>
                    </validation-provider>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="12" class="mt-2">
                <div class="text-center mt-10">
                  <v-btn
                    type="button"
                    max-width="188px"
                    width="100%"
                    height="35"
                    class="white border-red text-red mr-5"
                    :loading="loading"
                    @click.stop="setDraftPost()"
                  >
                    下書きとして保存
                  </v-btn>
                  <v-btn
                    type="submit"
                    :disabled="invalid"
                    :loading="loading"
                    max-width="188px"
                    width="100%"
                    height="35"
                    class="bg-red white--text"
                    >登録する</v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </validation-observer>
    </v-card>

    <SuccessModel
      :text="`企業情報を登録しました。`"
      :buttonText="`企業一覧へ戻る`"
      :routeName="`Notifications`"
      :dialog="dialog.success"
      @closeModel="dialog.success = false"
    ></SuccessModel>

    <SimpleModel
      :text="dialogText"
      :dialog="dialog.common"
      :loading="loading"
      @submitSuccess="deleteCorporate()"
      @closeModel="dialog.common = false"
    ></SimpleModel>
  </div>
</template>

<script>
import Vue from 'vue'

import SuccessModel from '@/components/models/SuccessModel'
import SimpleModel from '@/components/models/SimpleModel'

export default {
  name: 'Create',
  components: {
    SuccessModel,
    SimpleModel
  },
  data() {
    return {
      dialogText: '',
      dialog: {
        success: false,
        common: false
      },
      fields: {
        title: {
          name: 'title',
          value: null
        },
        memo: {
          name: 'memo',
          value: null
        },
        is_release: {
          name: 'is_release',
          value: 1
        }
      },
      loading: false
    }
  },
  methods: {
    setDraftPost() {
      this.fields.is_release.value = 0
      this.submit()
    },
    submit() {
      this.$refs.observer.validate().then(success => {
        if (!success) {
          return
        }

        const data = {}
        this.loading = true
        Object.keys(this.fields).forEach(field => {
          if (this.fields[field].name == 'is_release') {
            data[field] = `${this.fields[field].value}`
          } else {
            data[field] = this.fields[field].value
          }
        })
        this.$store
          .dispatch('NOTIFICATIONS_CREATE', data)
          .then(() => {
            this.$router.push({ name: 'Notifications' })
            this.loading = false
          })
          .catch(error => {
            this.showAlert(error)
          })
      })
    }
  }
}
</script>

<style lang="scss" src="./styles.scss" scope></style>
