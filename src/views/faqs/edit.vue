<template>
  <div class="faq-create-page">
    <div
      class="heading-text fw-500 d-flex justify-space-between flex-wrap align-center mt-5 mb-8"
    >
      <h2 class="font-24px mb-1 mr-4">
        <span class="fw-500">FAQ管理</span>
        <span class="line"></span>
        <span class="font-20px fw-400">FAQ編集</span>
      </h2>
      <v-btn :to="{ name: 'FAQs' }" text class="text-7d transparent">
        <v-icon size="17" class="mr-1" style="fill: #7d7d7d">
          $PreviousAngleCircle
        </v-icon>
        戻る
      </v-btn>
    </div>
    <v-card class="pa-5 rounded-sm py-5">
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-form @submit.prevent="submit">
          <v-container class="container-main py-4">
            <v-row>
              <v-col cols="12" md="12" class="mb-n3">
                <validation-provider
                  v-slot="{ errors }"
                  :name="$t(fields.user_type.name)"
                  rules="required"
                >
                  <v-radio-group
                    :error-messages="errors"
                    :error="errors.length !== 0"
                    :hide-details="errors.length <= 0"
                    v-model="fields.user_type.value"
                    row
                  >
                    <v-radio label="ユーザー" value="2" color="red"></v-radio>
                    <v-radio label="企業" value="1" color="red"></v-radio>
                  </v-radio-group>
                </validation-provider>
              </v-col>
              <v-col cols="12" md="12" class="mb-n3">
                <label class="d-block font-14px">
                  <span>カテゴリ</span>
                </label>
                <validation-provider
                  v-slot="{ errors }"
                  :name="$t(fields.faq_category_id.name)"
                  rules="required"
                >
                  <v-select
                    :error-messages="errors"
                    :error="errors.length !== 0"
                    :hide-details="errors.length <= 0"
                    outlined
                    v-model="fields.faq_category_id.value"
                    dense
                    placeholder="カテゴリを選択してください"
                    item-text="name"
                    item-value="id"
                    :items="getFaqCategories"
                    menu-props="auto"
                    color="grey"
                  >
                  </v-select>
                </validation-provider>
              </v-col>
              <v-col cols="12" md="12">
                <label class="d-block font-14px">
                  <span>質問</span>
                </label>
                <validation-provider
                  v-slot="{ errors }"
                  :name="$t(fields.question.name)"
                  rules="required"
                >
                  <v-textarea
                    :error-messages="errors"
                    :error="errors.length !== 0"
                    :hide-details="errors.length <= 0"
                    outlined
                    v-model="fields.question.value"
                    dense
                    auto-grow
                    rows="3"
                    placeholder="質問内容を入力してください"
                  >
                  </v-textarea>
                </validation-provider>
              </v-col>
              <v-col cols="12" md="12">
                <label class="d-block font-14px">
                  <span>回答</span>
                </label>
                <validation-provider
                  v-slot="{ errors }"
                  :name="$t(fields.answer.name)"
                  rules="required"
                >
                  <v-textarea
                    :error-messages="errors"
                    :error="errors.length !== 0"
                    :hide-details="errors.length <= 0"
                    outlined
                    v-model="fields.answer.value"
                    dense
                    auto-grow
                    rows="5"
                    placeholder="質問に対する回答を入力してください"
                  >
                  </v-textarea>
                </validation-provider>
              </v-col>
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
                    class="mt-0"
                    true-value="1"
                    false-value="0"
                  ></v-switch>
                </validation-provider>
              </v-col>

              <v-col cols="12" md="12" class="mt-2">
                <div class="faq-footer-action text-center mt-10">
                  <v-btn
                    text
                    height="0"
                    class="delete-btn font-14px pa-0 ml-2 text-dark-blue"
                    @click.prevent="dialog.delete = true"
                  >
                    <v-icon size="18" class="text-dark-blue mr-1">
                      $Warning
                    </v-icon>
                    削除する
                  </v-btn>

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
                    >更新する</v-btn
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
      :routeName="`FAQs`"
      :dialog="dialog.success"
      @closeModel="dialog.success = false"
    ></SuccessModel>

    <SimpleModel
      :text="`Do you want to delete this faq record?`"
      :dialog="dialog.delete"
      :loading="loading"
      @submitSuccess="deleteFaqs()"
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
  metaInfo: {
    title: 'コトナル 管理者 FAQ管理 | FAQ編集'
  },
  data() {
    return {
      dialogText: '',
      dialog: {
        delete: false,
        success: false
      },
      fields: {
        question: {
          name: 'question',
          value: null
        },
        answer: {
          name: 'answer',
          value: null
        },
        faq_category_id: {
          name: 'faq_category_id',
          value: null
        },
        user_type: {
          name: 'user_type',
          value: null
        },
        is_release: {
          name: 'is_release',
          value: null
        }
      },
      loading: false
    }
  },
  created() {
    this.getDataFromApi()
    this.getFaqCategoriesFromApi()
  },
  computed: {
    ...mapGetters(['singleFaq', 'getFaqCategories'])
  },
  methods: {
    getFaqCategoriesFromApi() {
      this.loading = true
      this.$store.dispatch('FAQS_CATEGORIES').finally((this.loading = false))
    },
    getDataFromApi() {
      this.loading = true
      this.$store
        .dispatch('FAQS_GET', { id: this.$route.params.id })
        .then(() => {
          this.setPageData()
        })
        .finally(() => (this.loading = false))
    },
    setPageData() {
      Object.keys(this.fields).forEach(field => {
        this.fields[field].value = this.singleFaq[field]
      })
    },
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
        data.id = this.$route.params.id
        Object.keys(this.fields).forEach(field => {
          if (this.fields[field].value !== null) {
            data[field] = this.fields[field].value
            if (this.fields[field].name == 'is_release')
              data[field] = `${this.fields[field].value}`
          }
        })

        this.loading = true
        this.$store
          .dispatch('FAQS_UPDATE', data)
          .then(() => {
            this.loading = false
            this.$router.push({ name: 'FAQs' })
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
    deleteFaqs() {
      this.loading = true
      this.$store
        .dispatch('FAQS_DELETE', { id: this.$route.params.id })
        .then(() => {
          this.$router.push({ name: 'FAQs' })
        })
        .finally(() => (this.loading = false))
    }
  }
}
</script>

<style lang="scss" src="./styles.scss" scope></style>
