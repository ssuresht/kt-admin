<template>
  <div class="student-profile">
    <!-- page NavBar  -->
    <PageTitle :items="navigation"></PageTitle>
    <!-- main section starts here -->
    <div class="d-flex align-start justify-start full-width">
      <div
        class="d-flex flex-column align-center justify-center sidebar white border-radius elevation"
      >
        <!-- basic information -->
        <v-sheet
          width="229px"
          :elevation="0"
          class="fw-400 mx-4 mb-82 text-333"
        >
          <div class="font-14px">
            <span class="mr-2">ID</span>
            <span>{{ basicInfo.id }}</span>
          </div>
          <div class="font-20px mt-2 mb-1">{{ basicInfo.name }}</div>
          <div class="font-18px">{{ basicInfo.name_furigana }}</div>
          <div class="font-14px text-8e8e mt-5">
            登録日：{{ basicInfo.created_at }}
          </div>
        </v-sheet>
        <!-- profile menu -->
        <v-btn
          width="229px"
          height="43px"
          depressed
          class="mx-4 mb-4 text-left"
          v-for="(item, index) in options"
          :color="item === menuModel ? '#D5FAF8' : 'transparent'"
          @click="updateMenu(index)"
          :key="index"
        >
          <div class="full-width">{{ item }}</div>
        </v-btn>
      </div>
      <!-- form -->
      <StudentForm
        v-if="menuModel === options[0]"
        class="ml-4"
        @info="getInfo"
      ></StudentForm>
      <ApplicationTable v-if="menuModel === options[1]" class="ml-4">
      </ApplicationTable>
      <Report v-if="menuModel === options[2]" class="ml-4"></Report>
    </div>
  </div>
</template>
<script>
import StudentForm from './StudentForm.vue'
import moment from 'moment'
import ApplicationTable from './ApplicationTable.vue'
import Report from './report.vue'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      dialog: {
        submit: false
      },
      navigation: null,
      options: ['基本情報', '応募インターン', 'フィードバック'],
      menuModel: '基本情報',
      basicInfo: {
        id: '',
        name: '',
        name_furigana: '',
        created_at: ''
      }
    }
  },
  created() {
    this.navigation = {
      title: '学生',
      subTitle: '学生詳細',
      back: {
        action: () => {
          this.$router.push(-1)
        }
      }
    }
  },
  components: {
    StudentForm,
    ApplicationTable,
    Report
  },
  methods: {
    updateMenu(index) {
      this.menuModel = this.options[index]
    },

    getInfo(value) {
      this.basicInfo.id = value.student_internal_id
      this.basicInfo.name = value.family_name + ' ' + value.first_name
      this.basicInfo.name_furigana =
        value.family_name_furigana + ' ' + value.first_name_furigana
      this.basicInfo.created_at = moment(String(value.created_at)).format(
        'YYYY/MM/DD'
      )
    }
  }
}
</script>
<style src="./index.scss" lang="scss"></style>
