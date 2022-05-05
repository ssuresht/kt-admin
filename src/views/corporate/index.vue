<template>
  <div class="font-Noto-Sans corporate-page">
    <v-sheet color="transparent">
      <PageTitle
        :items="{
          title: '企業管理',
          subTitle: '一覧',
          tabs: [
            {
              title: 'アクティブ',
              count: getApprovedCompanies,
              action: showActiveTables
            },
            {
              title: 'インアクティブ',
              count: getNotApprovedCompanies,
              action: showNotActiveTables
            }
          ],
          buttons: [
            {
              title: 'CSVエクスポート',
              icon: null,
              action: this.downloadCsv,
              others: [{ outlined: true }],
              class: 'bg-white text-ff862f'
            },
            {
              title: '新規作成',
              icon: 'mdi-plus-circle',
              action: this.goToCreate,
              others: null,
              class: []
            }
          ]
        }"
      ></PageTitle>
      <SearchBox @search-table="searchTable"></SearchBox>
      <v-row>
        <v-col cols="12" md="12" class="d-flex w-100">
          <DataTable
            :items="initialLoad ? [] : getAllCorporate"
            :headers="headers"
            :total-records="totalRecords"
            :number-of-pages="totalPages"
            @update:options="updateTable"
            :loading="loading"
            @click:row="
              $router.push({
                name: 'CorporateEdit',
                params: { id: $event.id }
              })
            "
          >
            <template v-slot:[`item.id`]="{ item }">
              <span class="d-block text-center">
                {{ item.id }}
              </span>
            </template>
            <template v-slot:[`item.name`]="{ item }">
              <span>{{ item.name }}</span>
            </template>
            <template v-slot:item.created_at="{ item }">
              <span>{{ dateFormat(item.created_at) }}</span>
            </template>
            <template v-slot:item.business_industry="{ item }">
              <span>{{
                item.business_industry ? item.business_industry.name : ''
              }}</span>
            </template>
          </DataTable>
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<script>
import DataTable from '@/components/ui/DataTable'
import SearchBox from '@/components/ui/SearchBox'
import { mapGetters } from 'vuex'

export default {
  name: 'CorporateList',
  components: { DataTable, SearchBox },
  metaInfo: {
    title: 'コトナル 管理者 企業管理 | 企業一覧'
  },
  data: () => ({
    showActive: 1,
    headers: [
      {
        text: 'ID',
        align: 'center',
        sortable: true,
        value: 'id'
      },
      {
        text: '内部ID',
        align: 'left',
        sortable: false,
        value: 'internal_company_id'
      },
      {
        text: '企業名',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      {
        text: '企業名カナ',
        align: 'left',
        sortable: false,
        value: 'furigana_name'
      },
      {
        text: '業界',
        value: 'business_industry'
      },
      {
        text: '登録日',
        width: '180px',
        sortable: true,
        value: 'created_at'
      }
    ],
    navigation: null,
    search: null,
    initialLoad: true,
    loading: false
  }),
  created() {
    this.getDataFromApi()
  },
  async mounted() {
    await this.$store.dispatch('GET_MASTER_DATA')
  },
  computed: {
    ...mapGetters([
      'getAllCorporate',
      'getCorporatePagination',
      'getNotApprovedCompanies',
      'getApprovedCompanies',
      'getCsvData'
    ]),
    totalRecords() {
      return this.getCorporatePagination?.records_total
        ? this.getCorporatePagination?.records_total
        : 0
    },
    totalPages() {
      return this.getCorporatePagination?.total_pages
        ? this.getCorporatePagination?.total_pages
        : 0
    }
  },
  methods: {
    showActiveTables() {
      this.showActive = 1
      this.getDataFromApi()
    },
    showNotActiveTables() {
      this.showActive = 0
      this.getDataFromApi()
    },
    goToCreate() {
      this.$router.push({
        name: 'CorporateCreate'
      })
    },
    async downloadCsv() {
      await this.$store.dispatch('CORPORATE_EXPORT_CSV')
      let fileUrl = window.URL.createObjectURL(
        new Blob([this.getCsvData], {
          type: 'text/plain;charset=UTF-8'
        })
      )
      let fileLink = document.createElement('a')

      fileLink.href = fileUrl
      fileLink.setAttribute(
        'download',
        `企業情報_${this.$moment().format('YYYYMMDD')}.csv`
      )
      document.body.appendChild(fileLink)
      fileLink.click()
      document.body.removeChild(fileLink)
    },
    async toggleTableEnteries(index) {
      this.selectors[index].selected = true
      await this.getDataFromApi()
    },
    searchTable(search) {
      this.getDataFromApi(undefined, { search })
    },
    async getDataFromApi(e = undefined, obj = {}) {
      this.loading = true

      let data = {}
      data.sort_by_order = e?.sortDesc[0] ? 'asc' : 'desc'
      data.sort_by = e?.sortBy[0] ? e.sortBy[0] : 'created_at'
      data.page = e?.page ? e.page : 1
      data.paginate = e?.itemsPerPage ? e.itemsPerPage : 25
      obj.showActive = this.showActive
      data = Object.assign({}, obj, data)

      await this.$store
        .dispatch('CORPORATE_GET_ALL', data)
        .then(() => {
          if (this.initialLoad) this.initialLoad = false
        })
        .finally(() => (this.loading = false))
    },
    updateTable(e) {
      if (!this.initialLoad) this.getDataFromApi(e)
    }
  }
}
</script>
<style src="./style.scss" lang="scss" />
