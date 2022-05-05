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
                <span class="fw-500">FAQ管理</span>
                <span class="line"></span>
                <span class="font-20px fw-400">FAQ一覧</span>
              </h2>

              <div
                v-for="(tab, index) in tabs"
                :key="index"
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
                @click.prevent="$router.push({ name: 'FAQCreate' })"
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
        <v-col cols="12" md="12" class="d-flex w-100">
          <DataTable
            :items="initialLoad ? [] : getAllFaqs.faqs"
            :headers="headers"
            :total-records="getFaqsTotalRecord ? getFaqsTotalRecord : 0"
            :number-of-pages="getFaqsTotalPages ? getFaqsTotalPages : 0"
            @update:options="updateTable"
            :loading="loading"
            @click:row="
              $router.push({ name: 'FAQEdit', params: { id: $event.id } })
            "
          >
            <template v-slot:[`item.question`]="{ item }">
              <div class="d-flex align-center py-3">
                <v-badge
                  dot
                  inline
                  :color="item.is_release == '1' ? '#AAEFA7' : '#B8B8B8'"
                ></v-badge>
                <span class="ml-2 truncate-lines lines-1">
                  {{ item.question }}
                </span>
              </div>
            </template>
            <template v-slot:[`item.answer`]="{ item }">
              <span class="truncate-lines lines-1">{{ item.answer }}</span>
            </template>
            <template v-slot:[`item.created_at`]="{ item }">
              {{
                item.created_at && item.created_at != ''
                  ? item.created_at
                  : '---- / - / -' | moment('YYYY/MM/DD')
              }}
            </template>
          </DataTable>
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<script>
import DataTable from '@/components/ui/DataTable'
import { mapGetters } from 'vuex'

export default {
  name: 'Index',
  components: { DataTable },
  data() {
    return {
      headers: [
        {
          text: 'No.',
          align: 'left',
          sortable: true,
          value: 'id',
          class: 'text-no-wrap',
          width: '2%'
        },
        {
          text: '質問',
          align: 'left',
          sortable: false,
          value: 'question',
          class: 'text-no-wrap'
        },
        {
          text: '回答',
          align: 'left',
          sortable: false,
          value: 'answer',
          class: 'text-no-wrap'
        },
        {
          text: '質問カテゴリ',
          align: 'left',
          sortable: false,
          value: 'faq_category_name',
          class: 'text-no-wrap'
        },
        {
          text: '更新日',
          align: 'left',
          sortable: true,
          value: 'created_at',
          class: 'text-no-wrap'
        }
      ],
      tabs: this.getFilterTabs(),
      selectedStatus: {
        name: 'status',
        value: 'All'
      },
      initialLoad: true,
      loading: false
    }
  },
  created() {
    this.getDataFromApi()
  },
  computed: {
    ...mapGetters(['getAllFaqs', 'getFaqsTotalRecord', 'getFaqsTotalPages'])
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
        .dispatch('FAQS_GET_ALL', data)
        .then(() => {
          if (this.initialLoad) {
            this.initialLoad = false
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
          count: 0,
          text: 'ユーザー',
          showCount: false
        },
        {
          type: '1',
          selected: false,
          count: 0,
          text: '企業',
          showCount: false
        }
      ]
    },
    filterTable(type = 'All') {
      this.tabs.forEach(tab => {
        tab.selected = false
      })
      this.tabs.find(item => item.type == type).selected = true

      this.selectedStatus.name = 'user_type'
      this.selectedStatus.value = type

      this.getDataFromApi()
    }
  }
}
</script>

<style lang="scss" src="./styles.scss" scope></style>
