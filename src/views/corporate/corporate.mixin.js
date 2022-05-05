import * as AutoKana from 'vanilla-autokana'
let autokana
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      previewImageURL: null,
      image: null,
      successDialog: false,
      croppedImagePreview: null,
      fields: {
        internal_company_id: null,
        name: null,
        furigana_name: null,
        business_industry_id: null,
        office_address: null,
        office_phone: null,
        office_email1: null,
        office_email2: null,
        office_email3: null,
        website_url: null,
        client_liason: null,
        admin_memo: null,
        status: true,
        logo_img: null
      },
      loading: false,
      postalCodeLoading: false,
      logoImageId: null
    }
  },
  async mounted() {
    await this.$store.dispatch('GET_CORPORATE_CATEGORY_DATA')
    autokana = AutoKana.bind('#name', '#furigana', { katakana: true })
    // this.fields.internal_company_id = '登録時に生成します'
  },
  computed: {
    ...mapGetters(['getCorporateCategories']),
    switchLabel() {
      if (this.fields.status) {
        return 'アクティブ'
      } else {
        return 'インアクティブ'
      }
    }
  },
  methods: {
    handleNameInput() {
      this.fields.furigana_name = autokana.getFurigana()
    },
    imageCropSuccess(image) {
      this.croppedImagePreview = image
      this.previewImageURL = null
      this.fields.logo_img = null
    },
    imageCropCancel() {
      this.previewImageURL = null
      this.fields.logo_img = null
    },
    previewImage() {
      this.previewImageURL = URL.createObjectURL(this.fields.logo_img)
    }
  }
}
