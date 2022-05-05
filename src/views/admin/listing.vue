<template>
  <div class="font-Noto-Sans job-list-page">
    <PageTitle
      :items="{
        title: '管理者',
        subTitle: '管理者一覧',
        buttons: [
          {
            title: '新規作成',
            icon: 'mdi-plus-circle',
            action: () => {
              $router.push({
                name: 'AdminsCreate'
              })
            }
          }
        ]
      }"
    ></PageTitle>
    <v-sheet color="transparent">
      <v-row>
        <v-col cols="12" md="12" class="d-flex w-100">
          <DataTable
            :items="getAllAdmins"
            :headers="headers"
            @click:row="
              $router.push({ name: 'AdminsEdit', params: { id: $event.id } })
            "
          >
            <template v-slot:[`item.action`]="{ item }">
              <v-btn
                height="23px"
                width="113px"
                class="rounded-xl font-12px white--text"
                depressed
                :color="item.status == 1 ? '#4BCFA0' : '#BCBCBC'"
              >
                {{ item.status == 1 ? 'アクティブ' : 'インアクティブ' }}
              </v-btn>
            </template>

            <template v-slot:[`item.created_at`]="{ item }">
              <div class="py-4 pl-5">{{ formatDate(item.created_at) }}</div>
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
          text: '管理者名',
          align: 'start',
          sortable: false,
          value: 'name',
          width: '6.75%'
        },
        {
          text: 'メールアドレス',
          align: 'left',
          sortable: false,
          value: 'email',
          width: '60%'
        },
        {
          text: '登録日',
          align: 'center',
          sortable: false,
          value: 'created_at',
          width: '5.76%'
        },
        {
          text: '',
          align: 'center',
          sortable: false,
          value: 'action',
          width: '16.7%'
        }
      ],
      initialLoad: true,
      loading: false
    }
  },
  async created() {
    await this.getDataFromApi()
  },
  computed: {
    ...mapGetters(['getAllAdmins'])
  },
  methods: {
    async getDataFromApi() {
      await this.$store.dispatch('ADMINS_GET_ALL')
    },

    formatDate(date) {
      if (!date) {
        return '----/--/--'
      }
      return this.$moment(date).format('YYYY/MM/DD')
    }
  }
}
</script>

<style lang="scss" src="./styles.scss" scope></style>
