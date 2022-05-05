<template>
  <v-card class="searchable-box pb-5 px-5">
    <v-card-title
      class="pa-0 justify-space-between card-title pt-5 pb-2 mb-3 text-333 font-18px"
      @click="ownToggleSearch = !ownToggleSearch"
      v-ripple
    >
      <span>検索</span>
      <v-btn
        color="transparent"
        text
        @click="ownToggleSearch = !ownToggleSearch"
      >
        <span class="small-line"></span>
      </v-btn>
    </v-card-title>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-form @submit.prevent="searchSubmit">
        <h6 class="font-14px mb-1 text-333">検索条件</h6>
        <v-row>
          <v-col cols="12" md="6">
            <div class="d-flex align-start">
              <validation-provider
                v-slot="{ errors }"
                name="search_option"
                rules="required"
              >
                <v-sheet width="187px" color="transparent">
                  <v-select
                    :error-messages="errors"
                    :error="errors.length !== 0"
                    :hide-details="errors.length <= 0"
                    outlined
                    dense
                    @change="changeInputSearchType"
                    v-model="inputSearchType"
                    item-text="name"
                    item-value="id"
                    :items="selectTypeOptions"
                    class="mr-6"
                    color="grey"
                  >
                  </v-select>
                </v-sheet>
              </validation-provider>

              <div
                v-for="field in searchFields"
                :key="field.name"
                class="d-flex align-center"
              >
                <template v-if="field.type == 'select'">
                  <validation-provider
                    v-slot="{ errors }"
                    :name="field.name"
                    :rules="field.rules"
                  >
                    <v-select
                      :error-messages="errors"
                      :error="errors.length !== 0"
                      :hide-details="errors.length <= 0"
                      outlined
                      dense
                      v-model="field.value"
                      :placeholder="field.placeholder"
                      :class="field.class"
                      :item-text="field.item_text"
                      :item-value="field.item_value"
                      :items="field.items"
                      color="grey"
                    >
                    </v-select>
                  </validation-provider>
                </template>
                <template v-if="field.type == 'date'">
                  <validation-provider
                    v-slot="{ errors }"
                    :name="field.name"
                    :rules="field.rules"
                  >
                    <DatePicker
                      :error-messages="errors"
                      :error="errors.length !== 0"
                      :hide-details="errors.length <= 0"
                      v-model="field.value"
                      outlined
                      dense
                      :field="field"
                      :separator="field.separator ? field.separator : '-'"
                      :min="
                        field.range
                          ? searchFields.find(
                              el => el.name == field.range_input
                            ).value
                          : ''
                      "
                    >
                    </DatePicker>
                  </validation-provider>
                </template>
                <template v-if="field.type == 'text'">
                  <validation-provider
                    v-slot="{ errors }"
                    :name="field.name"
                    :rules="field.rules"
                  >
                    <v-sheet color="transparent" width="463px">
                      <v-text-field
                        :error-messages="errors"
                        :error="errors.length !== 0"
                        :hide-details="errors.length <= 0"
                        outlined
                        dense
                        v-model="field.value"
                        :placeholder="field.placeholder"
                        :class="field.class"
                      >
                      </v-text-field>
                    </v-sheet>
                  </validation-provider>
                </template>
                <span v-if="field.show_after_approx" class="font-11px mx-1"
                  >～</span
                >
              </div>
              <!-- <v-btn
                type="reset"
                text
                class="mt-1 ml-1 text-grey pa-2 font-11px"
                height="30"
                @click="resetForm()"
              >
                条件をクリア
              </v-btn> -->
            </div>
          </v-col>
          <v-col cols="12" md="6" class="text-right">
            <v-btn
              type="submit"
              class="white--text"
              color="primary"
              width="114px"
              height="35px"
              :disabled="invalid"
            >
              検索
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </validation-observer>
  </v-card>
</template>

<script>
import DatePicker from '@/components/ui/DatePicker'

export default {
  name: 'SearchArea',
  components: { DatePicker },
  props: {
    toggleSearch: {
      type: Boolean,
      default: false,
      required: true
    },
    searchFields: {
      type: [Array, Object],
      default: function() {
        return []
      },
      required: true
    },
    selectTypeOptions: {
      type: [Array, Object],
      default: function() {
        return []
      },
      required: true
    }
  },
  data() {
    return {
      inputSearchType: this.selectTypeOptions[0]?.id
    }
  },
  created() {
    this.changeInputSearchType()
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
  methods: {
    searchSubmit() {
      this.$emit('searchSubmit', {
        type: this.inputSearchType,
        fields: this.searchFields
      })
    },
    changeInputSearchType() {
      this.$emit('changedInputType', this.inputSearchType)
    }
    // resetForm() {
    //   if (!this.searchFields) return

    //   this.searchFields.forEach(field => {
    //     Object.keys(field).forEach(el => {
    //       field.value = ''
    //     })
    //   })
    //   this.$refs.observer.reset()
    //   this.$emit('resetForm', true)
    // }
  }
}
</script>
