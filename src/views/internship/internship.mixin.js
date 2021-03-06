import { mapGetters } from 'vuex'
import { debounce } from 'debounce'

export default {
  name: 'InternshipPostMixin',
  data() {
    return {
      userSiteUrl: process.env.VUE_APP_USER_SITE_URL,
      isPreview: false,
      previewURL: null,
      imageDetails: {
        previewImageURL: null,
        logoImage: null,
        seo_ogp: {
          value: '',
          rules: ''
        },
        seo_slug: {
          value: '',
          rules: ''
        },
        seo_meta_description: {
          value: '',
          rules: ''
        }
      },
      basicInformation: [],
      isDraftOrPublic: 1 // public post
    }
  },
  computed: {
    ...mapGetters([
      'getAllCompany',
      'getApiProcessingStatus',
      'getSingleInternship'
    ])
  },
  methods: {
    preview() {
      this.isPreview = true
      this.saveAsDraft()
    },
    saveAsDraft() {
      this.basicInformation = this.basicInformation.filter(item => {
        if (
          item.requiredChecks &&
          item.name != 'company_id' &&
          item.name != 'title'
        ) {
          item.rules = item.rules
            .replace('required|', '')
            .replace('required', '')
        }
        return item
      })

      this.$nextTick(function() {
        this.submitInformation('Y') // component own function call.
      })
    },
    getInputsPageData() {
      const data = new FormData()

      data.append(
        'seo_meta_description',
        this.imageDetails.seo_meta_description.value ?? ''
      )
      data.append('seo_ogp', this.imageDetails.seo_ogp.value ?? '')
      data.append('seo_slug', this.imageDetails.seo_slug.value ?? '')
      data.append('draft_or_public', this.isDraftOrPublic ?? '')
      if (this.imageDetails.logoImage) {
        data.append('seo_featured_image', this.imageDetails.logoImage)
      }

      this.basicInformation.forEach(field => {
        if (field.name && field.value) {
          if ({}.hasOwnProperty.call(field, 'additional_field')) {
            data.append(
              field.additional_field.name,
              field.additional_field.value
            )
          }

          if (field.name == 'internship_feature_id') {
            if (field.value && field.value.length > 0) {
              field.value.forEach(item => {
                data.append('internship_feature_id[]', item)
              })
            }
          } else {
            data.append(field.name, field.value)
          }
        }
      })

      return data
    },
    savePageData(isCreateOrUpdate) {
      this.$refs.observer.validate().then(success => {
        if (!success) {
          return
        }

        let data = this.getInputsPageData()

        let SET_CALL = 'INTERNSHIP_CREATE'
        if (isCreateOrUpdate == 'update') {
          SET_CALL = 'INTERNSHIP_UPDATE'
          data.append('id', this.$route.params.id)
        }

        this.$store
          .dispatch(SET_CALL, data)
          .then(result => {
            if (result.status === 200) this.$refs.observer.reset()

            if (this.isPreview) {
              this.isPreview = false
              this.dialog.preview = true
            } else {
              this.$router.push({ name: 'InternshipPostList' })
            }
          })
          .catch(error => {
            if (error?.status == 422) {
              this.$refs.observer.setErrors(
                error?.data?.error?.errors || error?.data?.errors
              )
            }
          })
      })
    },
    getAutoSuggestionText(item) {
      return `${item.internal_company_id} / ${item.name} ${item
        .business_industry?.name ?? ''}`
    },
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
    getPageFields() {
      this.basicInformation = [
        {
          label: '?????????',
          name: 'company_id',
          type: 'autocomplete',
          placeholder: '??????ID????????????????????????????????????????????????????????????',
          row_class: '',
          item_value: 'id',
          item_text: this.getAutoSuggestionText,
          searchable: true,
          search_api: this.searchCompany,
          is_loading: false,
          searched_text: '',
          items: this.getAllCompany,
          value: '',
          rules: 'required',
          requiredChecks: true
        },
        {
          label: '??????????????????',
          name: 'title',
          type: 'text',
          placeholder: '???????????????????????????????????????',
          row_class: 'job-title',
          value: '',
          rules: 'required|max:60',
          requiredChecks: true,
          counter: true,
          counterValue: 60
        },
        {
          label: '??????',
          name: 'work_category_id',
          type: 'dropdown',
          placeholder: '????????????????????????',
          row_class: '',
          field_class: '',
          item_value: 'id',
          item_text: 'name',
          items: this.getMasterData?.work_categories,
          no_data_text: '????????????????????????',
          value: '',
          rules: 'required',
          requiredChecks: true
        },
        {
          label: '?????????????????????',
          name: 'period',
          type: 'dropdown',
          placeholder: '????????????????????????',
          row_class: '',
          field_class: '',
          item_value: 'id',
          item_text: 'name',
          items: this.getMasterData?.period,
          no_data_text: '????????????????????????',
          value: '',
          rules: 'required',
          requiredChecks: true
        },
        {
          label: '???????????????',
          name: 'workload',
          type: 'dropdown',
          placeholder: '????????????????????????',
          row_class: '',
          field_class: '',
          item_value: 'id',
          item_text: 'name',
          items: this.getMasterData?.workload,
          no_data_text: '????????????????????????',
          value: '',
          rules: 'required',
          requiredChecks: true
        },
        {
          label: '????????????',
          name: 'target_grade',
          type: 'dropdown',
          placeholder: '????????????????????????',
          row_class: '',
          field_class: '',
          item_value: 'id',
          item_text: 'name',
          items: this.getMasterData?.target_grade,
          no_data_text: '????????????????????????',
          value: '',
          rules: 'required',
          requiredChecks: true
        },
        {
          label: '??????',
          name: 'wage',
          type: 'dropdown',
          placeholder: '????????????????????????',
          row_class: '',
          field_class: '',
          item_value: 'id',
          item_text: 'name',
          items: this.getMasterData?.wage,
          no_data_text: '????????????????????????',
          value: '',
          rules: 'required',
          requiredChecks: true
        },
        {
          label: '??????',
          name: 'internship_feature_id',
          type: 'dropdown',
          multiple: true,
          placeholder: '????????????????????????',
          value: [],
          rules: '',
          item_value: 'id',
          item_text: 'name',
          items: this.getMasterData?.internship_feature_list
        },
        {
          label: '???????????????',
          name: 'application_step_1',
          type: 'text',
          placeholder: '1.',
          counter: true,
          counterValue: 25,
          value: '',
          rules: 'required|max:25',
          requiredChecks: true
        },
        {
          label: '',
          name: 'application_step_2',
          type: 'text',
          placeholder: '2.',
          counter: true,
          counterValue: 25,
          value: '',
          rules: 'max:25'
        },
        {
          label: '',
          name: 'application_step_3',
          type: 'text',
          placeholder: '3.',
          counter: true,
          counterValue: 25,
          value: '',
          rules: 'max:25'
        },
        {
          label: '',
          name: 'application_step_4',
          type: 'text',
          placeholder: '4.',
          counter: true,
          counterValue: 25,
          value: '',
          rules: 'max:25'
        },
        {
          label: '?????????',
          name: 'display_order_select',
          type: 'dropdown',
          items: [
            { id: 0, name: '???????????????' },
            { id: 1, name: '????????????' }
          ],
          item_value: 'id',
          item_text: 'name',
          value: 0,
          rules: '',
          additional_field: {
            label: '?????????',
            name: 'display_order',
            type: 'text',
            placeholder:
              '?????????????????????????????????????????????????????????????????????????????????????????????',
            value: '',
            rules: 'required',
            requiredChecks: true,
            visibility_check: true,
            visible_value: '0',
            col_class_right: 'pl-3'
          }
        },
        {
          label: '????????????',
          name: 'description_corporate_profile',
          type: 'richbox',
          placeholder: '',
          value: '',
          rules: ''
        },
        {
          label: '????????????',
          name: 'description_internship_content',
          type: 'richbox',
          placeholder: '',
          value: '',
          rules: ''
        }
      ]
    }
  }
}
