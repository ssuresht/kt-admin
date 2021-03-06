export default {
  name: 'MediaPostMixin',
  data() {
    return {
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
      mediaTags: {
        value: []
      },
      columnInformation: [],
      isDraftOrPublic: 1 // public post
    }
  },
  methods: {
    saveAsDraft() {
      this.submitMediaPost('Y') // component own function call.
    },
    savePageData(isCreateOrUpdate) {
      this.$refs.observer.validate().then(success => {
        if (!success) {
          return
        }

        const data = new FormData()

        let SET_CALL = 'MEDIA_POST_CREATE'
        if (isCreateOrUpdate == 'update') {
          SET_CALL = 'MEDIA_POST_UPDATE'
          data.append('id', this.$route.params.id)
        }

        data.append(
          'seo_meta_description',
          this.imageDetails.seo_meta_description.value ?? ''
        )
        data.append('seo_ogp', this.imageDetails.seo_ogp.value ?? '')
        data.append('seo_slug', this.imageDetails.seo_slug.value ?? '')
        data.append('is_draft', this.isDraftOrPublic ?? '')

        if (this.mediaTags && this.mediaTags.value.length > 0) {
          this.mediaTags.value.forEach(item => {
            data.append('media_tag_id[]', item)
          })
        }

        data.append('status', 1)
        if (this.imageDetails.logoImage) {
          data.append('seo_featured_image', this.imageDetails.logoImage)
        }

        this.columnInformation.forEach(field => {
          if (field.name && field.value) {
            if ({}.hasOwnProperty.call(field, 'additional_field')) {
              data.append(
                field.additional_field.name,
                field.additional_field.value
              )
            }

            data.append(field.name, field.value)
          }
        })

        this.$store
          .dispatch(SET_CALL, data)
          .then(result => {
            if (result.status === 200) this.$refs.observer.reset()

            this.$router.push({ name: 'Media' })
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
    getPageFields() {
      this.columnInformation = [
        {
          label: '????????????',
          name: 'title',
          type: 'text',
          placeholder: '???????????????????????????????????????',
          value: '',
          rules: 'required|max:60',
          counter: true,
          counterValue: 60
        },
        {
          label: '?????????????????????',
          name: 'summery',
          type: 'textarea',
          placeholder: '?????????????????????',
          value: '',
          rules: ''
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
            label: '',
            name: 'display_order',
            type: 'text',
            placeholder: '1??????????????????????????????????????????',
            value: '',
            rules: 'required|min_value:1',
            requiredChecks: true,
            visibility_check: true,
            visible_value: '0',
            col_class_right: 'pl-3'
          }
        },
        {
          label: '????????????',
          name: 'description',
          type: 'richbox',
          placeholder: '',
          value: '',
          rules: '',
          height: '600px'
        }
      ]
    }
  }
}
