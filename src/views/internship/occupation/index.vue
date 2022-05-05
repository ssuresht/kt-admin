<template>
  <div>
    <PageTitle
      :items="{
        title: '求人広告',
        subTitle: '職種管理',
        buttons: [
          {
            title: '詳細条件検索',
            action: () => {
              toggleSearch = true
            },
            class: ['bg-white'],
            others: {
              outlined: true
            }
          },
          {
            title: '新規作成',
            icon: 'mdi-plus-circle',
            action: () => {
              launchNew = true
            }
          }
        ]
      }"
    ></PageTitle>

    <v-fade-transition>
      <SearchBox
        class="mb-5"
        searchPlacholder="プルダウン表示項目"
        v-bind="{ toggleSearch }"
        @toggleSearch="toggleSearch = false"
        @search-table="searchTable"
        v-if="toggleSearch"
      ></SearchBox>
    </v-fade-transition>

    <DataTable
      class="school-table"
      :headers="headers"
      :items="getAllInternshipOccupations"
      :total-records="totalRecords ? totalRecords : 0"
      :number-of-pages="totalPages ? totalPages : 0"
      @click:row="
        launchEdit = true
        editItem = $event
      "
    >
      <template v-slot:item.delete="{ item }">
        <v-btn
          depressed
          color="transparent"
          @click.stop="deleteInitiate(item.id)"
        >
          <v-icon size="20">$delete</v-icon></v-btn
        >
      </template>
    </DataTable>
    <OccupationFeatureDialog
      :launch.sync="launchNew"
      :edit="false"
      @submit="submit"
      @refresh="getDataFromApi"
    ></OccupationFeatureDialog>

    <OccupationFeatureDialog
      :launch.sync="launchEdit"
      :item="editItem"
      @update="update"
    ></OccupationFeatureDialog>

    <SimpleModel
      text="この職種を削除してよろしいですか？"
      :dialog="dialog.delete"
      @submitSuccess="deleteInternOccupation()"
      :submitButtonText="'削除する'"
      @closeModel="dialog.delete = false"
    ></SimpleModel>
  </div>
</template>
<script>
import DataTable from '@/components/ui/DataTable'
import OccupationFeatureDialog from '@/components/models/OccupationFeatureDialog'
import SimpleModel from '@/components/models/SimpleModel'
import SearchBox from '@/components/ui/SearchBox'
import { mapGetters } from 'vuex'
export default {
  components: { DataTable, OccupationFeatureDialog, SimpleModel, SearchBox },
  data() {
    return {
      launchEdit: false,
      launchNew: false,
      editItem: null,
      toggleSearch: false,
      dialog: {
        delete: false
      },
      headers: [
        {
          text: 'プルダウン表示項目',
          width: '70%',
          align: 'left',
          value: 'name',
          sortable: false
        },
        {
          text: '位置',
          width: '20%',
          value: 'display_order',
          align: 'right',
          sortable: false
        },
        {
          text: '',
          value: 'delete',
          width: '10%',
          align: 'center',
          sortable: false
        }
      ]
    }
  },

  async mounted() {
    await this.getDataFromApi()
  },
  computed: {
    ...mapGetters([
      'getAllInternshipOccupations',
      'getInternshipOccupationsPagination'
    ]),
    totalRecords() {
      return this.getInternshipOccupationsPagination?.records_total || 0
    },
    totalPages() {
      return this.getInternshipOccupationsPagination?.total_pages || 0
    },
    getInternshipFeatures() {
      return this.getAllInternshipOccupations.map(InternshipFeature => {
        return {
          id: InternshipFeature.id,
          name: InternshipFeature.name
        }
      })
    }
  },
  methods: {
    searchTable(search) {
      this.getDataFromApi(undefined, { search })
    },

    async deleteInternOccupation() {
      await this.$store
        .dispatch('INTERNSHIP_OCCUPATIONS_DELETE', this.temporaryDeleteId)
        .then(res => {
          if (res.status === 200) {
            this.dialog.delete = false
            this.getDataFromApi()
            this.temporaryDeleteId = null
          }
        })
    },

    deleteInitiate(id) {
      this.dialog.delete = true
      this.temporaryDeleteId = id
    },

    async getDataFromApi(e = undefined, obj = {}) {
      let data = {}
      data.search = e?.search || obj.search
      data.sort_by = e?.sortBy[0] ? e.sortBy[0] : 'display_order'
      data.sort_by_order = e?.sortDesc[0] ? 'desc' : 'asc'
      data.page = e?.page ? e.page : 1
      data.paginate = e?.itemsPerPage ? e.itemsPerPage : 25
      await this.$store
        .dispatch('INTERNSHIP_OCCUPATIONS_GET_ALL', data)
        .then(res => {
          if (this.initialLoad) {
            this.initialLoad = false
          }
        })
    },

    updateTable(e) {
      if (!this.initialLoad) this.getDataFromApi(e)
    },
    deleteRecord() {},
    submit() {},
    update() {}
  }
}
</script>
