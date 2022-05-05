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
                  <validation-provider
                    v-slot="{ errors }"
                    name="email"
                    rules="required:メールアドレス|email|only_english_lang_allowed"
                  >
                    <v-text-field
                      v-model="email"
                      :error-messages="errors"
                      :error="errors.length !== 0"
                      :hide-details="errors.length <= 0"
                      placeholder="メールアドレス"
                      dense
                      solo
                      outlined
                      class="input-text"
                    ></v-text-field>
                  </validation-provider>

                  <validation-provider
                    v-slot="{ errors }"
                    name="password"
                    rules="required:パスワード|only_english_lang_allowed"
                  >
                    <input-password
                      class="input-text"
                      v-model="password"
                      :error-messages="errors"
                      :error="errors.length !== 0"
                      :hide-details="errors.length <= 0"
                      placeholder="パスワード"
                      solo
                      dense
                      outlined
                      :appendToggleEye="true"
                    />
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
                    >ログイン</v-btn
                  >

                  <div class="forget-blk pt-8">
                    <router-link
                      class="forget-link fw-500 font-12px"
                      :to="{ name: 'ForgotPassword' }"
                    >
                      パスワードを忘れた方はこちら
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
import InputPassword from '@/components/ui/InputPassword'
import FlashMessage from '@/components/FlashMessage'
import { mapGetters } from 'vuex'
export default {
  name: 'Login',
  components: { InputPassword, FlashMessage },
  metaInfo: {
    title: 'コトナル 管理者ログイン'
  },
  data() {
    return {
      email: '',
      password: '',
      errors: '',
      error: ''
    }
  },
  created() {
    this.$store.dispatch('API_PROCESSING', false, { root: true })
  },
  computed: {
    ...mapGetters(['getApiProcessingStatus', 'user'])
  },
  methods: {
    login() {
      this.$refs.observer.validate().then(success => {
        if (!success) {
          return
        }
        let email = this.email
        let password = this.password

        this.$store
          .dispatch('AUTH_REQUEST', { email, password })
          .then(() => {
            if (
              this.$route.query.redirect &&
              this.$route.query.redirect !== ''
            ) {
              this.$router.push(`${this.$route.query.redirect}`)
            } else {
              this.$router.push({ name: 'Dashboard' })
            }
          })
          .catch(err => {
            this.error = this.$t('validation.login.api_error_message')
          })
      })
    }
  }
}
</script>

<style src="./__auth.scss" scoped lang="scss"></style>
