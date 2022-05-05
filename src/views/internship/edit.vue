<template>
  <div>
    <validation-observer ref="observer">
      <v-form @submit.prevent="submitInformation()">
        <PageTitle
          :items="{
            title: title,
            subTitle: subTitle,
            back: {
              action: () => {
                $router.push({
                  name: 'InternshipPostList'
                })
              }
            }
          }"
        ></PageTitle>
        <v-row>
          <v-col cols="8">
            <InternshipBasicInformation :basicInformation="basicInformation"
             :singleInternship="getSingleInternship" />
          </v-col>
          <v-col cols="4">
            <v-card height="314px" class="text-center pt-14">
              <v-btn
                outlined
                type="button"
                @click="dialog.saveAsDraft = true"
                color="#13ABA3"
                min-width="150px"
                width="259px"
                >下書き保存</v-btn
              >
              <br />
              <v-btn
                outlined
                color="#13ABA3"
                @click="preview()"
                min-width="150px"
                width="259px"
                class="mt-6"
                >プレビュー</v-btn
              >
              <br />
              <v-btn
                type="submit"
                color="#13ABA3"
                class="white--text mt-6"
                min-width="150px"
                width="259px"
                depressed
                >公開</v-btn
              >
              <br />
              <v-btn
                class="mt-8"
                @click="dialog.deletePost = true"
                text
                color="#E14D56"
              >
                削除
              </v-btn>
            </v-card>
            <v-card min-height="106px" class="my-5"
              ><div class="text-center pt-6">
                ステータス変更
              </div>
              <div class="d-flex justify-center">
                <div
                  class="mt-3 pl-1"
                  v-for="item in internshipPostStatusList"
                  :key="item.id"
                >
                  <div v-if="internshipPostStatus == item.id">
                    <v-btn
                      @click="internshipPostStatus = item.id"
                      v-model="internshipPostStatus"
                      rounded
                      width="72.6px"
                      height="20px"
                      depressed
                      color="#E3D129"
                      class="font-12px white--text"
                      >{{ item.title }}
                    </v-btn>
                  </div>
                  <div v-else>
                    <v-btn
                      @click="internshipPostStatus = item.id"
                      v-model="internshipPostStatus"
                      rounded
                      width="72.6px"
                      height="20px"
                      outlined
                      color="#7D7D7D"
                      class="font-12px"
                      >{{ item.title }}
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-card>
            <v-card
              class="d-flex align-center justify-center mb-5"
              min-height="106px"
            >
              <div class="text-7d font-18px">
                <v-icon color="#D25CA1" class="mb-1">$HeartIcon</v-icon>
                <span class="pt-2 ml-2">お気に入り</span>
                <span class="ml-2">{{ numberOfFavourites }}</span>
              </div>
              <div class="text-7d font-18px ml-12">
                <v-icon color="#5AB8ED" class="mb-1">$PaperPlaneIcon</v-icon>
                <span class="pt-2 ml-2">応募</span>
                <span class="ml-2">{{ numberOfApplications }}</span>
              </div>
            </v-card>
            <ImageUpload :data="imageDetails" />
          </v-col>
        </v-row>
      </v-form>
    </validation-observer>

    <SimpleModel
      text="この求人を下書きとして保存しますか？"
      :dialog="dialog.saveAsDraft"
      @submitSuccess="saveAsDraft()"
      @closeModel="dialog.saveAsDraft = false"
    ></SimpleModel>
    <SimpleModel
      text="この求人を削除しますか？"
      :dialog="dialog.deletePost"
      :submitButtonText="'削除する'"
      @submitSuccess="deleteInformation()"
      @closeModel="dialog.deletePost = false"
    ></SimpleModel>
  </div>
</template>

<script>
import ImageUpload from '@/components/ui/ImageUpload'
import InternshipBasicInformation from '@/components/pages/PostInputs'
import InternshipMixins from './internship.mixin'
import SimpleModel from '@/components/models/SimpleModel'

export default {
  name: 'InternshipPostEdit',
  components: {
    ImageUpload,
    InternshipBasicInformation,
    SimpleModel
  },
  mixins: [InternshipMixins],
  data() {
    return {
      title: '求人広告',
      subTitle: '編集',
      numberOfFavourites: 0,
      numberOfApplications: '0',
      internshipPostStatus: '1',
      internshipPostStatusList: [
        { title: '募集中', id: '0' },
        { title: '募集終了', id: '1' }
      ],
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
  methods: {
    async getDataFromApi() {
      await this.$store
        .dispatch('COMPANY_GET_ALL', { showActive: 1 })
        .then(() => {
          this.getPageFields()
        })

      this.$store
        .dispatch('INTERNSHIP_GET', { id: this.$route.params.id })
        .then(() => {
          this.setPageData()
        })
    },
    setPageData() {
      this.basicInformation.forEach(item => {
        if (item.name == 'display_order_select') {
          if (this.getSingleInternship?.display_order) {
            item.value = 1
            item.additional_field.value = this.getSingleInternship.display_order
          }
        } else if (item.name == 'internship_feature_id') {
          item.value = this.getSingleInternship.internship_feature_posts
            ? this.getSingleInternship.internship_feature_posts.map(i => i.id)
            : []
        } else if (this.getSingleInternship?.[item.name]) {
          item.value = this.getSingleInternship[item.name]
        }
      })

      this.internshipPostStatus = `${this.getSingleInternship?.status}`
      this.numberOfApplications = this.getSingleInternship?.applications_count
      this.numberOfFavourites = this.getSingleInternship?.favorites_count
      this.imageDetails = {
        previewImageURL: this.getSingleInternship?.seo_featured_image,
        seo_ogp: {
          value: this.getSingleInternship?.seo_ogp
        },
        seo_slug: {
          value: this.getSingleInternship?.seo_slug
        },
        seo_meta_description: {
          value: this.getSingleInternship?.seo_meta_description
        }
      }
    },
    submitInformation(isDraftCheck = 'N') {
      this.isDraftOrPublic = '0' // draft post
      // Re-add required to rules If draft button is not clicked
      if (isDraftCheck == 'N') {
        this.isDraftOrPublic = '1' // public post
        this.basicInformation = this.basicInformation.filter(item => {
          if (item.requiredChecks) {
            item.rules = 'required|' + item.rules
          }
          return item
        })
      }

      this.$nextTick(function() {
        this.basicInformation.push({
          name: 'status',
          value: this.internshipPostStatus
        })
        this.savePageData('update') // Mixins function
        this.dialog.saveAsDraft = false
      })
    },
    deleteInformation() {
      this.dialog.deletePost = false
      this.$store
        .dispatch('INTERNSHIP_DELETE', { id: this.$route.params.id })
        .then(() => {
          this.$router.push({ name: 'InternshipPostList' })
        })
    }
  }
}
</script>
<style lang="scss" src="./style.scss" scoped></style>
