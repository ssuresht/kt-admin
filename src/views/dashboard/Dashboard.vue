<template>
  <div class="font-Noto-Sans dashboard-page">
    <v-sheet color="transparent">
      <v-row>
        <v-col
          cols="12"
          class="d-flex flex-wrap align-center justify-space-between w-100"
        >
          <div class="fw-500 w-auto d-flex flex-wrap align-center mt-5">
            <h2 class="font-24px mb-1 mr-4">{{ $t('dashboard.top') }}</h2>
            <div class="d-flex font-14px mr-6 align-center">
              <span
                class="d-inline-block mr-2 bg-green rounded-xl py-2 px-4 white--text"
              >
                登録学生数
              </span>
              <span class="d-inline-block">
                {{ getMasterData ? getMasterData.total_students : 0 }}
              </span>
            </div>
            <div class="d-flex font-14px mr-6 align-center">
              <span
                class="d-inline-block mr-2 bg-green rounded-xl py-2 px-4 white--text"
              >
                企業数
              </span>
              <span class="d-inline-block">
                {{ getMasterData ? getMasterData.total_companies : 0 }}
              </span>
            </div>
            <div class="d-flex font-14px mr-6 align-center">
              <span
                class="d-inline-block mr-2 bg-green rounded-xl py-2 px-4 white--text"
              >
                募集中求人広告数
              </span>
              <span class="d-inline-block">
                {{ getMasterData ? getMasterData.internship_posts_count : 0 }}
              </span>
            </div>
          </div>
          <div class="dashboard-top-right w-auto mt-auto">
            <div
              class="d-flex flex-wrap align-center text-light-dark font-14px"
            >
              <span class="mr-5 mb-auto">最終更新</span>
              <span class="text-right">
                <span class="d-block">2022/03/21 1:00</span>
                <span class="d-block text-grey font-10px"
                  >（毎日1:00更新）</span
                >
              </span>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="7" class="d-flex w-100">
          <v-card class="py-5 px-5 rounded-5 d-flex flex-column">
            <v-card-title class="px-0 py-0 font-18px">
              <span class="text-light-dark">
                応募数推移
              </span>
              <span class="text-grey font-12px fw-400 ml-auto">
                1日あたりの応募数推移
              </span>
            </v-card-title>
            <v-card-body>
              <div class="d-flex align-center mt-5">
                <div
                  class="chart-left-box mr-5 d-flex flex-column justify-center align-center"
                >
                  <div class="d-flex justify-center align-center">
                    <img
                      :src="require('@/assets/images/send-icon.png')"
                      alt="send"
                      class="send-icon-width"
                    />
                    <!-- <v-icon size="22" color="#AA158B">$openPaperPlane</v-icon> -->
                    <span class="font-12px color-violet ml-2 text-center">
                      <span class="d-block">
                        {{
                          getAllDashboard.ranking_intern_posts.start_date
                            | moment('MM/DD')
                        }}～{{
                          getAllDashboard.ranking_intern_posts.end_date
                            | moment('MM/DD')
                        }}
                      </span>
                      <span class="d-block">応募総数</span>
                    </span>
                  </div>
                  <h5 class="mb-2 mt-4 text-light-dark font-24px">
                    180 <span class="font-14px">件</span>
                  </h5>
                  <h6 class="text-grey font-10px ma-0">
                    （前30日比 ＋20件）
                  </h6>
                </div>
                <LineChart> </LineChart>
              </div>
            </v-card-body>
          </v-card>
        </v-col>
        <v-col cols="12" md="5" class="d-flex w-100">
          <v-card class="w-100 py-5 px-5 rounded-5 d-flex flex-column">
            <v-card-title class="px-0 py-0 font-18px">
              <span class="text-light-dark">
                応募数実績
              </span>
              <span class="text-grey font-12px fw-400 ml-auto">
                過去30日の求人1件に対する応募数の分布
              </span>
            </v-card-title>
            <v-card-body>
              <DoughnutChart
                :key="refreshDoughnutComponent"
                :showLabels="true"
                :labels="doughnutChartLabels"
              >
                <template
                  v-if="getAllDashboard && getAllDashboard.ranking_intern_posts"
                  slot="inner-text"
                >
                  <h6 class="text-light-dark font-10px ma-0">
                    {{
                      getAllDashboard.ranking_intern_posts.start_date
                        | moment('MM/DD')
                    }}～{{
                      getAllDashboard.ranking_intern_posts.end_date
                        | moment('MM/DD')
                    }}
                  </h6>
                  <h6 class="text-light-dark font-12px mb-3">応募総数</h6>
                  <h5 class="line-height-1 text-light-dark font-24px ma-0">
                    {{ getAllDashboard.ranking_intern_posts.rank_total }}
                    <span class="font-14px">件</span>
                  </h5>
                </template>
                <template slot="bottom-text">
                  <h6 class="ma-0 font-12px text-pie-bottom">
                    {{
                      getAllDashboard.ranking_intern_posts.start_date
                        | moment('MM/DD')
                    }}～{{
                      getAllDashboard.ranking_intern_posts.end_date
                        | moment('MM/DD')
                    }}
                    公開求人総数
                    {{ getAllDashboard.ranking_intern_posts.total_application }}
                  </h6>
                </template>
              </DoughnutChart>
            </v-card-body>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" class="d-flex w-100">
          <v-card class="py-5 px-5 rounded-5 d-flex flex-column w-100">
            <v-card-title class="px-0 py-0 font-18px">
              <span class="text-light-dark">
                人気求人広告
              </span>
              <span class="text-grey font-12px fw-400 ml-auto">
                現在募集中の求人広告における応募数ランキング
              </span>
            </v-card-title>
            <v-card-body>
              <v-simple-table
                class="classified-ads no-shadow mt-2 text-left mb-1"
              >
                <template v-slot:default>
                  <tbody>
                    <template
                      v-if="getAllDashboard && getAllDashboard.internship_posts"
                    >
                      <tr
                        v-for="(internPost,
                        index) in getAllDashboard.internship_posts"
                        :key="index"
                      >
                        <td class="text-primary">
                          {{ `${index + 1}` }}
                        </td>
                        <td>
                          <div class="ads-inner-blk d-flex py-3">
                            <v-img
                              class="ads-img-left rounded-5 my-auto"
                              width="147"
                              max-width="147"
                              height="100%"
                              :src="internPost.seo_featured_image"
                            >
                            </v-img>
                            <div class="ads-blk-right ml-3">
                              <span class="text-grey font-12px fw-400">
                                {{
                                  internPost.public_date | moment('YYYY/MM/DD')
                                }}公開</span
                              >
                              <p
                                class="text-light-dark font-14px fw-400 truncate-lines lines-2 ma-0"
                              >
                                {{ internPost.title }}
                              </p>
                              <h6 class="text-light-dark font-12px fw-400 ma-0">
                                {{
                                  internPost.company
                                    ? internPost.company.name
                                    : '-'
                                }}
                              </h6>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="d-flex">
                            <v-icon size="18" color="#13ABA3"
                              >$HeartIcon</v-icon
                            >
                            <span class="ml-2">{{
                              internPost.favorites_count
                            }}</span>
                          </div>
                        </td>
                        <td>
                          <div class="d-flex">
                            <v-icon size="18" color="#13ABA3"
                              >$PaperPlaneIcon</v-icon
                            >
                            <span class="ml-2">{{
                              internPost.applications_count
                            }}</span>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-body>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" class="d-flex w-100">
          <v-card class="py-5 px-5 rounded-5 d-flex flex-column w-100">
            <v-card-title class="px-0 py-0 font-18px">
              <span class="text-light-dark">
                人気コラム
              </span>
              <span class="text-grey font-12px fw-400 ml-auto">
                コラムの閲覧数ランキング
              </span>
            </v-card-title>
            <v-card-body>
              <div
                class="bg-primary font-14px white--text tbl-heading-text text-center rounded-5 mt-8 py-1"
              >
                <span>週間</span>
              </div>
              <v-simple-table class="classified-ads no-shadow text-left mb-1">
                <template v-slot:default>
                  <tbody>
                    <template
                      v-if="
                        getAllDashboard && getAllDashboard.popular_media_posts
                      "
                    >
                      <tr
                        v-for="(mediaOne,
                        index) in getAllDashboard.popular_media_posts"
                        :key="index"
                      >
                        <td class="pa-0 text-left text-primary">
                          {{ `${index + 1}` }}
                        </td>
                        <td>
                          <div class="ads-inner-blk d-flex py-3">
                            <v-img
                              class="ads-img-left my-auto"
                              width="86"
                              max-width="86"
                              height="59"
                              :src="mediaOne.seo_featured_image"
                            >
                            </v-img>
                            <div class="ads-blk-right ml-3">
                              <span class="text-grey font-12px fw-400">
                                {{
                                  mediaOne.public_date | moment('YYYY/MM/DD')
                                }}公開
                              </span>
                              <span class="text-grey font-12px fw-400 ml-5">
                                {{
                                  mediaOne.updated_at | moment('YYYY/MM/DD')
                                }}更新
                              </span>
                              <p
                                class="text-light-dark font-14px fw-400 truncate-lines lines-2 ma-0"
                              >
                                {{ mediaOne.title }}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="d-flex">
                            <v-icon size="18" color="#13ABA3">$eyeFill</v-icon>
                            <span class="ml-2">{{
                              mediaOne.media_views_count
                            }}</span>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </template>
              </v-simple-table>

              <div
                class="bg-primary font-14px white--text tbl-heading-text text-center rounded-5 mt-8 py-1"
              >
                <span>累計</span>
              </div>
              <v-simple-table class="classified-ads no-shadow text-left mb-1">
                <template v-slot:default>
                  <tbody>
                    <template
                      v-if="
                        getAllDashboard &&
                          getAllDashboard.popular_all_media_posts
                      "
                    >
                      <tr
                        v-for="(mediaTwo,
                        index) in getAllDashboard.popular_all_media_posts"
                        :key="index"
                      >
                        <td class="pa-0 text-left text-primary">
                          {{ `${index + 1}` }}
                        </td>
                        <td>
                          <div class="ads-inner-blk d-flex py-3">
                            <v-img
                              class="ads-img-left my-auto"
                              width="86"
                              max-width="86"
                              height="59"
                              :src="mediaTwo.seo_featured_image"
                            >
                            </v-img>
                            <div class="ads-blk-right ml-3">
                              <span class="text-grey font-12px fw-400">
                                {{
                                  mediaTwo.public_date | moment('YYYY/MM/DD')
                                }}公開
                              </span>
                              <span class="text-grey font-12px fw-400 ml-5">
                                {{
                                  mediaTwo.updated_at | moment('YYYY/MM/DD')
                                }}更新
                              </span>
                              <p
                                class="text-light-dark font-14px fw-400 truncate-lines lines-2 ma-0"
                              >
                                {{ mediaTwo.title }}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="d-flex">
                            <v-icon size="18" color="#13ABA3">$eyeFill</v-icon>
                            <span class="ml-2">{{
                              mediaTwo.media_views_count
                            }}</span>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-body>
          </v-card>
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<script>
import DoughnutChart from '@/components/charts/DoughnutChart'
import LineChart from '@/components/charts/LineChart'
import { mapGetters } from 'vuex'
export default {
  name: 'dashboard',
  metaInfo: {
    title: 'コトナル 管理者TOP'
  },
  components: {
    DoughnutChart,
    LineChart
  },
  data() {
    return {
      loading: false,
      initialLoaded: true,
      refreshDoughnutComponent: 1
    }
  },
  created() {
    this.getDataFromApi()
  },
  computed: {
    ...mapGetters(['getAllDashboard', 'user']),
    doughnutChartLabels() {
      return [
        {
          color: '#FF858E',
          percentage:
            this.getAllDashboard?.ranking_intern_posts?.percentage?.rank_1 ?? 0,
          text: '0',
          price:
            this.getAllDashboard?.ranking_intern_posts?.percentage?.rank_1 + '%'
        },
        {
          color: '#FECE45',
          percentage:
            this.getAllDashboard?.ranking_intern_posts?.percentage?.rank_2 ?? 0,
          text: '1～2',
          price:
            this.getAllDashboard?.ranking_intern_posts?.percentage?.rank_2 + '%'
        },
        {
          color: '#15B1AB',
          percentage:
            this.getAllDashboard?.ranking_intern_posts?.percentage?.rank_3 ?? 0,
          text: '3～5',
          price:
            this.getAllDashboard?.ranking_intern_posts?.percentage?.rank_3 + '%'
        },
        {
          color: '#00746F',
          percentage:
            this.getAllDashboard?.ranking_intern_posts?.percentage?.rank_4 ?? 0,
          text: '5～',
          price:
            this.getAllDashboard?.ranking_intern_posts?.percentage?.rank_4 + '%'
        }
      ]
    }
  },
  methods: {
    async getDataFromApi() {
      await this.$store
        .dispatch('DASHBOARDS_GET_ALL', {
          id: this.user?.id ?? 0
        })
        .then(() => {
          this.refreshDoughnutComponent++
        })
    }
  }
}
</script>
<style src="./Dashboard.scss" lang="scss" />
