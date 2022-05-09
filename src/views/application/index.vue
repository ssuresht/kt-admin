<template>
  <div class="">
    <PageTitle
      :items="{
        title: '応募管理',
        subtitle: '一覧',
        tabs: [
          {
            title: '応募済',
            count:
              getApplicationCounts && getApplicationCounts[0]
                ? getApplicationCounts[0].total_applied
                : 0,
            notification:
              getApplicationCounts && getApplicationCounts[0]
                ? getApplicationCounts[0].admin_read
                : 0,
            action: () => {
              selection = 1
              generateItems(1)
            },
          },
          {
            title: '合格済',
            count:
              getApplicationCounts && getApplicationCounts[1]
                ? getApplicationCounts[1].total_passed
                : 0,
            notification:
              getApplicationCounts && getApplicationCounts[1]
                ? getApplicationCounts[1].admin_read
                : 0,
            action: () => {
              selection = 2
              generateItems(2)
            },
          },
          {
            title: '完了',
            count:
              getApplicationCounts && getApplicationCounts[2]
                ? getApplicationCounts[2].total_completed
                : 0,
            notification:
              getApplicationCounts && getApplicationCounts[2]
                ? getApplicationCounts[2].admin_read
                : 0,
            action: () => {
              selection = 3
              generateItems(3)
            },
          },
          {
            title: '不合格',
            count:
              getApplicationCounts && getApplicationCounts[3]
                ? getApplicationCounts[3].total_failed
                : 0,
            notification:
              getApplicationCounts && getApplicationCounts[3]
                ? getApplicationCounts[3].admin_read
                : 0,
            action: () => {
              selection = 4
              generateItems(4)
            },
          },
          {
            title: '辞退済',
            count:
              getApplicationCounts && getApplicationCounts[4]
                ? getApplicationCounts[4].total_declined
                : 0,
            notification:
              getApplicationCounts && getApplicationCounts[4]
                ? getApplicationCounts[4].admin_read
                : 0,
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
        @searchSubmit="searchSubmit($event)"
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
            <v-icon size="6px" v-if="!item.is_admin_read">$notification</v-icon>
          </div>
        </div>
      </template>

      <template v-slot:item.job_id="{ item }">
        <div class="font-12px fw-400">
          {{ item.internship_post.id }}
        </div>
        <div class="mouse-pointer">
          <router-link
            target="_blank"
            class="text-3f74c2 text-decoration-none truncate-lines lines-1"
            :to="{
              name: 'InternshipPostEdit',
              params: { id: item.internship_post.id },
            }"
          >
            <v-tooltip top color="white">
              <template v-slot:activator="{ on }">
                <span v-on="on">{{ item.internship_post.title }}</span>
              </template>
              <span class="text-333"> {{ item.internship_post.title }}</span>
            </v-tooltip>
          </router-link>
        </div>
      </template>

      <template v-slot:item.company_id="{ item }">
        <div class="font-12px fw-400">
          {{ item.company.internal_company_id }}
        </div>
        <div class="mouse-pointer">
          <router-link
            target="_blank"
            class="text-3f74c2 text-decoration-none truncate-lines lines-1"
            :to="{
              name: 'CorporateEdit',
              params: { id: item.company.id },
            }"
          >
            <v-tooltip top color="white">
              <template v-slot:activator="{ on }">
                <span v-on="on">{{ item.company.name }}</span>
              </template>
              <span class="text-333"> {{ item.company.name }}</span>
            </v-tooltip>
          </router-link>
        </div>
      </template>
      <template v-slot:item.student_id="{ item }">
        <div class="font-12px fw-400">
          {{ item.student.student_internal_id }}
        </div>
        <div class="mouse-pointer">
          <router-link
            target="_blank"
            class="text-3f74c2 text-decoration-none truncate-lines lines-1"
            :to="{
              name: 'StudentProfile',
              params: { id: item.student.id },
            }"
          >
            <v-tooltip top color="white">
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  {{ item.student.family_name }}
                  {{ item.student.first_name }}</span
                >
              </template>
              <span class="text-333">
                {{ item.student.family_name }}
                {{ item.student.first_name }}</span
              >
            </v-tooltip>
          </router-link>
        </div>
      </template>
      <template v-slot:item.university="{ item }">
        <div class="font-12px fw-400">
          {{ item.student.education_facility.name }}
        </div>
        <div class="truncate-lines lines-1">
          {{ item.student.obfuscate_email }}
        </div>
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
                @click="statusChange(item, option)"
              >
                <v-list-item-title>{{ option | status }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-icon
            size="21px"
            class="ml-7"
            @click="
              $router.push({
                name: 'FeedbackCreate',
              })
            "
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
      searchFields: [],
      activeStatus: 1,
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
      configuration: {
        page: 1,
        sort_by: 'id',
        sort_by_order: 'desc',
        paginate: 25,
      },
    }
  },
  computed: {
    ...mapGetters([
      'getAllApplication',
      'getApplicationPagination',
      'getApplicationCsvData',
      'getApplicationCounts',
    ]),
    getHeaders() {
      if (this.selection < 5) {
        return [
          {
            text: 'ID',
            value: 'id',
            align: 'center',
            class: ['px-0'],
            sortable: false,
            width: '3.9%',
          },
          {
            text: '求人ID',
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
            width: '15.43%',
          },
          {
            text: '学生ID',
            subText: '学生名',
            class: ['px-0'],
            value: 'student_id',
            align: 'left',
            sortable: false,
            width: '12.194%',
          },
          {
            text: '大学名',
            subText: '学生メールアドレス',
            value: 'university',
            class: ['px-0'],
            align: 'left',
            sortable: false,
            width: '18%',
          },
          {
            text: '応募日',
            sortable: true,
            align: 'left',
            class: ['px-0'],
            value: 'created_at',
            width: '10.90%',
          },
          {
            text: '更新日',
            sortable: false,
            align: 'left',
            class: ['px-0'],
            value: 'update_date',
            width: '9.22%',
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
  },
  methods: {
    async statusChange(item, option) {
      let params = {
        id: item.id,
        company_id: item.company_id,
        student_id: item.student_id,
        internship_post_id: item.internship_post_id,
        is_admin_read: item.is_admin_read,
        cancel_status: item.cancel_status,
        status: option,
      }
      await this.$store.dispatch('APPLICATION_UPDATE', params)
      this.generateItems()
    },
    updateTable(e) {
      this.configuration.sort_by = e.sortBy.length ? e.sortBy[0] : 'id'
      this.configuration.sort_by_order = e.sortDesc[0] ? 'desc' : 'asc'
      this.generateItems()
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
        ` 応募情報_${this.$moment().format('YYYYMMDD')}.csv`
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
            },
          ]
          break
        case 'created_at':
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
              date_format: 'YYYY-MM-DD 00:00',
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
              date_format: 'YYYY-MM-DD 00:00',
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
    async generateItems(status = null, obj = {}) {
      this.loading = true
      this.items = []
      this.configuration.status = status ? status : this.activeStatus
      this.activeStatus = status
      if (obj.search == '') {
        delete this.configuration.search
      } else {
        this.configuration.search = obj.search
      }
      if (obj.date_from != '' && obj.date_to != '') {
        this.configuration.date_from = obj.date_from
        this.configuration.date_to = obj.date_to
      } else {
        delete this.configuration.date_from
        delete this.configuration.date_to
      }

      let response = await this.$store.dispatch(
        'APPLICATION_GET_ALL',
        this.configuration
      )

      this.totalPages = response.data.data.paginate.total_pages
      this.totalRecords = response.data.data.paginate.records_total
      response.data.data.data.forEach((item) => {
        this.items.push(item)
      })
      this.total = response.data.total
      this.loading = false
    },
    searchSubmit($event) {
      let obj = {}
      if ($event.fields.length > 0) {
        $event.fields.forEach((field) => {
          obj[field.name] = field.value
        })
        this.generateItems(this.activeStatus, obj)
      }
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
  thead {
    th {
      padding-left: 16px !important;
      padding-right: 16px !important;
    }
  }
  tbody {
    tr {
      td {
        padding-top: 15px !important;
        padding-bottom: 15px !important;
        &:nth-child(2) {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
      }
    }
  }
}
</style>
