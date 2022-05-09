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
                <v-form @submit.prevent="login">
                  <div class="hint-text text-left">
                    <p class="mb-3 font-14px fw-400">
                      登録されたメールアドレスに<br />
                      パスワードの再設定メールを送信します
                    </p>
                  </div>
                  <validation-provider
                    v-slot="{ errors }"
                    name="email"
                    rules="required|email|only_english_lang_allowed"
                  >
                    <v-text-field
                      v-model="email"
                      :error-messages="errors"
                      :error="errors.length !== 0"
                      placeholder="メールアドレス"
                      dense
                      solo
                      outlined
                      class="input-text"
                      hide-details
                    ></v-text-field>
                  </validation-provider>
                  <div class="mb-1 mt-n1 text-left font-12px" v-if="error">
                    <FlashMessage :error="error" />
                  </div>
                  <v-btn
                    block
                    class="text-capitalize white--text font-14px fw-500 btn-primary"
                    type="submit"
                    :disabled="getApiProcessingStatus"
                    :loading="getApiProcessingStatus"
                    >メールを送信</v-btn
                  >

                  <div class="forget-blk pt-8">
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
          <v-col cols="12" v-if="send_email">
            <div class="login-main-blk">
              <v-alert type="success"    color="#13aba3" >メールを送信しました。</v-alert>
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

export default {
  name: 'Login',
  components: { FlashMessage },
  metaInfo: {
    title: 'コトナル 管理者パスワード再設定'
  },
  data() {
    return {
      error: '',
      email: '',
      send_email: ''
    }
  },
  created() {
    this.$store.dispatch('API_PROCESSING', false, { root: true })
  },
  computed: {
    ...mapGetters(['getApiProcessingStatus'])
  },
  methods: {
    login() {
      this.$refs.observer.validate().then(success => {
        if (!success) {
          return
        }
        let email = this.email
        let reset_url = `${process.env.VUE_APP_DEV_URL}update-password`
        this.$store
          .dispatch('AUTH_FORGOT', { email, reset_url })
          .then(response => {
            if (response.status === 200) {
              this.send_email = true
              this.$router.push({ name: 'ForgotPassword' })
            }
          })
          .catch(error => {
            if (error.status == 404)
              this.error =error.data.error
          })
      })
    }
  }
}
</script>

<style src="./__auth.scss" lang="scss"></style>
