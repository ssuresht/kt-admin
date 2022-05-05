<template>
  <v-app>
    <section class="auth-main-section font-Noto-Sans text-center">
      <v-container fill-height>
        <v-row>
          <v-col cols="12">
            <div class="login-main-blk">
              <div class="login-top-blk mb-10 pb-7">
                <div class="logo-circle-top">
                  <v-img
                    class="mx-auto"
                    :src="require('@/assets/images/logo-big.svg')"
                    lazy
                  ></v-img>
                </div>
              </div>
              <validation-observer ref="observer">
                <v-form @submit.prevent="updatePassword">
                  <validation-provider
                    v-slot="{ errors }"
                    name="password"
                    rules="required|verify_password|min:8|only_english_lang_allowed"
                  >
                    <input-password
                      class="input-text"
                      v-model="password"
                      :error-messages="errors"
                      :error="errors.length !== 0"
                      placeholder="パスワード"
                      solo
                      dense
                      outlined
                      :appendToggleEye="true"
                      hide-details
                    />
                  </validation-provider>
                  <validation-provider
                    v-slot="{ errors }"
                    name="confirm_password"
                    rules="password_confirmed:password|only_english_lang_allowed"
                  >
                    <input-password
                      class="input-text"
                      v-model="confirm_password"
                      :error-messages="errors"
                      :error="errors.length !== 0"
                      placeholder="再度入力してください"
                      solo
                      dense
                      outlined
                      :appendToggleEye="true"
                      hide-details
                    />
                  </validation-provider>
                  <div class="mb-1 mt-n1 text-left font-12px" v-if="error">
                    <FlashMessage :error="error" />
                  </div>
                  <v-btn
                    block
                    class="text-capitalize white--text font-14px fw-500 btn-primary"
                    type="submit"
                    >パスワードを更新する</v-btn
                  >

                  <div class="forget-blk mt-10 pt-6">
                    <router-link
                      class="forget-link fw-500 font-12px"
                      :to="{ name: 'Login' }"
                    >
                      ログイン画面へ戻る
                    </router-link>
                  </div>
                </v-form>
              </validation-observer>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import FlashMessage from '@/components/FlashMessage'
import InputPassword from '@/components/ui/InputPassword'

export default {
  name: 'Login',
  components: { FlashMessage, InputPassword },
  metaInfo: {
    title: 'コトナル 管理者パスワード再設定'
  },
  data() {
    return {
      error: null,
      password: '',
      confirm_password: ''
    }
  },
  created() {
    this.$store.dispatch('API_PROCESSING', false, { root: true })
  },
  methods: {
    updatePassword() {
      this.$refs.observer.validate().then(success => {
        if (!success) {
          return
        }

        this.error = null
        if (!this.$route.query.token || this.$route.query.token == '') {
          this.error = 'Token is required'
          return
        }

        const payload = {
          password: this.password,
          password_confirmation: this.confirm_password,
          token: this.$route.query.token
        }
        this.$store
          .dispatch('AUTH_RESET', payload)
          .then(response => {
            if (response.status === 200) {
              this.$router.push({ name: 'Login' })
            }
          })
          .catch(error => {
            if (error.status == 422) this.error = error.data.errors
          })
      })
    }
  }
}
</script>

<style src="./__auth.scss" lang="scss"></style>
