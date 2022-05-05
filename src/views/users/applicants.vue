<template>
  <div class="application-list-page">
    <v-sheet color="transparent">
      <v-row>
        <v-col cols="12">
          <div
            class="
              fw-500
              heading-text
              d-flex
              justify-space-between
              flex-wrap
              align-center
              mt-5
              mb-2
            "
          >
            <div class="d-flex align-center flex-wrap">
              <h2 class="font-24px mb-1 mr-7">
                <span class="fw-500">ユーザー管理</span>
                <span class="line"></span>
                <span class="font-20px fw-400">ユーザー一覧</span>
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
                  setChangedInputType('nationalities')
                "
                class="white text-red border-red"
                min-width="188px"
                >詳細条件検索</v-btn
              >
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="12" v-if="toggleSearch">
          <SearchArea
            @toggleSearch="setToggleSearch($event)"
            @searchSubmit="searchSubmit($event)"
            @changedInputType="setChangedInputType($event)"
            :toggleSearch="toggleSearch"
            :searchFields="searchFields"
            :selectTypeOptions="selectTypeOptions"
          ></SearchArea>
        </v-col>
        <v-col cols="12" md="12" class="d-flex w-100 pt-0">
          <DataTable
            :items="initialLoad ? [] : getAllUser.users"
            :headers="headers"
            :total-records="10"
            :number-of-pages="1"
            :loading="loading"
            :page="1"
            @update:options="updateTable"
            @click:row="
              $router.push({ name: 'UserDetails', params: { id: $event.id } })
            "
          >
            <template v-slot:[`item.created_at`]="{ item }">
              {{
                item.created_at && item.created_at != ''
                  ? item.created_at
                  : '---- / - / -' | moment('YYYY/MM/DD H:mm')
              }}
            </template>
            <template v-slot:[`item.last_login_date`]="{ item }">
              {{
                item.last_login_date && item.last_login_date
                  ? item.last_login_date
                  : '---- / - / -' | moment('YYYY/MM/DD H:mm')
              }}
            </template>
            <template v-slot:[`item.user_name`]="{ item }">
              <div class="d-flex align-center py-3">
                <v-img
                  :src="item.face_picture_path"
                  max-height="49"
                  height="49"
                  max-width="49"
                  width="49"
                  class="rounded-circle"
                  lazy
                ></v-img>
                <span class="ml-4">{{ item.user_name }}</span>
              </div>
            </template>
            <template v-slot:[`item.gender`]="{ item }">
              <span>{{ $t(item.gender.ja) }}</span>
            </template>
            <template v-slot:[`item.cancel_count`]="{ item }">
              {{ item.cancel_count ? item.cancel_count : '-' }}
            </template>
            <template v-slot:[`item.matched_count`]="{ item }">
              {{ item.matched_count ? item.matched_count : '-' }}
            </template>
            <template v-slot:[`item.applied_count`]="{ item }">
              {{ item.applied_count ? item.applied_count : '-' }}
            </template>

            <template v-slot:[`item.nationality`]="{ item }">
              <span>{{ item.nationality.ja }}</span>
            </template>
            <template v-slot:[`item.visa_type`]="{ item }">
              <span>{{ item.visa_type.ja }}</span>
            </template>

            <template v-slot:[`item.last_login_date`]="{ item }">
              <p class="mb-0">{{ formatDate(item.last_login_date) }}</p>
              <p class="mb-0">
                {{ formatTime(item.last_login_date) }}
              </p>
            </template>

            <template v-slot:[`item.created_at`]="{ item }">
              <p class="mb-0">{{ formatDate(item.created_at) }}</p>
              <p class="mb-0">
                {{ formatTime(item.created_at) }}
              </p>
            </template>

            <template v-slot:[`item.action`]="{ item }">
              <v-btn
                :color="
                  item.status == 'Rejected'
                    ? '#E87C64'
                    : item.status == 'Awaiting'
                    ? '#FFF7C0'
                    : '#AAEFA7'
                "
                height="22"
                min-width="72"
                elevation="0"
                :ripple="false"
                :class="[item.status == 'Rejected' ? 'white--text' : '']"
                class="
                  font-12px
                  px-3
                  py-1
                  fw-500
                  rounded-xl
                  no-background-hover
                "
              >
                {{
                  item.status == 'Awaiting' && item.is_profile_updated == '1'
                    ? $t('awaiting_status_two')
                    : $t(item.status)
                }}
              </v-btn>
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
  name: 'Applications',
  components: { DataTable, SearchArea },
  data() {
    return {
      searchFields: [],
      toggleSearch: false,
      selectTypeOptions: [
        { id: 'nationalities', name: '国籍' },
        { id: 'visa_types', name: 'ビザ' },
        { id: 'created_at', name: '登録日' },
        { id: 'last_login_date', name: '最終ログイン' }
      ],
      headers: [
        {
          text: 'ID',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        {
          text: 'ユーザー名',
          align: 'left',
          sortable: false,
          value: 'user_name',
          class: 'text-no-wrap'
        },
        {
          text: '性別',
          align: 'left',
          sortable: false,
          value: 'gender',
          class: 'text-no-wrap'
        },
        {
          text: '年齢',
          align: 'left',
          sortable: false,
          value: 'age',
          class: 'text-no-wrap'
        },
        {
          text: '国籍',
          align: 'left',
          sortable: false,
          value: 'nationality',
          class: 'text-no-wrap'
        },
        {
          text: 'ビザ',
          align: 'left',
          sortable: false,
          value: 'visa_type',
          class: 'text-no-wrap'
        },
        {
          text: '応募',
          align: 'center',
          sortable: true,
          value: 'applied_count',
          class: 'text-no-wrap'
        },
        {
          text: '勤務済',
          align: 'center',
          sortable: true,
          value: 'matched_count',
          class: 'text-no-wrap'
        },
        {
          text: 'キャンセル',
          align: 'center',
          sortable: true,
          value: 'cancel_count',
          class: 'text-no-wrap'
        },
        {
          text: '登録日',
          align: 'center',
          sortable: true,
          value: 'created_at'
        },
        {
          text: '最終ログイン',
          align: 'center',
          sortable: true,
          value: 'last_login_date'
        },
        {
          text: 'ステータス',
          align: 'left',
          sortable: false,
          helpIcon: false,
          value: 'action'
        }
      ],
      tabs: this.getFilterTabs(),
      selectedStatus: {
        name: 'status',
        value: 'Awaiting'
      },
      initialLoad: true,
      loading: false
    }
  },
  created() {
    this.getDataFromApi()
  },
  computed: {
    ...mapGetters(['getAllUser', 'getUserTotalRecord', 'getUserTotalPages'])
  },
  methods: {
    async getDataFromApi(e = undefined, obj = {}) {
      this.loading = true

      let data = {}
      data.sort_by_order = e?.sortDesc[0] ? 'desc' : 'asc'
      data.sort_by = e?.sortBy[0] ? e.sortBy[0] : 'created_at'
      data.page = e?.page ? e.page : 1
      data.paginate = e?.itemsPerPage ? e.itemsPerPage : 25

      if (this.selectedStatus?.name) {
        data[this.selectedStatus.name] = this.selectedStatus.value
      }

      data = Object.assign({}, obj, data)

      await this.$store
        .dispatch('USERS_GET_ALL', data)
        .then(() => {
          if (this.initialLoad) {
            this.initialLoad = false
            this.tabs = this.getFilterTabs()
          }
        })
        .finally(() => (this.loading = false))
    },
    updateTable() {},
    getFilterTabs() {
      return [
        {
          type: 'All',
          selected: false,
          count: 0,
          text: 'すべて',
          showCount: false
        },
        {
          type: 'Approved',
          selected: false,
          count: this.$store.getters.getAllUser.approved_count ?? 0,
          text: '承認',
          showCount: true
        },
        {
          type: 'Awaiting',
          selected: true,
          count: this.$store.getters.getAllUser.awaiting_count ?? 0,
          text: '未対応',
          showCount: true
        },
        {
          type: 'Rejected',
          selected: false,
          count: this.$store.getters.getAllUser.rejected_count ?? 0,
          text: '差戻し',
          showCount: true
        }
      ]
    },
    filterTable(type = 'All') {
      this.tabs.forEach(tab => {
        tab.selected = false
      })
      this.tabs.find(item => item.type == type).selected = true

      this.selectedStatus.name = 'status'
      this.selectedStatus.value = type

      this.getDataFromApi()
    },
    setChangedInputType(inputSearchType) {
      if (inputSearchType == 'nationalities') {
        this.searchFields = [
          {
            label: 'Label',
            name: 'nationality_id',
            type: 'select',
            value: '',
            placeholder: '',
            item_value: 'id',
            item_text: 'ja',
            items: this.$store.getters.getAllSettings.nationalities,
            rules: 'required'
          }
        ]
      } else if (inputSearchType == 'visa_types') {
        this.searchFields = [
          {
            label: 'Label',
            name: 'visa_type_id',
            type: 'select',
            value: '',
            placeholder: '',
            item_value: 'id',
            item_text: 'ja',
            items: this.$store.getters.getAllSettings.visaTypes,
            rules: 'required'
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
      } else if (inputSearchType == 'last_login_date') {
        this.searchFields = [
          {
            label: 'Label',
            name: 'last_login_date_from',
            type: 'date',
            rules: 'required',
            show_after_approx: true,
            value: `${this.$moment().format('YYYY-MM-DD')}`,
            menu: false,
            locale: 'ja'
          },
          {
            label: 'Label',
            name: 'last_login_date_to',
            type: 'date',
            rules: 'required',
            show_after_approx: false,
            value: `${this.$moment().format('YYYY-MM-DD')}`,
            menu: false,
            locale: 'ja',
            range: true,
            range_input: 'last_login_date_from'
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
    },

    formatDate(date) {
      if (!date) {
        return '---- / - / -'
      }
      return this.$moment(date).format('YYYY/M/DD')
    },

    formatTime(date) {
      if (!date) {
        return '--:--'
      }
      return this.$moment(date).format('HH:MM')
    }
  }
}
</script>
