<template>
  <v-row>
    <v-col col="12" md="12">
      <div class="search-section ">
        <div
          v-if="toggleSearch !== null"
          class="d-flex align-center justify-space-between full-width"
          @click="ownToggleSearch = !ownToggleSearch"
        >
          <div class="">検索</div>
          <v-btn
            color="transparent"
            text
            @click="ownToggleSearch = !ownToggleSearch"
          >
            <span class="small-line"></span>
          </v-btn>
        </div>
        <div
          v-else
          class="d-flex align-center justify-space-between full-width"
        >
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
    toggleSearch: {
      default: null,
      required: false
    },
    searchPlacholder: {
      type: String,
      default: '企業ID、企業名、企業名カナ',
      requried: false
    }
  },
  computed: {
    ownToggleSearch: {
      get() {
        return this.toggleSearch
      },
      set(value) {
        return this.$emit('toggleSearch', value)
      }
    }
  },
  data() {
    return {
      search: null
    }
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
