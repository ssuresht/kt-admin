<template>
  <div
    class="white full-width border-radius elevation"
    :class="[items.length > 0 ? '' : 'h-585']"
  >
    <DataTable
      :headers="headers"
      :items="items"
      :page="1"
      flat
      :disablePagination="true"
      class="application-table"
      :footer="false"
    >
      <template v-slot:item.id="{ item }">
        <div class="font-14px fw-400">{{ item.id }}</div>
      </template>

      <template v-slot:item.created_at="{ item }">
        <div class="font-14px fw-400">{{ dateFormat(item.created_at, 'YYYY/MM/DD hh:mm') }}</div>
      </template>

      <template v-slot:item.title="{ item }">
        <div class="d-flex algn-center justify-center">
          <v-sheet
            :elevation="0"
            width="260"
            height="20"
            color="transparent"
            class="text-dark-blue font-14px fw-400 text-truncate mouse-pointer"
            >{{ item.internship_post.title }}</v-sheet
          >
        </div>
      </template>

      <template v-slot:item.company_name="{ item }">
        <div class="text-dark-blue font-14px fw-400 mouse-pointer">
          {{ item.company.name }}
        </div>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip
          small
          pill
          v-if="item.status === 1"
          color="#EE6C9B"
          class="font-12px white--text"
          ><div class="px-4">応募済</div></v-chip
        >
        <v-chip
          small
          pill
          v-if="item.status === 2"
          color="#5E94E4"
          class="font-12px white--text"
          ><div class="px-4">合格済</div></v-chip
        >
        <v-chip
          small
          pill
          v-if="item.status === 3"
          color="#A7A7A7"
          class="font-12px white--text"
          ><div class="px-4">合格済</div></v-chip
        >
      </template>

    </DataTable>
  </div>
</template>
<script>
import DataTable from '@/components/ui/DataTable'
export default {
  components: {
    DataTable
  },
  data() {
    return {
      headers: [
        {
          text: 'No.',
          align: 'center',
          sortable: false,
          value: 'id'
        },
        {
          text: '応募日時',
          align: 'center',
          value: 'created_at',
        },
        {
          text: '求人広告タイトル',
          align: 'center',
          value: 'title'
        },
        {
          text: '企業名',
          value: 'company_name',
          align: 'center',
        },
        {
          text: 'ステータス',
          align: 'center',
          value: 'status'
        }
      ],
      items: []
    }
  },
  created () {
    this.getApplication()
  },
  methods: {
    async getApplication() {

      this.loading = true

      let data = {}
      data.sort_by = 'created_at'
      let response = await this.$store.dispatch('APPLICATION_GET_ALL', data)      
      response.data.data.data.forEach(item => {
        this.items.push(item)
      })
      this.total = response.data.total
      this.loading = false
    }
  },
}
</script>
<style src="./index.scss" lang="scss"></style>
