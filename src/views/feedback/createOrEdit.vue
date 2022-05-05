<template>
  <div class="">
    <PageTitle
      :items="{
        title: 'フィードバック',
        subTitle: '新規作成',
        back: {
          action: () => {
            $router.push({
              name: 'Feedbacks'
            })
          }
        }
      }"
    ></PageTitle>
    <v-card class="d-flex align-center justify-center" width="100%">
      <validation-observer ref="observer">
        <v-form @submit.prevent="submit" class="mt-20">
          <v-sheet
            v-for="(field, index) in fields"
            :key="index"
            :width="field.width"
            :class="field.class"
            color="transparent"
          >
            <label class="d-block font-14px mb-1">
              <span>{{ field.label }}</span>
              <span v-if="field.required" class="error--text ml-2 font-12px"
                >必須</span
              >
            </label>
            <validation-provider
              v-slot="{ errors }"
              :namename="field.label"
              ref="observer"
              :rules="field.rules"
            >
              <v-select
                v-if="field.type === 'select'"
                :items="field.items"
                v-model="field.value"
                dense
                outlined
                :item-text="field.item_text"
                :item-value="field.item_value"
                :placeholder="field.placeholder"
                :error-messages="errors"
                :error="errors.length !== 0"
                :hide-details="errors.length <= 0"
                append-icon="$grayDropdown"
              ></v-select>
              <v-autocomplete
                v-if="field.type === 'autocomplete'"
                :items="field.items"
                v-model="field.value"
                :search-input.sync="field.searched_text"
                dense
                outlined
                @keyup="field.search_api(field)"
                :hide-no-data="field.is_hide_no_data"
                :loading="field.is_loading"
                :item-text="field.item_text"
                :item-value="field.item_value"
                hide-selected
                :placeholder="field.placeholder"
                :error-messages="errors"
                :error="errors.length !== 0"
                :hide-details="errors.length <= 0"
                append-icon="$grayDropdown"
              ></v-autocomplete>
              <v-text-field
                v-if="field.type === 'text'"
                v-model="field.value"
                :placeholder="field.placeholder"
                :error-messages="errors"
                :error="errors.length !== 0"
                :hide-details="errors.length <= 0"
                outlined
                dense
              ></v-text-field>
              <v-textarea
                v-if="field.type === 'text-area'"
                height="210px"
                outlined
                dense
                :placeholder="field.placeholder"
                v-model="field.value"
                :error-messages="errors"
                :error="errors.length !== 0"
                :hide-details="errors.length <= 0"
              >
              </v-textarea>
            </validation-provider>
          </v-sheet>
          <div class="full-width d-flex align-center justify-center mb-9">
            <v-btn
              @click="dialog.saveAsDraft = true"
              width="148px"
              height="35px"
              class="mr-5"
              outlined
              type="button"
              color="#13ABA3"
            >
              下書き保存
            </v-btn>
            <v-btn color="primary" width="148px" height="35px" type="submit">
              登録
            </v-btn>
          </div>
        </v-form>
      </validation-observer>
    </v-card>

    <SimpleModel
      text="この求人を下書きとして保存しますか？"
      :dialog="dialog.saveAsDraft"
      @submitSuccess="saveAsDraft()"
      @closeModel="dialog.saveAsDraft = false"
    ></SimpleModel>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SimpleModel from '@/components/models/SimpleModel'
