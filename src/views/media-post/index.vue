<template>
  <div class="">
    <PageTitle
      :items="{
        title: 'コラム',
        subTitle: '一覧',
        tabs: [
          {
            title: '公開中',
            count: getMediaCounts ? getMediaCounts.total_opened : 0,
            action: () => {
              selectedTab = 'N'
              getDataFromApi()
            }
          },
          {
            title: '下書き',
            count: getMediaCounts ? getMediaCounts.total_drafted : 0,
            action: () => {
              selectedTab = 'Y'
              getDataFromApi()
            }
          }
        ],
        buttons: [
          {
            title: '詳細条件検索',
            class: 'bg-white',
            others: {
              outlined: true
            },
            action: () => {
              searchBox = !searchBox
            }
          },
          {
            title: '新規作成',
            icon: 'mdi-plus-circle',
            action: () => {
              $router.push({ name: 'CreateMediaPost' })
            }
          }
        ]
      }"
    ></PageTitle>
    <v-fade-transition>
      <SearchBox
        v-if="searchBox"
        v-bind="{ toggleSearch: searchBox }"
        @search-table="searchTable($event)"
        @toggleSearch="searchBox = false"
        class="mb-5"
      ></SearchBox>
    </v-fade-transition>
    <DataTable
      :items="loading ? [] : getAllMedia"
      :headers="headers"
      :total-records="getMediaPagination ? getMediaPagination.records_total : 0"
      :number-of-pages="getMediaPagination ? getMediaPagination.total_pages : 0"
      @update:options="updateTable"
      @click:row="
        $router.push({ name: 'EditMediaPost', params: { id: $event.id } })
      "
    >
      <template v-slot:[`item.public_date`]="{ item }">
        {{
          item.public_date && item.public_date != ''
            ? item.public_date
            : '---- / - / -' | moment('YYYY/MM/DD')
        }}
      </template>
    </DataTable>
  </div>
</template>
<script>
import DataTable from '@/components/ui/DataTable'
import SearchBox from '@/components/ui/SearchBox'
import { mapGetters } from 'vuex'
export default {
  components: { DataTable, SearchBox },
  data() {
    return {
      loading: false,
      initialLoad: true,
      selectedTab: 'N',
      searchBox: false,
      searchValue: '',
      headers: [
        {
          text: 'No.',
          value: 'id',
          align: 'center',
          width: '10.72%',
          sortable: false
        },
        {
          text: 'タイトル',
          value: 'title',
          width: '65.44%',
          align: 'left',
          sortable: false
        },
        {
          text: '公開日',
          value: 'public_date',
          width: '7.78%',
          align: 'center',
          sortable: true
        },
        {
          text: '表示順',
          value: 'display_order',
          width: '6.17%',
          align: 'center',
          sortable: false
        },
        {
          text: '閲覧数',
          value: 'media_views_count',
          align: 'center',
          width: '15%',
          sortable: false
        }
      ]
    }
  },
  created() {
    this.getDataFromApi()
  },
  computed: {
    ...mapGetters(['getAllMedia', 'getMediaPagination', 'getMediaCounts'])
  },
  methods: {
    async getDataFromApi(e = undefined, obj = {}) {
      this.loading = true

      let data = {}
      data.sort_by_order = e?.sortDesc[0] ? 'asc' : 'desc'
      data.sort_by = e?.sortBy[0] ? e.sortBy[0] : 'public_date'
      data.page = e?.page ? e.page : 1
      data.paginate = e?.itemsPerPage ? e.itemsPerPage : 25

      data.is_draft = this.selectedTab

      if (this.searchValue) {
        data.search = this.searchValue
      }

      data = Object.assign({}, obj, data)

      await this.$store
        .dispatch('MEDIA_POST_GET_ALL', data)
        .then(res => {
          if (this.initialLoad) {
            this.initialLoad = false
          }
        })
        .finally(() => (this.loading = false))
    },
    updateTable(e) {
      if (!this.initialLoad) this.getDataFromApi(e)
    },
    searchTable(value) {
      this.searchValue = value
      this.getDataFromApi()
    }
  }
}
</script>
