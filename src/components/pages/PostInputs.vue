<template>
  <div>
    <v-card>
      <div class="mx-16 py-12">
        <div class="d-flex justify-end" >
            <span v-if="singleInternship" class="font-14px text-b8b8b8 mr-3">{{singleInternship.created_at | moment('YYYY/MM/DD') }} 公開</span>
            <span v-if="singleInternship" class="font-14px text-b8b8b8">{{singleInternship.updated_at | moment('YYYY/MM/DD')}} 更新</span>
          </div>
        <div v-if="sectionTitle" class="font-20px font-400">
          {{ sectionTitle }}
        </div>

        <v-row
          no-gutters
          :class="field.row_class"
          v-for="(field,index) in basicInformation"
          :key="index"
        >
          <v-col
            cols="12"
            :md="field.additional_field ? '6' : '12'"
            :class="field.col_class_left"
            class="mt-1"
          >
          
            <template v-if="field.type == 'text'">
              <div class="full-width">
                <div class="font-14px">
                  {{ field.label }}
                  <span
                    v-if="field.rules && field.rules.includes('required')"
                    class="font-12px error--text ml-2"
                    >必須</span
                  >
                </div>
                <validation-provider
                  v-slot="{ errors }"
                  :name="field.name"
                  :rules="field.rules"
                >
                  <v-text-field
                    :error-messages="errors"
                    :error="errors.length !== 0"
                    :hide-details="errors.length <= 0"
                    v-model="field.value"
                    single-line
                    color="#13ABA3"
                    class=" mt-1"
                    :class="{'font-18px':
                     field.placeholder === '企業ID、または企業名フリガナを入力してください' || field.placeholder === 'タイトルを入力してください',
                    'font-14px': field.placeholder !== '企業ID、または企業名フリガナを入力してください' || field.placeholder !== 'タイトルを入力してください'}"
                    outlined
                    dense
                    :placeholder="field.placeholder"
                  ></v-text-field>
                  <div
                    v-if="field.counter"
                    class="d-flex justify-end font-14px text-grey"
                  >
                    {{ field.value ? field.value.length : 0 }} /
                    {{ field.counterValue }}
                  </div>
                </validation-provider>
              </div>
            </template>

            <template v-if="field.type == 'textarea'">
              <div class="full-width">
                <div class="font-14px">
                  {{ field.label }}
                  <span
                    v-if="field.rules && field.rules.includes('required')"
                    class="font-12px error--text ml-2"
                    >必須</span
                  >
                </div>
                <validation-provider
                  v-slot="{ errors }"
                  :name="field.name"
                  :rules="field.rules"
                >
                  <v-textarea
                    :error-messages="errors"
                    :error="errors.length !== 0"
                    :hide-details="errors.length <= 0"
                    v-model="field.value"
                    single-line
                    color="#13ABA3"
                    class="font-16px mt-1"
                    outlined
                    dense
                    :placeholder="field.placeholder"
                  ></v-textarea>
                  <div
                    v-if="field.counter"
                    class="d-flex justify-end font-14px text-grey"
                  >
                    {{ field.value ? field.value.length : 0 }} 
                    {{ field.counterValue }}
                  </div>
                </validation-provider>
              </div>
            </template>

            <template v-if="field.type == 'dropdown'">
              <div class="full-width">
                <div class="font-14px">
                  {{ field.label }}
                  <span
                    v-if="field.rules && field.rules.includes('required')"
                    class="font-12px error--text ml-2"
                    >必須</span
                  >
                </div>
                <validation-provider
                  v-slot="{ errors }"
                  :name="field.name"
                  :rules="field.rules"
                >
                  <template v-if="field.multiple">
                    <v-select
                      outlined
                      dense
                      color="#13ABA3"
                      class="font-14px mt-1"
                      :error-messages="errors"
                      :error="errors.length !== 0"
                      :hide-details="errors.length <= 0"
                      :items="field.items"
                      :item-text="field.item_text"
                      :item-value="[field.item_value]"
                      :multiple="field.multiple"
                      :placeholder="field.placeholder"
                      v-model="field.value"
                      :no-data-text="field.no_data_text"
                    >
                      <template
                        v-if="field.append_outer_text"
                        v-slot:append-outer
                      >
                        <span class="text-no-wrap font-14px">
                          {{ field.append_outer_text }}
                        </span>
                      </template>
                    </v-select>
                  </template>
                  <template v-else>
                    <v-select
                      outlined
                      dense
                      color="#13ABA3"
                      class="font-14px mt-1"
                      :error-messages="errors"
                      :error="errors.length !== 0"
                      :hide-details="errors.length <= 0"
                      :items="field.items"
                      :item-text="field.item_text"
                      :item-value="field.item_value"
                      :placeholder="field.placeholder"
                      v-model="field.value"
                      :no-data-text="field.no_data_text"
                    >
                      <template
                        v-if="field.append_outer_text"
                        v-slot:append-outer
                      >
                        <span class="text-no-wrap font-14px">
                          {{ field.append_outer_text }}
                        </span>
                      </template>
                    </v-select>
                  </template>
                </validation-provider>
              </div>
            </template>

            <template v-if="field.type == 'autocomplete'">
              <div class="full-width">
                <div class="font-14px">
                  {{ field.label }}
                  <span
                    v-if="field.rules && field.rules.includes('required')"
                    class="font-12px error--text ml-2"
                    >必須</span
                  >
                </div>
                <validation-provider
                  v-slot="{ errors }"
                  :name="field.name"
                  :rules="field.rules"
                >
                  <v-autocomplete
                    outlined
                    dense
                    color="#13ABA3"
                    class="font-16px mt-1"
                    :error-messages="errors"
                    :error="errors.length !== 0"
                    :hide-details="errors.length <= 0"
                    hide-no-data
                    hide-selected
                    :items="field.items"
                    :item-text="field.item_text"
                    :item-value="field.item_value"
                    :placeholder="field.placeholder"
                    v-model="field.value"
                  ></v-autocomplete>
                </validation-provider>
              </div>
            </template>

            <template v-if="field.type == 'richbox'">
              <div class="full-width">
                <div class="font-18px mb-2">
                  {{ field.label }}
                  <span
                    v-if="field.rules && field.rules.includes('required')"
                    class="font-12px error--text ml-2"
                    >必須</span
                  >
                </div>
                <validation-provider
                  v-slot="{ errors }"
                  :name="field.name"
                  :rules="field.rules"
                >
                  <rich-text-editor
                    :error-messages="errors"
                    :data.sync="field.value"
                    :height="editorHeight"
                  />

                  <template v-if="errors && errors.length > 0">
                    <span class="font-12px text-red">{{ errors[0] }}</span>
                  </template>
                </validation-provider>
              </div>
            </template>
          </v-col>

          <template v-if="field.additional_field">
            <v-col
              v-if="
                field.additional_field.visibility_check &&
                field.value == field.additional_field.visible_value
                  ? false
                  : true
              "
              cols="12"
              md="6"
              class="mt-1"
              :class="field.additional_field.col_class_right"
            >
              <template>
                <div class="full-width">
                  <div class="font-14px visibility-hidden">
                    {{ field.label }}
                    <span
                      v-if="field.rules && field.rules.includes('required')"
                      class="font-12px error--text ml-2"
                      >必須</span
                    >
                  </div>
                  <div class="d-flex full-width">
                    <div
                      v-if="field.additional_field.relative_text"
                      class="d-flex align-center mr-1"
                    >
                      ～
                    </div>
                    <validation-provider
                      class="full-width"
                      v-slot="{ errors }"
                      :name="field.additional_field.name"
                      :rules="field.additional_field.rules"
                    >
                      <template v-if="field.additional_field.type == 'text'">
                        <v-text-field
                          :error-messages="errors"
                          :error="errors.length !== 0"
                          :hide-details="errors.length <= 0"
                          v-model="field.additional_field.value"
                          single-line
                          color="#13ABA3"
                          class="font-16px mt-1"
                          outlined
                          dense
                          :placeholder="field.additional_field.placeholder"
                        ></v-text-field>
                      </template>

                      <template
                        v-if="field.additional_field.type == 'dropdown'"
                      >
                        <v-select
                          outlined
                          dense
                          single-line
                          class="mt-1"
                          v-model="field.additional_field.value"
                          :placeholder="field.additional_field.placeholder"
                          :items="field.items"
                          :item-text="field.item_text"
                          :item-value="field.item_value"
                          :error-messages="errors"
                          :error="errors.length !== 0"
                          :hide-details="errors.length <= 0"
                          autocomplete="chrome-off"
                        >
                          <template
                            v-if="field.append_outer_text"
                            v-slot:append-outer
                          >
                            <span class="text-no-wrap">
                              {{ field.append_outer_text }}
                            </span>
                          </template>
                        </v-select>
                      </template>
                    </validation-provider>
                  </div>
                </div>
              </template>
            </v-col>
          </template>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
import RichTextEditor from '@/components/ui/RichTextEditor.vue'
export default {
  name: 'JobBasicInformation',
  components: {
    RichTextEditor
  },
 
  props: {
    basicInformation: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    singleInternship:{
      type: Object,
      required: false
    },
    editorHeight: {
      type: String,
      default: '400px'
    },
    sectionTitle: {
      type: [String, Boolean],
      default: '基本情報'
    }
  },
  methods: {}
}
</script>

<style scoped lang="scss">
::v-deep.v-text-field {
  label {
    font-size: 18px !important;
    color: #b8b8b8 !important;
  }
  .v-input__control {
    min-height: 20px;

    > .v-input__slot {
      background-color: #fff !important;
      box-shadow: none !important;
      padding-top: 11px;
      padding-bottom: 4px;
      padding-left: 38px;
      padding-right: 12px;
      min-height: 25px;
      input {
        padding: 0;
        height: 20px;
      }
    }
  }
}
</style>