import { debounce } from 'debounce'
export default {
  name: 'createOrEdit',
  components: { SimpleModel },
  data() {
    return {
      feedbackID: null,
      pageType: 'create',
      is_drafted: false,
      dialog: {
        saveAsDraft: false
      },
      fields: [
        {
          label: 'フィードバック対象月',
          name: 'posted_month',
          type: 'select',
          item_value: 'value',
          item_text: 'text',
          value: null,
          items: Array.from({ length: 12 }, (_, i) => {
            let year = new Date().getFullYear()
            let month = i + 1
            let monthValue = month < 10 ? `0${month}` : `${month}`
            return {
              value: `${year}-${monthValue}`,
              text: `${year}年 ${month}月`
            }
          }),
          placeholder: '選択してください',
          width: '219px',
          required: true,
          rules: 'required:フィードバック対象月',
          class: 'mb-5'
        },
        {
          label: '企業名',
          name: 'company_id',
          type: 'autocomplete',
          items: this.getAllCompany,
          item_text: this.getCompanySuggestionText,
          item_value: 'id',
          searchable: true,
          search_api: this.searchCompany,
          is_loading: false,
          searched_text: '',
          is_hide_no_data: true,
          value: null,
          placeholder: '内部ID、企業名または企業名フリガナを入力してください',
          width: '642px',
          required: true,
          rules: 'required:企業名',
          class: 'mb-2'
        },
        {
          label: '学生名',
          name: 'student_id',
          type: 'autocomplete',
          items: this.getAllStudent,
          item_text: this.getStudentSuggestionText,
          item_value: 'id',
          value: null,
          searchable: true,
          search_api: this.searchStudent,
          is_loading: false,
          searched_text: '',
          is_hide_no_data: true,
          placeholder: '学生ID、学生名または学生名フリガナを入力してください',
          width: '642px',
          required: true,
          rules: 'required:学生名',
          class: 'mb-5'
        },
        {
          label: '評価された力',
          name: 'super_power_review',
          type: 'select',
          value: null,
          items: [],
          item_text: 'name',
          item_value: 'id',
          placeholder: '選択してください',
          width: '219px',
          required: true,
          rules: 'required:評価された力',
          class: 'mb-2'
        },
        {
          label: '評価された力　本文',
          name: 'super_power_comment',
          type: 'text-area',
          value: null,
          placeholder: '入力してください',
          width: '642px',
          required: true,
          rules: 'required:評価された力　本文',
          class: 'mb-5'
        },
        {
          label: '期待したい力',
          name: 'growth_idea_review',
          type: 'select',
          value: null,
          items: [],
          item_text: 'name',
          item_value: 'id',
          placeholder: '選択してください',
          width: '219px',
          required: true,
          rules: 'required:期待したい力',
          class: 'mb-2'
        },
        {
          label: '期待したい力　本文',
          name: 'growth_idea_comment',
          type: 'text-area',
          value: null,
          placeholder: '入力してください',
          width: '642px',
          required: true,
          rules: 'required:期待したい力　本文',
          class: 'mb-9'
        }
      ]
    }
  },
  created() {
    this.checkPageType()
  },
  computed: {
    ...mapGetters(['getSingleFeedback', 'getAllCompany', 'getAllStudent'])
  },
  methods: {
    searchStudent: debounce(function(field) {
      field.is_loading = true

      this.$store
        .dispatch('STUDENT_GET_ALL', {
          sort_by_order: 'desc',
          sort_by: 'created_at',
          page: 1,
          paginate: 10,
          status: 1,
          search: field.searched_text ?? null,
          silent_loading: true
        })
        .then(() => {
          field.items = this.getAllStudent
          field.is_loading = false
        })
    }, 500),
    searchCompany: debounce(function(field) {
      field.is_loading = true

      this.$store
        .dispatch('COMPANY_GET_ALL', {
          search: field.searched_text ?? null,
          silent_loading: true,
          page: 1,
          paginate: 10,
          showActive: 1
        })
        .then(() => {
          field.items = this.getAllCompany
          field.is_loading = false
        })
    }, 500),
    getStudentSuggestionText(item) {
      let text = [
        item.student_internal_id,
        item.family_name,
        item.first_name,
        item.family_name_furigana,
        item.first_name_furigana
      ]
        .filter(Boolean)
        .join(' ')

      return text
    },
    getCompanySuggestionText(item) {
      let text = [item.internal_company_id, item.name, item.furigana_name]
        .filter(Boolean)
        .join(' ')

      return text
    },
    saveAsDraft() {
      this.is_drafted = true
      this.dialog.saveAsDraft = false
      this.submit()
    },
    setfieldsItemsData() {
      this.fields.map(field => {
        if (
          field.name == 'super_power_review' ||
          field.name == 'growth_idea_review'
        ) {
          field.items = this.getMasterData?.reviews_option
        }

        return field
      })
    },
    checkPageType() {
      this.setfieldsItemsData()
      this.pageType = 'create'
      if (this.$route.params?.id) {
        this.feedbackID = this.$route.params.id
        this.pageType = 'edit'
        this.getPageData()
      }
    },
    getPageData() {
      this.$store.dispatch('FEEDBACK_GET', { id: this.feedbackID }).then(() => {
        this.setPageData()
      })
    },
    setPageData() {
      this.fields.forEach(field => {
        if (field.name == 'company_id') {
          field.items = this.getSingleFeedback.companies
        }

        if (field.name == 'student_id') {
          field.items = this.getSingleFeedback.student
        }

        field.value = this.getSingleFeedback[field.name]
      })
    },
    submit() {
      this.$refs.observer.validate().then(success => {
        if (!success) {
          this.is_drafted = false
          return
        }

        let data = { id: this.feedbackID }

        this.fields.forEach(field => {
          data[field.name] = field.value
        })

        data.is_draft_or_public = 1 // 1 => public at backend
        if (this.is_drafted) {
          this.is_drafted = false
          data.is_draft_or_public = 0 // 0 => draft at backend
        }

        this.$store
          .dispatch(
            this.pageType == 'create' ? 'FEEDBACK_CREATE' : 'FEEDBACK_UPDATE',
            data
          )
          .then(() => {
            this.$router.push({ name: 'Feedbacks' })
          })
      })
    }
  }
}
</script>
<style lang="scss" src="@/styles/forms.scss"></style>
