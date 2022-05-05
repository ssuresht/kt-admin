<template>
  <div class="">
    <PageTitle
      :items="{
        title: '応募管理',
        subtitle: '一覧',
        tabs: [
          {
            title: '応募済',
            count: 70,
            notification: '2',
            action: () => {
              selection = 1
              generateItems(1)
            },
          },
          {
            title: '合格済',
            count: 5,
            action: () => {
              selection = 2
              generateItems(2)
            },
          },
          {
            title: '完了',
            count: 5,
            action: () => {
              selection = 3
              generateItems(3)
            },
          },
          {
            title: '不合格',
            count: 3,
            action: () => {
              selection = 4
              generateItems(4)
            },
          },
          {
            title: '辞退済',
            count: 3,
            notification: '1',
            action: () => {
              selection = 5
              generateItems(5)
            },
          },
        ],
        buttons: [
          {
            title: 'CSVエクスポート',
            others: {
              outlined: true,
            },
            class: 'bg-white text-ff862f',
            action: () => this.downloadCsv(),
          },
          {
            title: '詳細条件検索',
            others: {
              outlined: true,
            },
            class: 'bg-white',
            action: () => {
              toggleSearch = true
            },
          },
        ],
      }"
    ></PageTitle>
    <v-fade-transition>
      <SearchArea
        class="mb-4"
        v-if="toggleSearch"
        v-bind="{ toggleSearch, selectTypeOptions, searchFields }"
        @toggleSearch="toggleSearch = false"
        @changedInputType="changedInputType($event)"
      ></SearchArea>
    </v-fade-transition>
    <DataTable
      :headers="getHeaders"
      :items="items"
      :total-records="totalRecords"
      :number-of-pages="totalPages"
      @update:options="updateTable"
      class="application-table"
    >
      <template v-slot:item.id="{ item }">
        <div class="position-relative">
          {{ item.id }}
          <div class="position-absolute" style="top: 0%; left: 0px">
            <v-icon size="6px" v-if="item.notification">$notification</v-icon>
          </div>
        </div>
      </template>
      <template v-slot:item.job_id="{ item }">
        <div class="font-12px fw-400">
          {{ item.company.internal_company_id }}
        </div>
        <div class="text-3f74c2 mouse-pointer">
          {{ item.internship_post.title }}
        </div>
      </template>
      <template v-slot:item.company_id="{ item }">
        <div class="font-12px fw-400">
          {{ item.company.internal_company_id }}
        </div>
        <div class="text-3f74c2 mouse-pointer">{{ item.company.name }}</div>
      </template>
      <template v-slot:item.student_id="{ item }">
        <div class="font-12px fw-400">{{ item.student.id }}</div>
        <div class="text-3f74c2 mouse-pointer">
          {{ item.student.family_name }} {{ item.student.first_name }}
        </div>
      </template>
      <template v-slot:item.university="{ item }">
        <div class="font-12px fw-400">{{ item.student.university_name }}</div>
        <div class="">{{ item.student.email_valid }}</div>
      </template>
      <template v-slot:item.created_at="{ item }">
        <div class="font-12px fw-400">{{ dateFormat(item.created_at) }}</div>
      </template>
      <template v-slot:item.update_date="{ item }">
        <div class="font-12px fw-400">{{ dateFormat(item.updated_at) }}</div>
      </template>
      <template v-slot:item.status="{ item }">
        <v-sheet
          color="transparent"
          width="128px"
          max-width="128px"
          class="d-flex align-center justify-space-between"
        >
          <v-menu bottom :close-on-click="true" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-chip
                class="font-12px white--text py-2 pill"
                small
                pill
                dense
                v-on="on"
                v-bind="attrs"
                :color="chipColor(item.status)"
                ><div class="pr-2">{{ item.status | status }}</div>
                <v-icon size="8px" color="white">$dropdown</v-icon>
              </v-chip>
            </template>
            <v-list>
              <v-list-item
                class="mouse-pointer font-12px fw-400"
                v-for="(option, index) in options"
                :key="index"
                @click="item.status = option"
              >
                <v-list-item-title>{{ option | status }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-icon
            size="21px"
            class="ml-7"
            v-if="item.status === 2 || item.status === 3"
            >$message</v-icon
          >
        </v-sheet>
      </template>
    </DataTable>
  </div>
</template>
<script>
import DataTable from '@/components/ui/DataTable.vue'
import SearchArea from '@/components/ui/SearchArea'
import { mapGetters } from 'vuex'
export default {
  components: { DataTable, SearchArea },
  filters: {
    status: function (value) {
      if (parseInt(value) === 1) {
        return '応募済'
      }
      if (parseInt(value) === 2) {
        return '合格済'
      }
      if (parseInt(value) === 3) {
        return '完了'
      }
      if (parseInt(value) === 4) {
        return '不合格'
      }
      if (parseInt(value) === 5) {
        return '辞退済'
      }
    },
  },
  data() {
    return {
      selection: 1,
      toggleSearch: false,
      options: [1, 2, 3, 4, 5],
      items: [],
      totalPages: 0,
      totalRecords: 0,
      selectTypeOptions: [
        {
          id: 'keyword_search',
          name: 'キーワード検索',
        },
        {
          id: 'created_at',
          name: '応募日',
        },
      ],
    }
  },
  computed: {
    ...mapGetters([
      'getAllApplication',
      'getApplicationPagination',
      'getApplicationCsvData',
    ]),
    getHeaders() {
      if (this.selection < 5) {
        return [
          {
            text: '',
            align: 'center',
            sortable: false,
            width: '1.9%',
          },
          {
            text: 'ID',
            value: 'id',
            align: 'center',
            class: ['px-0'],
            sortable: false,
            width: '3.9%',
          },
          {
            text: '企業ID',
            subText: '求人タイトル',
            value: 'job_id',
            align: 'left',
            class: ['py-3', 'px-0'],
            sortable: false,
            width: '19.3%',
          },
          {
            text: '企業ID',
            subText: '企業名',
            align: 'left',
            class: ['px-0'],
            value: 'company_id',
            sortable: false,
            width: '17.43%',
          },
          {
            text: '学生ID',
            subText: '学生名',
            class: ['px-0'],
            value: 'student_id',
            align: 'left',
            sortable: false,
            width: '8.194%',
          },
          {
            text: '大学名',
            subText: '学生メールアドレス',
            value: 'university',
            class: ['px-0'],
            align: 'left',
            sortable: false,
            width: '15%',
          },
          {
            text: '応募日',
            sortable: true,
            align: 'left',
            class: ['px-0'],
            value: 'created_at',
            width: '14.90%',
          },
          {
            text: '更新日',
            sortable: false,
            align: 'left',
            class: ['px-0'],
            value: 'update_date',
            width: '7.22%',
          },
          {
            text: '',
            value: 'status',
            class: ['px-0'],
            sortable: false,
            align: 'left',
            width: '10.33%',
          },
        ]
      }
      return [
        {
          text: '',
          align: 'center',
          sortable: false,
          width: '1.9%',
        },
        {
          text: 'ID',
          value: 'id',
          align: 'center',
          class: ['px-0'],
          sortable: false,
          width: '3.9%',
        },
        {
          text: '企業ID',
          subText: '求人タイトル',
          value: 'job_id',
          align: 'left',
          class: ['py-3', 'px-0'],
          sortable: false,
          width: '18.61%',
        },
        {
          text: '企業ID',
          subText: '企業名',
          align: 'left',
          class: ['px-0'],
          value: 'company_id',
          sortable: false,
          width: '12.29%',
        },
        {
          text: '学生ID',
          subText: '学生名',
          class: ['px-0'],
          value: 'student_id',
          align: 'left',
          sortable: false,
          width: '7.8%',
        },
        {
          text: '大学名',
          subText: '学生メールアドレス',
          value: 'university',
          class: ['px-0'],
          align: 'left',
          sortable: false,
          width: '14.7%',
        },
        {
          text: '応募日',
          sortable: true,
          align: 'left',
          class: ['px-0'],
          value: 'created_at',
          width: '8.88%',
        },
        {
          text: '辞退理由',
          sortable: false,
          align: 'left',
          class: ['px-0'],
          value: 'reason',
          width: '14.91%',
        },
        {
          text: '更新日',
          sortable: false,
          align: 'left',
          class: ['px-0'],
          value: 'update_date',
          width: '5.12%',
        },
        {
          text: '',
          value: 'status',
          sortable: false,
          align: 'left',
          width: '10.33%',
        },
      ]
    },
  },
  created() {
    this.changedInputType('keyword_search')
    this.generateItems(1)
  },
  methods: {
    updateTable(e) {
      this.items = []
      this.generateItems(e)
    },
    async downloadCsv() {
      await this.$store.dispatch('APPLICATION_EXPORT_CSV')
      let fileUrl = window.URL.createObjectURL(
        new Blob([this.getApplicationCsvData], {
          type: 'text/plain;charset=UTF-8',
        })
      )
      let fileLink = document.createElement('a')

      fileLink.href = fileUrl
      fileLink.setAttribute(
        'download',
        ` 応募 ${this.$moment().format('YYYYMMDD')}.csv`
      )
      document.body.appendChild(fileLink)
      fileLink.click()
      document.body.removeChild(fileLink)
    },

    changedInputType(event) {
      switch (event) {
        case 'keyword_search':
          this.searchFields = [
            {
              label: 'Search text',
              name: 'search',
              type: 'text',
              value: null,
              placeholder: '企業ID、企業名、学生ID、学生名、大学名',
              rules: 'required',
            },
          ]
          break
        case 'created_at':
          this.searchFields = [
            {
              label: 'Label',
              name: 'created_at_start',
              type: 'date',
              rules: 'required',
              show_after_approx: true,
              value: `${this.$moment().format('YYYY-MM-DD')}`,
              menu: false,
              locale: 'ja',
            },
            {
              label: 'Label',
              name: 'created_at_end',
              type: 'date',
              rules: 'required',
              show_after_approx: false,
              value: `${this.$moment().format('YYYY-MM-DD')}`,
              menu: false,
              locale: 'ja',
              range: true,
              range_input: 'created_at_start',
            },
          ]
      }
    },
    chipColor(status) {
      if (status === 1) {
        return '#EE6C9B'
      }
      if (status === 2) {
        return '#5E94E4'
      }
      if (status === 3) {
        return '#60D1CB'
      }
      if (status === 4) {
        return '#A7A7A7'
      }
      if (status === 5) {
        return '#C771B5'
      }
    },
    async generateItems(e) {
      this.loading = true

      let data = {}
      data.sort_by_order = e?.sortDesc[0] ? 'asc' : 'desc'
      data.sort_by = e?.sortBy[0] ? e.sortBy[0] : 'created_at'
      data.page = e?.page ? e.page : 1
      data.paginate = e?.itemsPerPage ? e.itemsPerPage : 25
      data.status = '1'
      let response = await this.$store.dispatch('APPLICATION_GET_ALL', data)
      console.log(response)

      this.totalPages = response.data.data.paginate.total_pages
      this.totalRecords = response.data.data.paginate.records_total
      console.log(this.totalRecords)
      response.data.data.data.forEach((item) => {
        this.items.push(item)
      })
      this.total = response.data.total
      this.loading = false
    },
  },
}
</script>
<style lang="scss" scoped>
.pill {
  width: 77px;
  height: 30px;
  border-radius: 30px;
}
.application-table ::v-deep {
  tbody {
    tr {
      td {
        padding-top: 20px !important;
        padding-bottom: 20px !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
      }
    }
  }
}
</style>
