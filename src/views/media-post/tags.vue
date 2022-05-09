<template>
  <div class="">
    <PageTitle
      :items="{
        title: 'コラム',
        subTitle: 'タグ管理',
        buttons: [
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
    <DataTable
      :items="getAllMediaTags"
      :headers="headers"
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
    <MediaTagDialog
      :launch.sync="launchNew"
      :edit="false"
      @refresh="getDataFromApi"
    ></MediaTagDialog>

    <MediaTagDialog
      :launch.sync="launchEdit"
      :item="editItem"
      @update="update"
    ></MediaTagDialog>

    <SimpleModel
      text="このタグを削除してよろしいですか？"
      :dialog="dialog.delete"
      @submitSuccess="deleteMediaTags()"
      :submitButtonText="'削除する'"
      @closeModel="dialog.delete = false"
    ></SimpleModel>
  </div>
</template>
<script>
import DataTable from '@/components/ui/DataTable'
import MediaTagDialog from '@/components/models/MediaTagDialog'
import SimpleModel from '@/components/models/SimpleModel'
import { mapGetters } from 'vuex'

export default {
  name: 'タグ管理',
  components: { DataTable, MediaTagDialog, SimpleModel },
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
          text: 'タグ',
          value: 'name',
          sortable: false,
          width: '90%'
        },
        {
          text: '',
          sortable: false,
          value: 'delete',
          width: '10%'
        }
      ],
      items: []
    }
  },

  async mounted() {
    await this.getDataFromApi()
  },
  computed: {
    ...mapGetters(['getAllMediaTags', 'getMediaTagsPagination']),
    totalRecords() {
      return this.getMediaTagsPagination?.records_total || 0
    },
    totalPages() {
      return this.getMediaTagsPagination?.total_pages || 0
    }
  },
  methods: {
    searchTable(search) {
      this.getDataFromApi(undefined, { search })
    },

    async deleteMediaTags() {
      await this.$store
        .dispatch('MEDIA_TAGS_DELETE', this.temporaryDeleteId)
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
      data.sort_by = e?.sortBy[0] ? e.sortBy[0] : 'created_at'
      data.sort_by_order = e?.sortDesc[0] ? 'desc' : 'asc'
      data.page = e?.page ? e.page : 1
      data.paginate = e?.itemsPerPage ? e.itemsPerPage : 25
      await this.$store.dispatch('MEDIA_TAGS_GET_ALL', data).then(res => {
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
