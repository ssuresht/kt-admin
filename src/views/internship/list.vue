<template>
  <div>
    <PageTitle
      @tab:clicked="getDataFromApi(undefined, $event)"
      :items="{
        title: title,
        subTitle: subTitle,
        tabs: [
          {
            title: '募集中',
            count: getInternshipCounts ? getInternshipCounts.total_opened : 0,
            action: () => {
              selectedTab = 'N'
              getDataFromApi()
            }
          },
          {
            title: '募集終了',
            count: getInternshipCounts ? getInternshipCounts.total_ended : 0,
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
              toggleSearch = !toggleSearch
            }
          },
          {
            title: '新規作成',
            icon: 'mdi-plus-circle',
            action: () => {
              $router.push({ name: 'InternshipPostCreate' })
            }
          }
        ]
      }"
    ></PageTitle>
    <SearchArea
      v-if="toggleSearch"
      @toggleSearch="setToggleSearch($event)"
      @searchSubmit="searchSubmit($event)"
      @changedInputType="setChangedInputType($event)"
      @resetForm="getDataFromApi()"
      :toggleSearch="toggleSearch"
      :searchFields="searchFields"
      :selectTypeOptions="selectTypeOptions"
      class="mb-4"
    ></SearchArea>

    <DataTable
      :items="loading ? [] : getAllInternship"
      :headers="headers"
      :total-records="
        getInternshipPagination ? getInternshipPagination.records_total : 0
      "
      :number-of-pages="
        getInternshipPagination ? getInternshipPagination.total_pages : 0
      "
      @update:options="updateTable"
      @click:row="
        $router.push({
          name: 'InternshipPostEdit',
          params: { id: $event.id }
        })
      "
    >
      <template v-slot:[`item.company_name`]="{ item }">
        {{ item.company ? item.company.name : '-' }}
      </template>
      <template v-slot:[`item.work_category_name`]="{ item }">
        {{ item.work_category ? item.work_category.name : '-' }}
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        {{
          item.created_at && item.created_at != ''
            ? item.created_at
            : '---- / - / -' | moment('YYYY/MM/DD H:mm')
        }}
      </template>
    </DataTable>
  </div>
</template>

<script>
import PageTitle from '@/components/ui/PageTitle'
import DataTable from '@/components/ui/DataTable'
import SearchArea from '@/components/ui/SearchArea'
import { mapGetters } from 'vuex'
export default {
  name: 'InternshipPostList',
  components: {
    DataTable,
    PageTitle,
    SearchArea
  },
  data() {
    return {
      title: '求人広告',
      subTitle: '一覧',
      loading: false,
      initialLoad: true,
      selectedTab: 'N',
      toggleSearch: false,
      searchFields: [],
      selectTypeOptions: [
        { id: 'search', name: 'キーワード検索' },
        { id: 'industry', name: '業界' },
        { id: 'work', name: '職種' },
        { id: 'public_date', name: '公開日' }
      ],
      headers: [
        {
          text: 'ID',
          align: 'center',
          sortable: false,
          value: 'id'
        },
        {
          text: '求人タイトル',
          align: 'center',
          sortable: false,
          value: 'title'
        },
        {
          text: '企業名',
          align: 'center',
          sortable: false,
          value: 'company_name'
        },
        {
          text: '職種',
          align: 'center',
          sortable: false,
          value: 'work_category_name'
        },
        {
          text: '公開日',
          align: 'center',
          sortable: true,
          value: 'created_at'
        },
        {
          text: '',
          align: 'center',
          sortable: false,
          value: 'favorites_count',
          heartIcon: true,
          sortable: true,
          width: '30px'
        },
        {
          text: '',
          align: 'center',
          value: 'applications_count',
          paperPlaneIcon: true,
          sortable: true,
          width: '30px'
        }
      ]
    }
  },
  created() {
    this.getDataFromApi()
  },
  computed: {
    ...mapGetters([
      'getAllInternship',
      'getInternshipPagination',
      'getInternshipCounts'
    ])
  },
  methods: {
    async getDataFromApi(e = undefined, obj = {}) {
      this.loading = true

      let data = {}
      data.sort_by_order = e?.sortDesc[0] ? 'asc' : 'desc'
      data.sort_by = e?.sortBy[0] ? e.sortBy[0] : 'created_at'
      data.page = e?.page ? e.page : 1
      data.paginate = e?.itemsPerPage ? e.itemsPerPage : 25

      data.status = this.selectedTab
      data.draft_or_public = 'public'

      data = Object.assign({}, obj, data)

      if (data.search == '') {
        delete data.search
      }
      await this.$store
        .dispatch('INTERNSHIP_GET_ALL', data)
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

    setChangedInputType(inputSearchType) {
      if (inputSearchType == 'search') {
        this.searchFields = [
          {
            label: 'Label',
            name: 'search',
            type: 'text',
            value: '',
            placeholder: '求人ID、求人タイトル、企業名'
          }
        ]
      } else if (inputSearchType == 'public_date') {
        this.searchFields = [
          {
            label: 'Label',
            name: 'date_from',
            type: 'date',
            rules: 'required',
            show_after_approx: true,
            value: `${this.$moment().format('YYYY-MM-DD')}`,
            menu: false,
            locale: 'ja',
            date_format: 'YYYY-MM-DD 00:00'
          },
          {
            label: 'Label',
            name: 'date_to',
            type: 'date',
            rules: 'required',
            show_after_approx: false,
            value: `${this.$moment().format('YYYY-MM-DD')}`,
            menu: false,
            locale: 'ja',
            range: true,
            range_input: 'date_from',
            date_format: 'YYYY-MM-DD 23:59'
          }
        ]
      } else if (inputSearchType == 'industry') {
        this.searchFields = [
          {
            label: 'Label',
            name: 'business_industry_ids',
            type: 'select',
            rules: 'required',
            item_value: 'id',
            item_text: 'name',
            items: this.getMasterData?.business_industories
          }
        ]
      } else if (inputSearchType == 'work') {
        this.searchFields = [
          {
            label: 'Label',
            name: 'work_category_ids',
            type: 'select',
            rules: 'required',
            item_value: 'id',
            item_text: 'name',
            items: this.getMasterData?.work_categories
          }
        ]
      } else {
        this.searchFields = []
      }
    },
    setToggleSearch($event) {
      this.toggleSearch = $event
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

<style lang="scss" scoped></style>
