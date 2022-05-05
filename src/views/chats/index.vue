<template>
  <div class="px-4 font-Noto-Sans job-list-page">
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
                <span class="fw-500">チャット</span>
                <span class="line"></span>
                <span class="font-20px fw-400">チャット一覧</span>
              </h2>
            </div>
            <div class="d-flex font-14px align-center">
              <v-btn
                @click="
                  toggleSearch = !toggleSearch
                  setChangedInputType('search')
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
            @resetForm="getDataFromApi()"
            :toggleSearch="toggleSearch"
            :searchFields="searchFields"
            :selectTypeOptions="selectTypeOptions"
          ></SearchArea>
        </v-col>
        <v-col cols="12" md="12" class="d-flex w-100">
          <DataTable
            :items="getAllChats"
            :headers="headers"
            :total-records="getChatTotalRecord ? getChatTotalRecord : 0"
            :number-of-pages="getChatTotalPages ? getChatTotalPages : 0"
            @update:options="updateTable"
            :loading="loading"
            class="table-job-list"
            @click:row="
              $router.push({
                name: 'ChatDetails',
                params: {
                  id: $event.id
                }
              })
            "
          >
            <template v-slot:[`item.job_title`]="{ item }">
              <template v-if="item.job_title">
                <span class="truncate-lines lines-1">
                  {{ item.job_title.ja }}
                </span>
              </template>
            </template>
            <template v-slot:[`item.latest_message`]="{ item }">
              <span class="truncate-lines lines-1">
                {{ item.latest_message }}
              </span>
            </template>
            <template v-slot:[`item.job_application_status`]="{ item }">
              <v-btn
                v-if="item.job_application_status"
                :color="getStatusColors(item)"
                width="72"
                height="22"
                elevation="0"
                :class="[
                  item.job_application_status.en == 'Completed' ||
                  item.job_application_status.en == 'Reject' ||
                  item.job_application_status.en == 'Canceled' ||
                  item.job_application_status.en == 'No show'
                    ? 'white--text'
                    : ''
                ]"
                class="font-12px fw-500 rounded-xl"
              >
                {{
                  item.job_application_status.en == 'Reject'
                    ? '不採用'
                    : item.job_application_status.ja
                }}
              </v-btn>
            </template>
            <template v-slot:[`item.is_favorite`]="{ item }">
              <span class="cursor-pointer" @click.stop="setFaviroteChat(item)">
                <template v-if="item.is_favorite == 1">
                  <v-icon size="20" style="--inner: #fff7c0; --outer: #b8b8b8">
                    $Star
                  </v-icon>
                </template>
                <template v-else>
                  <v-icon size="20" style="--inner: #fff; --outer: #b8b8b8">
                    $Star
                  </v-icon>
                </template>
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
        { id: 'created_at', name: '最終メッセージ' },
        { id: 'work_date', name: '勤務日' },
        { id: 'status', name: 'ステータス' }
      ],
      headers: [
        {
          text: '更新日時',
          align: 'left',
          sortable: true,
          value: 'created_at',
          class: 'text-no-wrap',
          width: '10%'
        },
        {
          text: '応募ユーザー',
          align: 'left',
          sortable: false,
          value: 'user_name',
          class: 'text-no-wrap',
          width: '10%'
        },
        {
          text: 'ステータス',
          align: 'left',
          sortable: false,
          value: 'job_application_status',
          class: 'text-no-wrap',
          width: '10%'
        },
        {
          text: '企業名',
          align: 'left',
          sortable: false,
          value: 'corporate_name',
          class: 'text-no-wrap',
          width: '10%'
        },
        {
          text: '仕事タイトル',
          align: 'left',
          sortable: false,
          value: 'job_title',
          class: 'text-no-wrap',
          width: '30%'
        },
        {
          text: 'チャット内容',
          align: 'left',
          sortable: false,
          value: 'latest_message',
          class: 'text-no-wrap',
          width: '20%'
        },
        {
          text: '',
          align: 'left',
          sortable: true,
          value: 'is_favorite',
          class: 'text-no-wrap',
          width: '10%'
        }
      ],
      initialLoad: true,
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'getAllChats',
      'getChatTotalPages',
      'getChatTotalRecord'
    ])
  },
  created() {
    this.getDataFromApi()
  },
  methods: {
    updateTable(e) {
      if (!this.initialLoad) this.getDataFromApi(e)
    },
    async getDataFromApi(e = undefined, obj = {}) {
      this.loading = true

      let data = {}
      data.sort_by_order = e?.sortDesc[0] ? 'asc' : 'desc'
      data.sort_by = e?.sortBy[0] ? e.sortBy[0] : 'created_at'
      data.page = e?.page ? e.page : 1
      data.paginate = e?.itemsPerPage ? e.itemsPerPage : 25

      data = Object.assign({}, obj, data)

      await this.$store
        .dispatch('CHATS_GET_ALL', data)
        .then(() => {
          if (this.initialLoad) this.initialLoad = false
        })
        .finally(() => (this.loading = false))
    },
    setFaviroteChat(chat) {
      let isFavorited = !chat.is_favorite
      let payload = {
        chat_id: chat.id,
        user_id: this.user.id,
        is_favorite: isFavorited ? 1 : 0
      }
      this.$store.dispatch('CHATS_SAVE_FAVORITE', payload).then(() => {
        chat.is_favorite = isFavorited
      })
    },
    setChangedInputType(inputSearchType) {
      if (inputSearchType == 'search') {
        this.searchFields = [
          {
            label: 'Search text',
            name: 'search',
            type: 'text',
            value: '',
            placeholder: 'キーワードを入力してください',
            rules: 'required'
          }
        ]
      } else if (inputSearchType == 'created_at') {
        this.searchFields = [
          {
            label: 'Label',
            name: 'created_at_start',
            type: 'date',
            rules: 'required',
            show_after_approx: true,
            value: `${this.$moment().format('YYYY-MM-DD')}`,
            menu: false,
            locale: 'ja'
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
            range_input: 'created_at_start'
          }
        ]
      } else if (inputSearchType == 'work_date') {
        this.searchFields = [
          {
            label: 'Label',
            name: 'work_date_start',
            type: 'date',
            rules: 'required',
            show_after_approx: true,
            value: `${this.$moment().format('YYYY-MM-DD')}`,
            menu: false,
            locale: 'ja'
          },
          {
            label: 'Label',
            name: 'work_date_end',
            type: 'date',
            rules: 'required',
            show_after_approx: false,
            value: `${this.$moment().format('YYYY-MM-DD')}`,
            menu: false,
            locale: 'ja',
            range: true,
            range_input: 'work_date_start'
          }
        ]
      } else if (inputSearchType == 'status') {
        this.searchFields = [
          {
            label: 'Job Applicant Statuses',
            name: 'status',
            type: 'select',
            rules: 'required',
            item_value: 'id',
            item_text: 'ja',
            items: this.getAllSettings.job_applicant_status
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
      console.log($event)
      let obj = {}
      obj.page = 1
      obj.paginate = 25

      if ($event.fields.length > 0) {
        $event.fields.forEach(field => {
          obj[field.name] = field.value
        })
        let e = undefined
        this.getDataFromApi(e, obj)
      }
    },
    getStatusColors(item) {
      return item.job_application_status.en == 'Applied'
        ? '#FFF7C0' // Yellow
        : item.job_application_status.en == 'Scheduled'
        ? '#AAEFA7' // Green
        : item.job_application_status.en == 'Completed'
        ? '#317C5A' // Dark Green
        : item.job_application_status.en == 'Canceled'
        ? '#6EC4DB' // Blue
        : item.job_application_status.en == 'No show'
        ? '#E87C64' // Red
        : item.job_application_status.en == 'Reject'
        ? '#7D7D7D'
        : '' // Grey
    }
  }
}
</script>

<style lang="scss" src="./styles.scss" scope></style>
