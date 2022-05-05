<template>
  <div class="">
    <PageTitle
      :items="{
        title: 'フィードバック',
        subTitle: '一覧',
        tabs: [
          {
            title: '募集中',
            count: getFeedbackCounts ? getFeedbackCounts.public : 0,
            action: () => {
              selectedTab = 'N'
              getDataFromApi()
            }
          },
          {
            title: '募集終了',
            count: getFeedbackCounts ? getFeedbackCounts.drafts : 0,
            action: () => {
              selectedTab = 'Y'
              getDataFromApi()
            }
          }
        ],
        buttons: [
          {
            title: '詳細条件検索',
            others: {
              outlined: true
            },
            class: 'bg-white',
            action: () => {
              toggleSearch = !toggleSearch
            }
          },
          {
            title: '新規作成',
            icon: 'mdi-plus-circle',
            action: () => {
              $router.push({
                name: 'FeedbackCreate'
              })
            }
          }
        ]
      }"
    ></PageTitle>
    <v-fade-transition>
      <SearchArea
        v-if="toggleSearch"
        class="mb-5"
        @toggleSearch="toggleSearch = !toggleSearch"
        v-bind="{ toggleSearch, selectTypeOptions, searchFields }"
        @searchSubmit="searchSubmit($event)"
        @changedInputType="setChangedInputType($event)"
        @resetForm="getDataFromApi()"
      ></SearchArea>
    </v-fade-transition>
    <DataTable
      :headers="headers"
      :items="getAllFeedbacks"
      :total-records="
        getFeedbackPagination ? getFeedbackPagination.records_total : 0
      "
      :number-of-pages="
        getFeedbackPagination ? getFeedbackPagination.total_pages : 0
      "
      @update:options="updateTable"
      @click:row="
        $router.push({
          name: 'FeedbackEdit',
          params: { id: $event.id }
        })
      "
    >
      <template v-slot:item.created_at="{ item }">
        {{ item.created_at | moment('YYYY-MM-DD') }}
      </template>
      <template v-slot:item.student_full_name="{ item }">
        {{ `${item.student.family_name} ${item.student.first_name}` }}
      </template>
    </DataTable>
  </div>
</template>
<script>
import DataTable from '@/components/ui/DataTable'
import SearchArea from '@/components/ui/SearchArea'
import { mapGetters } from 'vuex'
export default {
  components: { DataTable, SearchArea },
  data() {
    return {
      selectedTab: 'N',
      toggleSearch: false,
      searchFields: [],
      selectTypeOptions: [
        {
          name: 'キーワード検索',
          id: 'keyword_search'
        },
        {
          name: '対象月',
          id: 'posted_month'
        }
      ],
      headers: [
        {
          text: '企業ID',
          value: 'companies.internal_company_id',
          sortable: false,
          width: '7.70%',
          align: 'center'
        },
        {
          text: '企業名',
          value: 'companies.name',
          sortable: false,
          width: '23.6%'
        },
        {
          text: '学生ID',
          value: 'student.student_internal_id',
          sortable: false,
          width: '7.8%'
        },
        {
          text: '学生名',
          value: 'student_full_name',
          sortable: false,
          width: '9.5%'
        },
        {
          text: '大学名',
          value: 'student.university_name',
          sortable: false,
          width: '21.38%'
        },
        {
          text: '対象月',
          value: 'posted_month',
          sortable: false,
          width: '20.625%'
        },
        {
          text: '登録日',
          value: 'created_at',
          sortable: true,
          width: '9.16%'
        }
      ],
      initialLoad: true
    }
  },
  created() {
    this.setChangedInputType('keyword_search')
    this.getDataFromApi()
  },
  computed: {
    ...mapGetters([
      'getAllFeedbacks',
      'getFeedbackPagination',
      'getFeedbackCounts'
    ])
  },
  methods: {
    updateTable(e) {
      if (!this.initialLoad) this.getDataFromApi(e)
    },
    async getDataFromApi(e = undefined, obj = {}) {
      let data = {
        sort_by_order: e?.sortDesc[0] ? 'asc' : 'desc',
        sort_by: e?.sortBy[0] ? e.sortBy[0] : 'created_at',
        page: e?.page ? e.page : 1,
        paginate: e?.itemsPerPage ? e.itemsPerPage : 25,
        is_draft_or_public: this.selectedTab
      }

      data = Object.assign({}, obj, data)

      await this.$store.dispatch('FEEDBACK_GET_ALL', data)

      this.initialLoad = false
    },

    setChangedInputType(inputSearchType) {
      if (inputSearchType == 'keyword_search') {
        this.searchFields = [
          {
            label: 'Search text',
            name: 'search',
            type: 'text',
            value: null,
            placeholder: '企業ID、企業名、学生ID、学生名、大学名',
            rules: 'required'
          }
        ]
      } else if (inputSearchType == 'posted_month') {
        this.searchFields = [
          {
            label: 'Label',
            name: 'posted_month_start',
            type: 'date',
            datePickerType: 'YYYY-MM',
            rules: 'required',
            show_after_approx: true,
            value: null,
            menu: false,
            locale: 'ja'
          },
          {
            label: 'Label',
            name: 'posted_month_end',
            type: 'date',
            rules: 'required',
            show_after_approx: false,
            value: null,
            menu: false,
            locale: 'ja',
            datePickerType: 'YYYY-MM'
          }
        ]
      } else {
        this.searchFields = []
      }
    },
    searchSubmit($event) {
      let obj = {}
      if ($event.fields.length > 0) {
        $event.fields.forEach(field => {
          obj[field.name] = field.value
        })

        this.getDataFromApi(undefined, obj)
      }
    }
  }
}
</script>
