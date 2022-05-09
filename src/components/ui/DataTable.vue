<template>
  <div class="w-100">
    <v-data-table
      :headers="getHeaders"
      :header-props="headerProps"
      :items="items"
      :search="search"
      hide-default-header
      :hide-default-footer="!footer"
      v-bind="$attrs"
      v-on="$listeners"
      :footer-props="{
        'items-per-page-options': [25, 50],
        'items-per-page-text': $t('table_rows_per_page')
      }"
      :items-per-page="itemsPerPage"
      :pageCount="numberOfPages"
      :server-items-length="items.length"
      @click:row="handleClick"
      :disable-pagination="disablePagination"
      :no-data-text="$t('table_no_data_text')"
      :loading-text="$t('loading_table_items')"
      :page.sync="currentPage"
      class="datatable"
    >
      <template v-slot:header="{ props, on }">
        <thead>
          <tr class="bg-default">
            <th
              v-for="header in props.headers"
              :aria-label="header.text"
              role="columnheader"
              class="white--text fw-500 font-14px"
              :class="[
                getSortableClass(header.sortable),
                getAlignClass(header.align),
                header.class ? header.class : '',
                !props.options.sortDesc[0] &&
                props.options.sortBy[0] === header.value
                  ? 'desc'
                  : 'asc'
              ]"
              :key="header.value"
              @click="
                items.length > 1 && header.sortable ? on.sort(header.value) : ''
              "
              :width="header.width ? header.width : ''"
            >
              <span v-if="header.helpIcon">
                {{ header.text }}
                <v-tooltip color="white" top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on" color="#fff" size="20">
                      mdi-help-circle
                    </v-icon>
                  </template>
                  <span class="text-333" v-html="header.helpText"></span>
                </v-tooltip>
              </span>
              <span v-else-if="header.heartIcon">
                <v-icon color="#ffffff">$HeartIcon</v-icon>
              </span>
              <span v-else-if="header.paperPlaneIcon"
                ><v-icon class="paper-plane-icon" color="#ffffff"
                  >$PaperPlaneIcon</v-icon
                >
              </span>
              <span v-else-if="header.subText">
                {{ header.text }}
                <br />
                {{ header.subText }}
              </span>
              <span v-else>
                {{ header.text }}
              </span>
              <v-icon
                size="15"
                class="swap-sorting-icon ml-1"
                color="#fff"
                v-if="
                  header.sortable && !header.heartIcon && !header.paperPlaneIcon
                "
                >$SwapVertical</v-icon
              >
            </th>
          </tr>
        </thead>
      </template>

      <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </v-data-table>
    <div class="text-center mt-5 pagination-main-outer" v-if="totalRecords > 0">
      <paginate
        :page-count="numberOfPages"
        :click-handler="pageUpdateFunction"
        prev-text="<"
        :next-text="'>'"
        :container-class="'pagination'"
      >
        <span slot="prevContent"><v-icon size="10px">$LeftArrow</v-icon></span>
        <span slot="nextContent"><v-icon size="10px">$RightArrow</v-icon></span>
      </paginate>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    footer: {
      type: Boolean,
      default: false,
      required: false
    },
    headers: {
      type: Array,
      default: () => [],
      required: true
    },
    headerProps: {
      type: Object,
      default: () => {},
      required: false
    },
    items: {
      type: Array,
      default: () => [],
      required: true
    },
    search: {
      type: String,
      default: '',
      required: false
    },
    numberOfPages: {
      type: Number,
      default: 0,
      required: false
    },
    totalRecords: {
      type: Number,
      default: 0,
      required: false
    },
    itemsPerPage: {
      type: Number,
      default: 2,
      required: false
    },
    page: {
      type: Number,
      default: 1,
      required: false
    },
    disablePagination: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      currentPage: 1
    }
  },
  computed: {
    getHeaders() {
      return [
        {
          text: '',
          sortable: false,
          width: '28px'
        },
        ...this.headers,
        {
          text: '',
          sortable: false,
          width: '28px'
        }
      ]
    }
  },
  methods: {
    pageUpdateFunction(newPageNumber) {
      this.currentPage = newPageNumber
    },
    handleClick(value) {
      this.$emit('row-clicked', value)
    },
    getSortableClass(sortable) {
      return sortable !== false ? 'sortable' : ''
    },
    getAlignClass(align) {
      return align !== null ? 'text-' + align : 'text-left'
    }
  }
}
</script>

<style lang="scss">
::v-deep.v-icon__component {
  font-size: 14px !important;
}
.datatable {
  .pagination-main-outer {
    max-width: 308px;
    margin: auto;
  }
  .pagination-main-outer .v-pagination__more {
    align-items: center !important;
  }
  .bg-default {
    background: #13aba3;
  }
  tbody {
    tr {
      td:first-of-type {
        border-bottom: 0px !important;
      }
      td:last-of-type {
        border-bottom: 0px !important;
      }
    }
    tr:last-of-type {
      padding-bottom: 20px;
    }
  }
}
.pagination {
  list-style: none;
  display: flex;
  justify-content: center;
  li {
    margin: 10px;
    font-size: 12px;
    a {
      color: #1f2020;
    }
    &.active {
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #13aba3;
      border-radius: 50%;
      a {
        color: white !important;
      }
    }
  }
}
</style>
