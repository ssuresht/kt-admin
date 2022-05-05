<template>
  <div>
    <PageTitle
      :items="{
        title: 'コラム',
        subTitle: '新規作成',
        back: {
          action: () => {
            $router.push({
              name: 'Media'
            })
          }
        }
      }"
    >
    </PageTitle>

    <validation-observer ref="observer">
      <v-form @submit.prevent="submitMediaPost()">
        <v-row>
          <v-col cols="8">
            <ColumnInformation
              :editorHeight="`740px`"
              :sectionTitle="false"
              :basicInformation="columnInformation"
            />
          </v-col>
          <v-col cols="4">
            <v-card height="207px" class="text-center pt-14">
              <v-btn
                @click="dialog.saveAsDraft = true"
                outlined
                color="#13ABA3"
                min-width="150px"
                width="259px"
                >下書き保存</v-btn
              >
              <v-btn
                type="submit"
                color="#13ABA3"
                class="white--text mt-6"
                min-width="150px"
                width="259px"
                >公開</v-btn
              >
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
  </div>
</template>

<script>
import ColumnInformation from '@/components/pages/PostInputs'
import ImageUpload from '@/components/ui/ImageUpload.vue'
import ColumnTag from '@/components/pages/column/ColumnTag.vue'
import SimpleModel from '@/components/models/SimpleModel'
import MediaMixin from './media.mixin'

export default {
  name: 'ColumnCreate',
  components: {
    ColumnInformation,
    ColumnTag,
    ImageUpload,
    SimpleModel
  },
  mixins: [MediaMixin],
  data() {
    return {
      dialog: {
        saveAsDraft: false
      }
    }
  },
  created() {
    this.getPageFields()
  },
  methods: {
    submitMediaPost(isDraftCheck = 'N') {
      this.isDraftOrPublic = '1' // draft post
      if (isDraftCheck == 'N') {
        this.isDraftOrPublic = '0' // public post
      }

      this.$nextTick(function() {
        this.savePageData('create') // Mixins function
        this.dialog.saveAsDraft = false
      })
    }
  }
}
</script>
