<template>
  <div>
    <PageTitle
      :items="{
        title: 'コラム',
        subTitle: '編集',
        back: {
          action: () => {
            $router.push({
              name: 'Media'
            })
          }
        }
      }"
    ></PageTitle>
    <validation-observer ref="observer">
      <v-form @submit.prevent="submitMediaPost()">
        <v-row>
          <v-col cols="8">
            <ColumnInformation
              :editorHeight="`980px`"
              :sectionTitle="false"
              :basicInformation="columnInformation"
            />
          </v-col>
          <v-col cols="4">
            <v-card height="256px" class="text-center pt-14">
              <v-btn
                @click="dialog.saveAsDraft = true"
                outlined
                color="#13ABA3"
                min-width="150px"
                width="259px"
                >下書き保存</v-btn
              >
              <br />
              <v-btn
                type="submit"
                color="#13ABA3"
                class="white--text mt-6"
                min-width="150px"
                width="259px"
                >公開</v-btn
              >
              <br />
              <v-btn
                @click="dialog.deletePost = true"
                class="mt-8"
                text
                color="#E14D56"
              >
                削除
              </v-btn>
            </v-card>
            <v-card height="106px" class="mt-4">
              <div class="mx-10 pt-10 d-flex justify-center">
                <v-icon>$eyeFill</v-icon>
                <div class="font-18px text-7d ml-2 mr-3">{{ $t('views') }}</div>
                <div class="font-18px text-7d">{{ numberOfViews }}</div>
              </div>
            </v-card>
            <ImageUpload :data="imageDetails" />
            <ColumnTag :mediaTag="mediaTags" />
          </v-col>
        </v-row>
      </v-form>
    </validation-observer>

    <SimpleModel
      text="このコラムを下書きとして保存しますか？"
      :dialog="dialog.saveAsDraft"
      @submitSuccess="saveAsDraft()"
      @closeModel="dialog.saveAsDraft = false"
    ></SimpleModel>
    <SimpleModel
      text="この求人を削除しますか？"
      :dialog="dialog.deletePost"
      @submitSuccess="deleteInformation()"
      @closeModel="dialog.deletePost = false"
    ></SimpleModel>
  </div>
</template>

<script>
import ColumnInformation from '@/components/pages/PostInputs'
import ImageUpload from '@/components/ui/ImageUpload.vue'
import ColumnTag from '@/components/pages/column/ColumnTag.vue'
import MediaMixin from './media.mixin'
import SimpleModel from '@/components/models/SimpleModel'
import { mapGetters } from 'vuex'

export default {
  name: 'ColumnDetails',
  components: {
    ColumnInformation,
    ColumnTag,
    ImageUpload,
    SimpleModel
  },
  mixins: [MediaMixin],
  data() {
    return {
      numberOfViews: 0,
      dialog: {
        saveAsDraft: false,
        deletePost: false
      }
    }
  },
  created() {
    this.getPageFields()
    this.getDataFromApi()
  },
  computed: {
    ...mapGetters(['getSingleMedia'])
  },
  methods: {
    async getDataFromApi() {
      await this.$store
        .dispatch('MEDIA_POST_GET', { id: this.$route.params.id })
        .then(() => {
          this.setPageData()
        })
    },
    setPageData() {
      this.columnInformation.forEach(item => {
        if (item.name == 'display_order_select') {
          if (this.getSingleMedia?.display_order) {
            item.value = 1
            item.additional_field.value = this.getSingleMedia.display_order
          }
        } else if (this.getSingleMedia?.[item.name]) {
          item.value = this.getSingleMedia[item.name]
        }
      })

      this.mediaTags.value = this.getSingleMedia.media_tags
        ? this.getSingleMedia.media_tags.map(i => i.id)
        : []

      this.numberOfViews = this.getSingleMedia?.media_views_count
      this.mediaPostStatus = `${this.getSingleMedia?.status}`
      this.imageDetails = {
        previewImageURL: this.getSingleMedia?.seo_featured_image,
        seo_ogp: {
          value: this.getSingleMedia?.seo_ogp
        },
        seo_slug: {
          value: this.getSingleMedia?.seo_slug
        },
        seo_meta_description: {
          value: this.getSingleMedia?.seo_meta_description
        }
      }
    },
    submitMediaPost(isDraftCheck = 'N') {
      this.isDraftOrPublic = '1' // draft post
      if (isDraftCheck == 'N') {
        this.isDraftOrPublic = '0' // public post
      }
      this.savePageData('update') // Mixins function
      this.dialog.saveAsDraft = false
    },
    deleteInformation() {
      this.dialog.deletePost = false
      this.$store
        .dispatch('MEDIA_POST_DELETE', { id: this.$route.params.id })
        .then(() => {
          this.$router.push({ name: 'Media' })
        })
    }
  }
}
</script>
