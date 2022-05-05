<template>
  <div class="px-4 font-Noto-Sans job-list-page">
    <v-sheet color="transparent">
      <v-row>
        <v-col cols="12">
          <div
            class="fw-500 heading-text d-flex justify-space-between flex-wrap align-center mt-5 mb-2"
          >
            <div class="d-flex align-center flex-wrap">
              <h2 class="font-24px mb-1 mr-7">
                <span class="fw-500">お知らせ管理</span>
                <span class="line"></span>
                <span class="font-20px fw-400">お知らせ一覧</span>
              </h2>
              <div
                v-for="tab in tabs"
                :key="tab.type"
                class="d-flex font-14px mr-7 align-center cursor-pointer"
                :class="tab.selected ? 'text-red' : ''"
                @click="filterTable(tab.type)"
              >
                <span class="d-inline-block"
                  >{{ tab.text
                  }}{{ tab.showCount ? '(' + tab.count + ')' : '' }}</span
                >
              </div>
            </div>
            <div class="d-flex font-14px align-center">
              <v-btn
                @click="
                  toggleSearch = !toggleSearch
                  setChangedInputType('search')
                "
                class="white text-red border-red mr-4"
                min-width="188px"
                >詳細条件検索</v-btn
              >
              <v-btn
                @click="$router.push({ name: 'NotificationsCreate' })"
                class="btn-pink white--text"
                min-width="188px"
              >
                <div class="d-flex align-center">
                  <v-icon size="20">mdi-plus-circle</v-icon>
                  <span class="ml-1">新規作成</span>
                </div>
              </v-btn>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="12" v-if="toggleSearch">
          <SearchArea
            @toggleSearch="setToggleSearch($event)"
            @searchSubmit="searchSubmit($event)"
            @changedInputType="setChangedInputType($event)"
            @resetForm="getDataFromApi()"
            :toggleSearch="toggleSearch"
            :searchFields="searchFields"
            :selectTypeOptions="selectTypeOptions"
          ></SearchArea>
        </v-col>
        <v-col cols="12" md="12" class="d-flex w-100">
          <DataTable
            :items="initialLoad ? [] : getAllNotifications.news"
            :headers="headers"
            :total-records="
              getNotificationsTotalRecord ? getNotificationsTotalRecord : 0
            "
            :number-of-pages="
              getNotificationsTotalPages ? getNotificationsTotalPages : 0
            "
            @update:options="updateTable"
            :loading="loading"
            @click:row="
              $router.push({
                name: 'NotificationsEdit',
                params: { id: $event.id }
              })
            "
          >
            <template v-slot:[`item.created_at`]="{ item }">
              {{
                item.created_at && item.created_at != ''
                  ? item.created_at
                  : '---- / - / -' | moment('YYYY/MM/DD')
              }}
            </template>
            <template v-slot:[`item.title`]="{ item }">
              <span style="max-width: 200px" class="text-truncate">
                {{ item.title }}
              </span>
            </template>
          </DataTable>
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<script>
import DataTable from '@/components/ui/DataTable'
import SearchArea from '@/components/ui/SearchArea'
import { mapGetters } from 'vuex'

export default {
  name: 'Index',
  components: { DataTable, SearchArea },

  data() {
    return {
      toggleSearch: false,
      searchFields: [],
      selectTypeOptions: [
        { id: 'search', name: 'キーワード検索' },
        { id: 'created_at', name: '登録日' }
      ],
      headers: [
        {
          text: 'No.',
          align: 'center',
          sortable: false,
          value: 'id'
        },
        {
          text: '記事タイトル',
          align: 'left',
          sortable: false,
          value: 'title'
        },
        {
          text: '登録日',
          align: 'left',
          sortable: true,
          value: 'created_at'
        }
      ],
      tabs: this.getFilterTabs(),
      selectedStatus: {
        name: null,
        value: null
      },
      initialLoad: true,
      loading: false
    }
  },
  created() {
    this.getDataFromApi()
  },
  computed: {
    ...mapGetters([
      'user',
      'getAllNotifications',
      'getNotificationsTotalRecord',
      'getNotificationsTotalPages'
    ])
  },
  methods: {
    async getDataFromApi(e = undefined, obj = {}) {
      this.loading = true

      let data = {}
      data.sort_by_order = e?.sortDesc[0] ? 'desc' : 'asc'
      data.sort_by = e?.sortBy[0] ? e.sortBy[0] : 'created_at'
      data.page = e?.page ? e.page : 1
      data.paginate = e?.itemsPerPage ? e.itemsPerPage : 25
      data.user_id = this.user.id

      if (this.selectedStatus?.name) {
        data[this.selectedStatus.name] = this.selectedStatus.value
      }

      data = Object.assign({}, obj, data)

      await this.$store
        .dispatch('NOTIFICATIONS_GET_ALL', data)
        .then(() => {
          if (this.initialLoad) {
            this.initialLoad = false
            this.tabs = this.getFilterTabs()
          }
        })
        .finally(() => (this.loading = false))
    },
    updateTable(e) {
      if (!this.initialLoad) this.getDataFromApi(e)
    },
    getFilterTabs() {
      return [
        {
          type: '2',
          selected: false,
          count: this.getAllNotifications?.open_count ?? 0,
          text: '公開中',
          showCount: true
        },
        {
          type: '1',
          selected: false,
          count: this.getAllNotifications?.private_count ?? 0,
          text: '非公開',
          showCount: true
        },
        {
          type: '0',
          selected: false,
          text: '下書き',
          showCount: false
        }
      ]
    },
    filterTable(type = '1') {
      this.tabs.forEach(tab => {
        tab.selected = false
      })
      this.tabs.find(item => item.type == type).selected = true

      this.selectedStatus.name = 'is_release'
      this.selectedStatus.value = type

      this.getDataFromApi()
    },
    setChangedInputType(inputSearchType) {
      if (inputSearchType == 'search') {
        this.searchFields = [
          {
            label: 'Label',
            name: 'search',
            type: 'text',
            value: '',
            placeholder: 'キーワードを入力してください'
          }
        ]
      } else if (inputSearchType == 'created_at') {
        this.searchFields = [
          {
            label: 'Label',
            name: 'created_at_from',
            type: 'date',
            rules: 'required',
            show_after_approx: true,
            value: `${this.$moment().format('YYYY-MM-DD')}`,
            menu: false,
            locale: 'ja'
          },
          {
            label: 'Label',
            name: 'created_at_to',
            type: 'date',
            rules: 'required',
            show_after_approx: false,
            value: `${this.$moment().format('YYYY-MM-DD')}`,
            menu: false,
            locale: 'ja',
            range: true,
            range_input: 'created_at_from'
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
        let e = undefined
        this.getDataFromApi(e, obj)
      }
    }
  }
}
</script>

<style lang="scss" src="./styles.scss" scope></style>
