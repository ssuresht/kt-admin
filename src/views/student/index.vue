<template>
  <div class="">
    <PageTitle :items="navigation"></PageTitle>

    <SearchStudent @search-table="searchTable" class="mb-6"></SearchStudent>
    <DataTable
      class="school-table"
      :headers="headers"
      :items="getAllStudent"
      :total-records="totalRecords ? totalRecords : 0"
      :number-of-pages="totalPages ? totalPages : 0"
      :loading="loading"
      @click:row="
        $router.push({
          name: 'StudentProfile',
          params: { id: $event.id }
        })
      "
      @update:options="updateTable"
    >
      <template v-slot:[`item.student_internal_id`]="{ item }">
        <span class="d-block text-center">
          {{ item.student_internal_id }}
        </span>
      </template>
      <template v-slot:[`item.first_name`]="{ item }">
        <span> {{ item.family_name }} {{ item.first_name }} </span>
      </template>

      <template v-slot:[`item.family_name_furigana`]="{ item }">
        <span
          >{{ item.family_name_furigana }} {{ item.first_name_furigana }}</span
        >
      </template>

      <template v-slot:[`item.graduate_year`]="{ item }">
        <span>{{ item.graduate_year }}/{{ item.graduate_month }}</span>
      </template>

      <template v-slot:[`item.created_at`]="{ item }">
        <span>{{ formatDate(item.created_at) }}</span>
      </template>
    </DataTable>
  </div>
</template>
<script>
import SearchStudent from '@/components/ui/SearchStudent'
import DataTable from '@/components/ui/DataTable'
import { mapGetters } from 'vuex'
export default {
  components: { SearchStudent, DataTable },
  data() {
      date: this.$moment().format(`YYYY-MM-DD`)
    return {
      headers: [
        {
          text: 'ID',
          value: 'student_internal_id',
          width: '10.23%',
          align: 'center',
          class: ['pa-0'],
          sortable: false
        },
        {
          text: '学生名',
          width: '12.9%',
          value: 'first_name',
          class: ['pa-0'],
          align: 'center',
          sortable: false
        },
        {
          text: 'フリガナ',
          width: '15.8%',
          value: 'family_name_furigana',
          class: ['pa-0'],
          align: 'center',
          sortable: false
        },
        {
          text: '大学名',
          value: 'education_facility.name',
          width: '29.26%',
          align: 'center',
          class: ['pa-0'],
          sortable: false
        },
        {
          text: '卒業予定',
          width: '15.3%',
          value: 'graduate_year',
          align: 'center',
          class: ['pa-0'],
          sortable: false
        },
        {
          text: '登録日',
          width: '10.1%',
          value: 'created_at',
          align: 'left',
          class: ['pa-0'],
          sortable: true
        }
      ],
      navigation: null,
      search: null,
      initialLoad: true,
      loading: false,
      items: []
    }
  },
  created() {
    this.initializeNavigation(), this.getDataFromApi()
  },

  computed: {
    ...mapGetters([
      'getAllStudent',
      'getStudentPagination',
      'getStudentCsvData',
      'getTotalStudentActive',
      'getTotalStudentInactive',
      'getMembershipCancelled'
    ]),
    totalRecords() {
      return this.getStudentPagination?.records_total || 0
    },
    totalPages() {
      return this.getStudentPagination?.total_pages || 0
    }
  },
  methods: {
    showActiveTables() {
      this.status = 1
      this.getDataFromApi()
    },
      formatDate(date) {
      if (!date) {
        return '----/--/--'
      }
      return this.$moment(date).format('YYYY/MM/DD')
    },
    showNotActiveTables() {
      this.status = 0
      this.getDataFromApi()
    },

    showNotMembershipCancelledTables() {
      this.status = 3
      this.getDataFromApi()
    },
    async downloadCsv() {
      await this.$store.dispatch('STUDENT_CSV')
      console.log(this.getStudentCsvData)
      let fileUrl = window.URL.createObjectURL(
        new Blob([this.getStudentCsvData], {
          type: 'text/plain;charset=UTF-8'
        })
      )
      let fileLink = document.createElement('a')

      fileLink.href = fileUrl
      fileLink.setAttribute(
        'download',
        `学生情報_${this.$moment().format('YYYYMMDD')}.csv`
      )
      document.body.appendChild(fileLink)
      fileLink.click()
      document.body.removeChild(fileLink)
    },

    initializeNavigation() {
      this.navigation = {
        title: '学生',
        subTitle: '学生一覧',
        tabs: [
          {
            title: 'アクティブ',
            count: this.getTotalStudentActive,
            action: this.showActiveTables
          },
          {
            title: 'インアクティブ',
            count: this.getTotalStudentInactive,
            action: this.showNotActiveTables
          },

          {
            title: '退会済',
            count: this.getMembershipCancelled,
            action: this.showNotMembershipCancelledTables
          }
        ],
        buttons: [
          {
            title: 'CSVエクスポート',
            action: this.downloadCsv,
            class: 'bg-white text-ff862f',
            others: {
              outlined: true
            }
          }
        ]
      }
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
      data.status = this.status
      data = Object.assign({}, obj, data)

      await this.$store
        .dispatch('STUDENT_GET_ALL', data)
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
<style lang="scss" scoped>
.student-list ::v-deep {
  tbody {
    tr {
      td {
        padding: 0px !important;
      }
    }
  }
}
</style>
