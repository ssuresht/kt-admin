<template>
  <div class="">
    <PageTitle
      :items="{
        title: '教育機関',
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
            action: () => {
              lauunchNew = true
            },
            icon: 'mdi-plus-circle'
          }
        ]
      }"
    ></PageTitle>
    <v-fade-transition>
      <SearchBox
        class="mb-5"
        searchPlacholder="学校名"
        v-bind="{ toggleSearch }"
        @toggleSearch="toggleSearch = false"
        @search-table="searchTable"
        v-if="toggleSearch"
      ></SearchBox>
    </v-fade-transition>

    <DataTable
      class="school-table"
      :headers="headers"
      :items="getFacilities"
      :total-records="totalRecords ? totalRecords : 0"
      :number-of-pages="totalPages ? totalPages : 0"
      @row-clicked="
        lauunchEdit = true
        editItem = $event
      "
      @update:options="updateTable"
    >
      <template v-slot:item.type="{ item }">
        {{ item.type ? item.type.name : '' }}
      </template>
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
    <SchoolDialog
      :launch.sync="lauunchNew"
      :edit="false"
      @refresh="getDataFromApi"
    ></SchoolDialog>
    <SchoolDialog :launch.sync="lauunchEdit" :item="editItem"></SchoolDialog>
    <SimpleModel
      text="この教育機関を削除してよろしいですか？"
      :dialog="dialog.delete"
      @submitSuccess="deleteInstituition()"
      @closeModel="dialog.delete = false"
      :submitButtonText="'削除する'"
    ></SimpleModel>
  </div>
</template>
<script>
import DataTable from '@/components/ui/DataTable'
import SearchBox from '@/components/ui/SearchBox'
import SchoolDialog from '@/components/models/SchoolDialog'
import SimpleModel from '@/components/models/SimpleModel'
import { mapGetters } from 'vuex'

export default {
  name: 'EducationalFaciilitiesList',
  components: {
    DataTable,
    SchoolDialog,
    SimpleModel,
    SearchBox
  },

  data: () => ({
    toggleSearch: false,
    editItem: null,
    initialLoad: true,
    temporaryDeleteId: null,
    dialog: {
      delete: false
    },
    lauunchEdit: false,
    lauunchNew: false,
    headers: [
      {
        text: 'ID',
        value: 'id',
        width: '10%',
        align: 'center',
        sortable: true
      },
      {
        text: '教育機関タイプ',
        value: 'type',
        width: '18%',
        align: 'start',
        sortable: false
      },
      {
        text: '学校名',
        value: 'name',
        align: 'start',
        width: '18%',
        sortable: false
      },
      {
        text: 'その他の学校名',
        value: 'others',
        align: 'start',
        width: '48%',
        sortable: false
      },
      {
        text: '',
        value: 'delete',
        sortable: false
      }
    ]
  }),

  async mounted() {
    await this.getDataFromApi()
  },
  computed: {
    ...mapGetters([
      'getAllFacilities',
      'getFacilitiesPagination',
      'getEducationFacilityType'
    ]),
    totalRecords() {
      return this.getFacilitiesPagination?.records_total || 0
    },
    totalPages() {
      return this.getFacilitiesPagination?.total_pages || 0
    },
    getFacilities() {
      return this.getAllFacilities.map(facility => {
        let temp = this.getEducationFacilityType.find(
          type => type.id === facility.type
        )
        return {
          id: facility.id,
          name: facility.name,
          type: temp ?? null
        }
      })
    }
  },
  methods: {
    searchTable(search) {
      this.getDataFromApi(undefined, { search })
    },

    async deleteInstituition() {
      await this.$store
        .dispatch('FACILITIES_DELETE', this.temporaryDeleteId)
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
      data.sort_by = e?.sortBy[0] ? e.sortBy[0] : 'id'
      data.sort_by_order = e?.sortDesc[0] ? 'asc' : 'desc'
      data.page = e?.page ? e.page : 1
      data.paginate = e?.itemsPerPage ? e.itemsPerPage : 25
      await this.$store.dispatch('FACILITIES_GET_ALL', data).then(res => {
        if (this.initialLoad) {
          this.initialLoad = false
        }
      })
    },

    updateTable(e) {
      if (!this.initialLoad) this.getDataFromApi(e)
    }
  }
}
</script>
