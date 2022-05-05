<template>
  <v-container class="intern-detail-page my-5">
    <v-row>
      <v-col cols="12" md="12">
        <div
          class="position-relative company-image"
          :class="{
            'mx-n3 no-border-radius': $vuetify.breakpoint.smAndDown,
          }"
        >
          <v-img
            width="100%"
            class="image-fluid"
            :class="{
              'no-border-radius': $vuetify.breakpoint.smAndDown,
            }"
            height="404px"
            :src="getPreviewInternship.seo_featured_image"
          >
          </v-img>
          <!-- add to favorites -->
          <div class="position-absolute heart-icon">
            <v-icon
              color="#D25CA1"
              :size="$vuetify.breakpoint.smAndDown ? '20' : '35px'"
              >{{ isFavaourited ? `$favouritedIcon` : `$HeartIcon` }}</v-icon
            >
          </div>
          <div
            class="
              position-absolute
              post-counter
              d-flex
              align-center
              justify-center
              mr-5
              mb-3
            "
          >
            <span class="d-flex align-center mr-4">
              <v-icon
                :size="$vuetify.breakpoint.smAndDown ? '20' : '35px'"
                class="mr-2"
                >$lovedIcon</v-icon
              >
              <span
                class="white--text"
                :class="{
                  'font-24px': $vuetify.breakpoint.mdAndUp,
                  'font-14px': $vuetify.breakpoint.smAndDown,
                }"
              >
                1
              </span>
            </span>
            <span class="d-flex align-center">
              <v-icon
                :size="$vuetify.breakpoint.smAndDown ? '20' : '35px'"
                color="white"
                class="mr-2"
                >mdi-send</v-icon
              >
              <span
                class="white--text"
                :class="{
                  'font-24px': $vuetify.breakpoint.mdAndUp,
                  'font-14px': $vuetify.breakpoint.smAndDown,
                }"
              >
                1
              </span>
            </span>
          </div>
        </div>
        <div
          class="d-flex align-center"
          :class="{
            'justify-space-between mt-7': $vuetify.breakpoint.mdAndUp,
            'justify-end mt-2': $vuetify.breakpoint.smAndDown,
          }"
        >
          <span
            class="text-8e fw-400"
            :class="{
              'font-18px': $vuetify.breakpoint.mdAndUp,
              'font-12px': $vuetify.breakpoint.smAndDown,
            }"
            >更新日：{{ currentDate | moment('YYYY年MM月DD日') }}</span
          >
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-btn
              :class="{
                'font-14px': $vuetify.breakpoint.smAndDown,
                'font-18px': $vuetify.breakpoint.mdAndUp,
              }"
              class="btn-rounded"
              :color="canApply ? `primary` : `#AA158B`"
              height="auto"
              :min-width="buttonWidth"
              :min-height="buttonHeight"
            >
              <template v-if="canApply">
                <v-icon size="22px" color="white" class="mr-2">mdi-send</v-icon>
                <span class="white--text">このインターンに応募する</span>
              </template>
              <template v-else>
                <v-icon size="22px" color="white" class="mr-2"
                  >$warningIcon</v-icon
                >
                <span class="white--text">辞退する</span>
              </template>
            </v-btn>
          </template>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8" class="py-0 mt-md-n2 mt-sm-n1 mt-n1">
        <div class="post-title pr-4">
          <h2
            class="text-1f2020 fw-500"
            :class="{
              'font-24px': $vuetify.breakpoint.mdAndUp,
              'font-16px': $vuetify.breakpoint.smAndDown,
            }"
          >
            {{ getPreviewInternship.title }}
          </h2>
        </div>
      </v-col>
      <v-col cols="12" md="12" class="mt-md-2">
        <div
          class="d-md-flex align-center tags-list text-1f2020"
          :class="{
            'font-18px': $vuetify.breakpoint.mdAndUp,
            'font-14px': $vuetify.breakpoint.smAndDown,
          }"
        >
          <div
            v-if="companyLogo && currentCompany && currentCompany.logo_img"
            class="d-flex mr-7 company-logo-tag mb-md-auto mb-sm-3 mb-3"
          >
            <span class="company-log-box mr-2 d-flex">
              <img
                :src="currentCompany.logo_img"
                @error="handleImage"
                class="ma-auto"
              />
            </span>
            <span class="my-auto">
              {{ currentCompany.name }}
            </span>
          </div>

          <div class="d-flex mr-7 mb-md-auto mb-sm-2 mb-2" v-if="industryName">
            <span
              class="tag-box bg-c3 px-3 py-1 mr-2"
              :class="{
                'font-18px': $vuetify.breakpoint.mdAndUp,
                'font-14px': $vuetify.breakpoint.smAndDown,
              }"
            >
              業界
            </span>
            <span class="my-auto">
              {{ industryName }}
            </span>
          </div>

          <div class="d-flex mr-7 mb-md-auto mb-sm-2 mb-2">
            <span
              class="tag-box bg-c3 px-3 py-1 mr-2"
              :class="{
                'font-18px': $vuetify.breakpoint.mdAndUp,
                'font-14px': $vuetify.breakpoint.smAndDown,
              }"
            >
              職種
            </span>
            <span v-if="workCategoryName" class="my-auto">
              {{ workCategoryName }}
            </span>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="6" class="d-flex mt-md-3 mt-sm-n2 mt-n2">
        <v-card
          class="
            feature-card-list
            no-shadow
            px-md-10 px-sm-5 px-5
            py-md-9 py-sm-4 py-4
            full-width
          "
        >
          <v-sheet
            v-for="(feature, index) in features"
            :key="index"
            class="d-flex align-center border-bottom py-3 px-4"
          >
            <v-icon size="18px" class="mr-3">{{ feature.icon }}</v-icon>
            <div
              :class="{
                'font-16px': $vuetify.breakpoint.mdAndUp,
                'font-14px': $vuetify.breakpoint.smAndDown,
              }"
            >
              {{ feature.text }}
            </div>
          </v-sheet>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" class="d-flex mt-md-3 mt-sm-n2 mt-n2">
        <v-card
          class="
            advantages-card-list
            no-shadow
            px-md-12 px-sm-6 px-6
            py-8
            full-width
          "
        >
          <v-sheet
            v-for="(advantage, index) in advantages"
            :key="index"
            class="d-flex align-center bottom-line px-6 py-2"
          >
            <span class="font-Poppins-SemiBold font-20px mr-6">{{
              advantage.label
            }}</span>
            <div
              :class="{
                'font-16px': $vuetify.breakpoint.mdAndUp,
                'font-14px': $vuetify.breakpoint.smAndDown,
              }"
            >
              {{ advantage.text }}
            </div>
          </v-sheet>
        </v-card>
      </v-col>
      <v-col cols="12" md="12" class="mt-md-0 mt-sm-n2 mt-n2">
        <div class="description-txts mt-md-4">
          <h2
            class="
              desc-heading
              primary
              fw-500
              mb-md-8 mb-sm-2 mb-2
              white--text
              py-1
              px-md-6 px-sm-2 px-2
            "
            :class="{
              'font-24px': $vuetify.breakpoint.mdAndUp,
              'font-14px': $vuetify.breakpoint.smAndDown,
            }"
          >
            会社概要
          </h2>
          <v-card
            class="no-box-shadow px-md-16 px-sm-5 px-5 py-md-9 py-sm-4 py-4"
          >
            <span
              v-html="getPreviewInternship.description_corporate_profile"
            ></span>
          </v-card>
        </div>
      </v-col>

      <v-col cols="12" md="12" class="mt-md-1 mt-sm-n2 mt-n2">
        <div class="description-txts">
          <h2
            class="
              desc-heading
              primary
              fw-500
              mb-md-8 mb-sm-2 mb-2
              white--text
              py-1
              px-md-6 px-sm-2 px-2
            "
            :class="{
              'font-24px': $vuetify.breakpoint.mdAndUp,
              'font-14px': $vuetify.breakpoint.smAndDown,
            }"
          >
            募集内容
          </h2>
          <v-card
            class="no-box-shadow px-md-16 px-sm-5 px-5 py-md-9 py-sm-4 py-4"
          >
            <span v-html="getPreviewInternship.description_internship_content">
            </span>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'InternshipDetail',
  data() {
    return {
      loading: false,
      canApply: true,
      isFavaourited: 1,
      currentDate: this.$moment(),
      companyLogo: true,
    }
  },
  methods: {
    handleImage(e) {
      this.companyLogo = false
    },
  },
  computed: {
    ...mapGetters(['getPreviewInternship', 'user', 'getAllCompany']),
    buttonWidth() {
      return this.$vuetify.breakpoint.smAndDown ? '293px' : '318px'
    },
    buttonHeight() {
      return this.$vuetify.breakpoint.smAndDown ? '41px' : '54px'
    },
    currentCompany() {
      return this.getAllCompany.find(
        (i) => i.id == this.getPreviewInternship.company_id
      )
    },
    industryName() {
      return this.currentCompany?.business_industry?.name
    },
    workCategoryName() {
      return this.getMasterData?.work_categories.find(
        (i) => i.id == this.getPreviewInternship?.work_category_id
      ).name
    },
    features() {
      return [
        {
          icon: '$calenderIcon',
          text: this.getMasterData.period.find(
            (i) => i.id == this.getPreviewInternship?.period
          )?.name,
        },
        {
          icon: '$timeIcon',
          text: this.getMasterData.workload.find(
            (i) => i.id == this.getPreviewInternship?.workload
          )?.name,
        },
        {
          icon: '$stipendIcon',
          text: this.getMasterData.wage.find(
            (i) => i.id == this.getPreviewInternship?.wage
          )?.name,
        },
        {
          icon: '$universityIcon',
          text: this.getMasterData.target_grade.find(
            (i) => i.id == this.getPreviewInternship?.target_grade
          )?.name,
        },
        {
          icon: '$fingerTouch',
          text: this.getPreviewInternship.internship_feature_id
            ? this.getMasterData.internship_feature_list
                .filter((x) =>
                  this.getPreviewInternship.internship_feature_id.includes(
                    `${x.id}`
                  )
                )
                .map((x) => x.name)
                .join(', ')
            : '-',
        },
      ]
    },
    advantages() {
      console.log('fea', this.getPreviewInternship.internship_feature_id)
      return [
        {
          label: '01',
          text: this.getPreviewInternship?.application_step_1 ?? '-',
        },
        {
          label: '02',
          text: this.getPreviewInternship?.application_step_2 ?? '-',
        },
        {
          label: '03',
          text: this.getPreviewInternship?.application_step_3 ?? '-',
        },
        {
          label: '04',
          text: this.getPreviewInternship?.application_step_4 ?? '-',
        },
      ]
    },
  },
}
</script>

<style src="./style.scss" lang="scss" scoped></style>
