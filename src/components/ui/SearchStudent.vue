<template>
  <v-row>
    <v-col col="12" md="12">
      <div class="search-section ">
        <div class="d-flex align-center justify-space-between full-width">
          <div class="">検索</div>
        </div>
        <div class="separator"></div>
        検索条件
        <div class="search-bar-and-button">
          <div class="d-flex align-center justify-center">
            <v-sheet color="transparent" width="463px">
              <v-text-field
                outlined
                dense
                v-model="search"
                :placeholder="searchPlacholder"
                :hide-details="true"
              ></v-text-field>
            </v-sheet>
          </div>
          <v-btn color="primary" @click="$emit('search-table', search)">
            検索
          </v-btn>
        </div>
      </div>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: {
    searchPlacholder: {
      type: String,
      default: '学生姓または名、フリガナ姓または名、大学名',
      requried: false
    }
  },
  data() {
    return {
      search: null,
      searchStudentModel: null
    }
  },
  mounted() {
    this.searchStudentModel = this.searchStudentModel[0]
  }
}
</script>
<style src="@/styles/forms.scss" lang="scss"></style>
<style lang="scss" scoped>
.search-section {
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 15px;
  color: #333;
  font-size: 14px;
  .separator {
    border: 1px solid #b8b8b8;
    margin-top: 12px;
    margin-bottom: 20px;
  }
  .search-bar-and-button {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    button {
      color: #fff;
    }
  }
}
</style>
