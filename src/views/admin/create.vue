<template>
  <div class="admin-create-page">
    <PageTitle
      :items="{
        title: '管理者',
        subTitle: '管理者登録',
        back: {
          action: () => {
            $router.push({ name: 'AdminListing' })
          }
        }
      }"
    ></PageTitle>

    <v-card class="pa-5">
      <validation-observer ref="observer">
        <v-form autocomplete="off">
          <v-container class="container-main py-4">
            <v-row>
              <v-col cols="12" md="8" class="mx-auto">
                <v-col cols="12" md="12" class="mb-n5">
                  <label class="d-block font-14px">
                    <span>管理者名</span>
                    <span class="error--text ml-2 font-12px">必須</span>
                  </label>
                  <validation-provider
                    v-slot="{ errors }"
                    :name="fields.name.name"
                    rules="required"
                  >
                    <v-text-field
                      :error-messages="errors"
                      :error="errors.length !== 0"
                      :hide-details="errors.length <= 0"
                      outlined
                      v-model="fields.name.value"
                      dense
                      placeholder="管理者名"
                    >
                    </v-text-field>
                  </validation-provider>
                </v-col>

                <v-col cols="12" md="12" class="mb-n5">
                  <label class="d-block font-14px">
                    <span>メールアドレス</span>
                    <span class="error--text ml-2 font-12px">必須</span>
                  </label>
                  <validation-provider
                    v-slot="{ errors }"
                    :name="fields.email.name"
                    rules="required|email|only_english_lang_allowed"
                  >
                    <v-text-field
                      :error-messages="errors"
                      :error="errors.length !== 0"
                      :hide-details="errors.length <= 0"
                      outlined
                      v-model="fields.email.value"
                      dense
                      placeholder="メールアドレス"
                    >
                    </v-text-field>
                  </validation-provider>
                </v-col>

                <v-col cols="12" md="12" class="mb-n5">
                  <label class="d-block font-14px">
                    <span>パスワード 英数字8文字以上</span>
                    <span class="error--text ml-2 font-12px">必須</span>
                  </label>
                  <validation-provider
                    v-slot="{ errors }"
                    :name="fields.password.name"
                    vid="confirmation"
                    rules="required|min:8|only_english_lang_allowed"
                  >
                    <v-text-field
                      :error-messages="errors"
                      :error="errors.length !== 0"
                      :hide-details="errors.length <= 0"
                      outlined
                      type="password"
                      v-model="fields.password.value"
                      autocomplete="off"
                      dense
                      placeholder="パスワード"
                    >
                    </v-text-field>
                  </validation-provider>
                </v-col>

                <v-col cols="12" md="12" class="mb-n3">
                  <label class="d-block font-14px">
                    <span class="ml-2">パスワード(確認用)</span>
                    <span class="error--text ml-2 font-12px">必須</span>
                  </label>
                  <validation-provider
                    v-slot="{ errors }"
                    :name="fields.password_confirmed.name"
                    rules="required|min:8|only_english_lang_allowed|password_confirmed:confirmation"
                  >
                    <v-text-field
                      :error-messages="errors"
                      :error="errors.length !== 0"
                      :hide-details="errors.length <= 0"
                      outlined
                      v-model="fields.password_confirmed.value"
                      type="password"
                      autocomplete="off"
                      dense
                      placeholder="パスワード"
                    >
                    </v-text-field>
                  </validation-provider>
                </v-col>

                <v-col cols="12" md="12" class="-mt-1">
                  <div class="admin-footer-action text-center mt-10">
                    <v-btn
                      type="submit"
                      :loading="loading"
                      max-width="188px"
                      width="100%"
                      height="35"
                      class="btn-primary white--text"
                      @click.prevent="submit"
                      >登録</v-btn
                    >
                  </div>
                </v-col>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </validation-observer>
    </v-card>

    <SuccessModel
      :text="`管理者を登録しました。`"
      :buttonText="`管理者一覧へ戻る`"
      :routeName="`AdminListing`"
      :dialog="dialog.success"
      @closeModel="dialog.success = false"
    ></SuccessModel>

    <SimpleModel
      :text="`この管理者情報を登録してよろしいですか？`"
      :dialog="dialog.submit"
      :submitButtonText="`登録する`"
      @submitSuccess="submit()"
      @closeModel="dialog.submit = false"
    ></SimpleModel>
  </div>
</template>

<script>
import SuccessModel from '@/components/models/SuccessModel'
import SimpleModel from '@/components/models/SimpleModel'
export default {
  name: 'Create',
  components: { SuccessModel, SimpleModel },
  data() {
    return {
      dialogText: '',
      loading: false,
      dialog: {
        success: false,
        submit: false
      },
      fields: {
        name: {
          name: '管理者名',
          value: null
        },
        email: {
          name: 'メールアドレス',
          value: null
        },
        password: {
          name: 'パスワード 英数字文字以上',
          value: null
        },
        password_confirmed: {
          name: 'パスワード(確認用)',
          value: null
        }
      }
    }
  },
  methods: {
    submit() {
      this.$refs.observer.validate().then(success => {
        if (!success) {
          return
        }

        const data = {}
        Object.keys(this.fields).forEach(field => {
          if (this.fields[field].value !== null) {
            data[field] = this.fields[field].value
          }
        })
        this.loading = true
        this.$store
          .dispatch('ADMINS_CREATE', data)
          .then(() => {
            this.dialog.success = true
          })
          .catch(error => {
            if (error.status == 422)
              this.$refs.observer.setErrors(error.data.errors)
            this.closeModels()
          })
          .finally(() => (this.loading = false))
      })
    },
    closeModels() {
      Object.keys(this.dialog).forEach(item => {
        this.dialog[item] = false
      })
    }
  }
}
</script>

<style lang="scss" src="./styles.scss" scope></style>
