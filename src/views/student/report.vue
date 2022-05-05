<template>
  <div
    class="full-width white px-16 border-radius elevation"
    :class="[dataFound ? '' : 'h-585']"
  >
    <template v-if="!dataFound">
      <div class="full-height d-flex align-center flex-column justify-center">
        <div class="text-8e8e font-14px fw-400">
          フィードバックはありません
        </div>
        <div class="d-flex align-center justify-center mt-5">
          <v-btn color="primary" width="236px" height="35px">
            <div class="px-9">フィードバックを作成する</div>
          </v-btn>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- title -->
      <div
        class="d-flex align-center fw-500 font-18px full-width mt-14 mb-7 justify-center"
      >
        Kotonaru Power 8
      </div>
      <div class="d-flex align-center justify-center">
        <!-- tables -->
        <v-simple-table
          class="report-table"
          v-for="(table, i) in feedbackTables"
          :key="i"
          :class="[i > 0 ? 'ml-12' : '']"
        >
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left"></th>
                <th class="text-center px-0">
                  <v-icon size="16">$leadership</v-icon>
                </th>
                <th class="text-left pl-10 pr-16">
                  <v-icon size="16">$indepth</v-icon>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in table" :key="index">
                <td class="pr-16 pl-0">
                  <v-sheet
                    flat
                    elevation="0"
                    width="129"
                    height="24"
                    class="d-flex align-center justify-center bg-fffbf0 rounded-16"
                    ><div class="font-14px">{{ item.title }}</div></v-sheet
                  >
                </td>
                <td class="px-0">{{ item.superPowerReview }}</td>
                <td class="pl-10 pr-16">{{ item.growthIdeaReview }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
      <!-- feed back -->
      <div class="mt-16 mb-7 fw-500 font-18px">フィードバック一覧</div>
      <br />
      <!-- panels -->
      <div class="full-width panel-parent">
        <v-expansion-panels
          v-for="(panel, i) in panels"
          :key="i"
          class="mb-6"
          flat
          accordion
        >
          <v-expansion-panel :class="[i === panels.length - 1 ? '' : 'panel']">
            <v-expansion-panel-header class="px-0 pt-0 pb-7"
              ><div class="fw-500 font-14px">{{ panel.title }}</div>
              <template v-slot:actions>
                <v-icon color="primary">
                  $expand
                </v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="panel-content pr-0">
              <div class="" v-for="(item, j) in panel.feedbacks" :key="j">
                <div
                  class="full-width d-flex align-center justify-end font-14px fw-400 text-8e8e"
                >
                  {{ item.date }}
                  <v-sheet
                    v-ripple
                    depressed
                    color="transparent"
                    class="ml-3 d-flex align-center justify-center mouse-pointer"
                    width="15px"
                    height="13px"
                    @click="goTo('FeedbackEdit', item.id)"
                  >
                    <v-icon size="13">$edit</v-icon>
                  </v-sheet>
                </div>
                <div
                  class="full-width"
                  v-for="(feedback, index) in item.feedbacks"
                  :key="index"
                >
                  <div
                    class="d-flex align-center mb-2"
                    :class="[index > 0 ? 'mt-4' : '']"
                  >
                    <v-icon size="16" class="mr-2">{{ feedback.icon }}</v-icon>
                    <div class="fw-500 font-14px">{{ feedback.title }}</div>
                  </div>
                  <div class="">
                    {{ feedback.description }}
                  </div>
                </div>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <!-- feedback button -->
      <div class="d-flex align-center justify-center mb-16">
        <v-btn color="primary" width="236px" height="35px">
          <div class="px-9">フィードバックを作成する</div>
        </v-btn>
      </div>
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      dataFound: true,
      feedbackTables: [
        [
          {
            title: 'リーダーシップ',
            superPowerReview: 0,
            growthIdeaReview: 0
          },
          {
            title: '大胆さ',
            superPowerReview: 0,
            growthIdeaReview: 0
          },
          {
            title: '外向的',
            superPowerReview: 0,
            growthIdeaReview: 0
          },
          {
            title: '創造性',
            superPowerReview: 0,
            growthIdeaReview: 0
          }
        ],
        [
          {
            title: '協調性',
            superPowerReview: 0,
            growthIdeaReview: 0
          },
          {
            title: '綿密さ',
            superPowerReview: 0,
            growthIdeaReview: 0
          },
          {
            title: '内省的',
            superPowerReview: 0,
            growthIdeaReview: 0
          },
          {
            title: '論理性',
            superPowerReview: 0,
            growthIdeaReview: 0
          }
        ]
      ],
      panels: []
    }
  },
  async mounted() {
    await this.getData()
    this.assignData()
  },
  computed: {
    ...mapGetters(['getStudentFeedback', 'getStudentComments'])
  },
  methods: {
    goTo(name, id) {
      this.$router.push({
        name,
        params: {
          id
        }
      })
    },
    assignData() {
      this.panels = this.getStudentComments.map(data => {
        // getting the company
        const company = data.company_info
        // getting the comments
        const comments = data.comments.sort((a, b) => {
          // sort by the posted date
          let difference = this.$moment(a.posted_month, 'YYYY-MM').diff(
            this.$moment(b.posted_month, 'YYYY-MM'),
            'month'
          )
          if (difference > 0) {
            return -1
          }
          if (difference < 0) {
            return 1
          }
          return 0
        })
        // extract the feedback
        let feedbacks = []
        comments.forEach(comment => {
          const temp = {
            date: this.dateFormat(comment.posted_month, 'YYYY年M月'),
            id: comment.id,
            feedbacks: [
              {
                icon: '$leadership',
                title: 'リーダーシップ',
                description: comment.super_power_comment
              },
              {
                icon: '$indepth',
                title: '綿密さ',
                description: comment.growth_idea_comment
              }
            ]
          }
          feedbacks.push(temp)
        })

        return {
          title: company.name,
          feedbacks
        }
      })
      this.feedbackTables.forEach((feedback, index) => {
        let i = 1
        if (index > 0) {
          i = 5
        }
        feedback.forEach(feed => {
          feed.superPowerReview = parseInt(
            this.getStudentFeedback[`super_power_review_${i}`]
          )
          feed.growthIdeaReview = parseInt(
            this.getStudentFeedback[`growth_idea_review_${i}`]
          )
          ++i
        })
      })
    },
    async getData() {
      await this.$store.dispatch('GET_STUDENT_FEEDBACK', this.$route.params.id)
    }
  }
}
</script>
<style src="./index.scss" lang="scss"></style>
