<template>
  <div class="admin-edit-page">
    <PageTitle
      :items="{
        title: '管理者',
        subTitle: '管理者編集',
        back: {
          action: () => {
            $router.push({ name: 'AdminListing' })
          }
        }
      }"
    ></PageTitle>
    <v-card class="pa-5 ">
      <validation-observer ref="observer">
        <v-form @submit.prevent="submit">
          <v-container class="container-main py-4">
            <v-row>
              <v-col cols="12" md="8" class="mx-auto">
                <div class="d-flex text-7d mb-2 ml-3">
                  <span class="min-width-75px">登録日</span>
                  <span class="min-width-75px">{{ created_at }}</span>
                </div>

                <v-col cols="12" md="12" class="mb-n3">
                  <label class="d-block font-14px">
                    <span>管理者氏名</span>
                    <span class="error--text ml-2 font-12px">必須</span>
                  </label>
                  <validation-provider
                    v-slot="{ errors }"
                    :name="$t(fields.name.name)"
                    rules="required"
                  >
                    <v-text-field
                      :error-messages="errors"
                      :error="errors.length !== 0"
                      :hide-details="errors.length <= 0"
                      outlined
                      v-model="fields.name.value"
                      dense
                    >
                    </v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="12" md="12" class="mb-n3">
                  <label class="d-block font-14px">
                    <span>メールアドレス</span>
                    <span class="error--text ml-2 font-12px">必須</span>
                  </label>
                  <validation-provider
                    v-slot="{ errors }"
                    :name="$t(fields.email.name)"
                    rules="required"
                  >
                    <v-text-field
                      :error-messages="errors"
                      :error="errors.length !== 0"
                      :hide-details="errors.length <= 0"
                      outlined
                      v-model="fields.email.value"
                      dense
                      placeholder="yamada@fnc.com"
                    >
                    </v-text-field>
                  </validation-provider>
                </v-col>

                <v-col cols="12" md="12" class="mb-n3 d-flex justify-center">
                  <validation-provider
                    v-slot="{ errors }"
                    :name="$t(fields.status.name)"
                  >
                    <v-switch
                      :error-messages="errors"
                      :error="errors.length !== 0"
                      :hide-details="errors.length <= 0"
                      outlined
                      v-model="fields.status.value"
                      :label="
                        fields.status.value == 0 ? '非アクティブ' : 'アクティブ'
                      "
                      color="#13ABA3"
                      class="mt-0"
                    ></v-switch>
                  </validation-provider>
                </v-col>
                <v-col>
                  <div class="admin-footer-action text-center mt-6">
                    <v-btn
                      text
                      height="0"
                      class="delete-btn font-14px pa-0 ml-2 text-red"
                      @click.prevent="dialog.delete = true"
                    >
                      <v-icon size="18" class="mr-2">$WarningRed</v-icon>
                      削除
                    </v-btn>
                    <v-btn
                      type="submit"
                      :loading="loading"
                      max-width="188px"
                      width="100%"
                      height="35"
                      class="btn-primary white--text"
                      >更新</v-btn
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
      :text="`企業情報を登録しました。`"
      :buttonText="`企業一覧へ戻る`"
      :routeName="`AdminListing`"
      :dialog="dialog.success"
      @closeModel="dialog.success = false"
    ></SuccessModel>

    <SimpleModel
      :text="`この管理者情報を削除しますか？`"
      :dialog="dialog.delete"
      :loading="loading"
      :submitButtonText="`削除`"
      @submitSuccess="deleteAdmin()"
      @closeModel="dialog.delete = false"
    ></SimpleModel>
  </div>
</template>

<script>
import SuccessModel from '@/components/models/SuccessModel'
import SimpleModel from '@/components/models/SimpleModel'
import { mapGetters } from 'vuex'
export default {
  name: 'Edit',
  components: { SuccessModel, SimpleModel },
  data() {
    return {
      dialogText: '',
      dialog: {
        delete: false,
        success: false,
        submit: false
      },
      fields: {
        name: {
          name: 'first_name',
          value: null
        },
        email: {
          name: 'email',
          value: null
        },
        status: {
          name: 'is_active',
          value: null
        }
      },
      created_at: null,
      loading: false
    }
  },
  async created() {
    await this.getDataFromApi()
  },
  computed: {
    ...mapGetters(['getAdmin'])
  },
  methods: {
    getDataFromApi() {
      this.$store
        .dispatch('ADMINS_GET', { id: this.$route.params.id })
        .then(() => {
          this.setPageData()
        })
        .finally(() => (this.loading = false))
    },
    setPageData() {
      Object.keys(this.fields).forEach(field => {
        this.fields[field].value = this.getAdmin[field]
      })
      console.log(this.getAdmin.created_at)
      this.created_at = this.getAdmin.created_at
        ? this.dateFormat(this.getAdmin.created_at)
        : '----/--/--'
    },
    submit() {
      this.$refs.observer.validate().then(success => {
        if (!success) {
          return
        }

        const data = {}
        data.id = this.$route.params.id
        Object.keys(this.fields).forEach(field => {
          if (this.fields[field].value !== null) {
            data[field] = this.fields[field].value
          }
        })
        this.loading = true
        this.$store
          .dispatch('ADMINS_UPDATE', data)
          .then(() => {
            this.$router.push({ name: 'AdminListing' })
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
    },
    deleteAdmin() {
      this.loading = true
      this.$store
        .dispatch('ADMINS_DELETE', { id: this.$route.params.id })
        .then(() => {
          this.$router.push({ name: 'AdminListing' })
        })
        .finally(() => (this.loading = false))
    }
  }
}
</script>

<style lang="scss" src="./styles.scss" scope></style>
