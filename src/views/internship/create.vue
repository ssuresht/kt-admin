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
            <internship-basic-information
              :basicInformation="basicInformation"
            />
          </v-col>
          <v-col cols="4">
            <v-card height="264px" class="text-center pt-14">
              <div class="button-width mx-auto">
                <div
                  :class="{ 'px-2': $vuetify.breakpoint.smAndDown }"
                  class="btn-container"
                >
                  <v-btn
                    block
                    outlined
                    type="button"
                    @click="dialog.saveAsDraft = true"
                    color="#13ABA3"
                    >下書き保存</v-btn
                  >
                  <br />
                  <v-btn
                    block
                    outlined
                    type="button"
                    @click="preview()"
                    color="#13ABA3"
                    class="mt-6"
                    >プレビュー</v-btn
                  >
                  <br />
                  <v-btn
                    block
                    type="submit"
                    color="#13ABA3"
                    class="white--text mt-6 button-width"
                    >公開</v-btn
                  >
                </div>
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
    <InterPreviewModel
      :dialog="dialog.preview"
      @submitSuccess="preview()"
      @closeModel="dialog.preview = false"
    ></InterPreviewModel>
  </div>
</template>

<script>
import PageTitle from '@/components/ui/PageTitle'
import InternshipBasicInformation from '@/components/pages/PostInputs'
import ImageUpload from '@/components/ui/ImageUpload'
import SimpleModel from '@/components/models/SimpleModel'
import InterPreviewModel from '@/components/models/InterPreviewModel'
import InternshipMixins from './internship.mixin'

export default {
  name: 'InternshipPostCreate',
  components: {
    InternshipBasicInformation,
    PageTitle,
    ImageUpload,
    SimpleModel,
    InterPreviewModel
  },
  mixins: [InternshipMixins],
  data() {
    return {
      title: '求人広告',
      subTitle: '新規作成',
      dialog: {
        saveAsDraft: false,
        preview: false
      }
    }
  },
  created() {
    this.getPageFields()
  },
  methods: {
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
        this.savePageData('create') // Mixins function
        this.dialog.saveAsDraft = false
      })
    }
  }
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
