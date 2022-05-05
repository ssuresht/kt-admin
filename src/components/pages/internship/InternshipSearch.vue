<template>
  <div>
    <v-card min-height="159px" class="mb-5">
      <div class="ml-6 pt-5 mr-8">
        <div class="d-flex justify-space-between">
          <span class="mb-0 font-18px">検索</span>
          <v-btn class="ml-4" icon @click="hideSearchArea">
            <v-icon color="black">mdi-minus</v-icon>
          </v-btn>
        </div>
        <v-divider class="mt-3"></v-divider>
        <div class="d-flex justify-space-between mt-3 pb-2">
          <div>
            <span class="font-14px">検索条件</span>
            <div class="d-flex">
              <v-select
                single-line
                outlined
                dense
                :items="searchInformation.searchTypeList"
                item-text="name"
                item-value="value"
                height="35px"
                color="#13ABA3"
                class="font-16px mt-1"
                v-model="searchType"
              ></v-select>
              <div v-if="searchType == 1">
                <v-text-field
                  v-model="searchInformation.keyword"
                  single-line
                  class="mt-1 ml-6 keyword-field"
                  outlined
                  dense
                  label="キーワードを入力してください"
                ></v-text-field>
              </div>
              <div v-if="searchType == 2">
                <v-select
                  single-line
                  outlined
                  dense
                  :items="searchInformation.businessIndustryList"
                  item-text="name"
                  item-value="value"
                  color="#13ABA3"
                  class="font-16px mt-1 ml-6"
                  v-model="searchInformation.businessIndustry"
                ></v-select>
              </div>
              <div v-if="searchType == 3">
                <v-select
                  single-line
                  outlined
                  dense
                  :items="searchInformation.workCategoryList"
                  item-text="name"
                  item-value="value"
                  height="35px"
                  color="#13ABA3"
                  class="font-16px mt-1 ml-6"
                  v-model="searchInformation.workCategory"
                ></v-select>
              </div>
              <div class="mt-1 ml-6 d-flex" v-if="searchType == 4">
                <DatePicker
                  :field="searchInformation.postDateStart"
                  outlined
                  dense
                >
                </DatePicker>
                <span class="font-14px mx-1 pt-2">～</span>
                <DatePicker
                  outlined
                  dense
                  :field="searchInformation.postDateEnd"
                >
                </DatePicker>
              </div>
            </div>
          </div>

          <v-btn
            class="mt-7"
            color="primary"
            min-width="114px"
            min-height="35px"
          >
            <span class="font-14px">検索</span>
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import DatePicker from '@/components/ui/DatePicker'
export default {
  name: 'InternshipSearch',
  components: {
    DatePicker
  },
  data() {
    return {
      searchType: 1
    }
  },
  props: {
    searchInformation: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    hideSearchArea() {
      this.$emit('hideSearchArea')
    }
  }
}
</script>

<style lang="scss">
.v-input {
  .v-input__slot {
    min-height: 35px !important;
  }

  .v-select__selections,
  .v-select__selection {
    margin: 0 !important;
    padding: 0 !important;
    min-height: 35px !important;
    width: 187px !important;
    align-items: center !important;
    display: flex !important;
  }
  .v-input__append-inner {
    margin-top: 6px !important;
  }
  .v-text-field__details {
    margin-bottom: 0px !important;
    padding-left: 0px !important;
  }
}
.keyword-field {
  width: 463px !important;
}
</style>
