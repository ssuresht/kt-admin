<template>
  <!-- SimpleModel Dialog -->
  <!-- getAllSettings.job_categories -->
  <v-dialog v-model="selfDialog" max-width="775" content-class="no-shadow">
    <template v-slot:default>
      <v-card class="pa-15">
        <v-card-title class="justify-center pa-0">{{ cardTitle }}</v-card-title>
        <v-card-text class="pb-5 mt-7">
          <div class="d-flex flex-wrap justify-center">
            <div
              class="mx-3 mb-4 item-checkbox"
              v-for="item in items"
              :key="item.id"
            >
              <v-checkbox
                :disabled="!allowSelection"
                v-model="setSelectedItems"
                :value="item.id"
                class="ma-0 px-3 py-1"
                hide-details
                multiple
              >
                <template v-slot:label>
                  <span class="text-333">
                    {{ item[lang] ? item[lang] : item }}
                  </span>
                </template>
              </v-checkbox>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            v-if="!buttonOption.hideCancel"
            color="white text-red border-red"
            min-width="236"
            @click.prevent="selfDialog = false"
          >
            {{ cancelButtonText }}
          </v-btn>
          <v-btn
            v-if="!buttonOption.hideSubmit"
            color="bg-red white--text"
            min-width="236"
            @click.prevent="submit()"
            :loading="loading"
          >
            {{ submitButtonText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <!-- SimpleModel Dialog end -->
</template>

<script>
export default {
  name: 'NGCountriesModel',
  props: {
    items: {
      type: [Array, Object],
      default: () => {
        return []
      },
      required: true
    },
    selectedItems: {
      type: [Array, Object],
      default: () => {
        return []
      },
      required: true
    },
    dialog: {
      type: Boolean,
      default: false,
      required: true
    },
    cardTitle: {
      type: String,
      default: 'NG国籍',
      required: false
    },
    submitButtonText: {
      type: String,
      default: '閉じる',
      required: false
    },
    cancelButtonText: {
      type: String,
      default: '戻る',
      required: false
    },
    lang: {
      type: String,
      default: 'ja',
      required: false
    },
    loading: {
      type: Boolean,
      default: false,
      required: false
    },
    allowSelection: {
      type: Boolean,
      default: false,
      required: false
    },
    buttonOption: {
      type: [Object],
      default: () => {
        return {
          hideSubmit: false,
          hideCancel: false
        }
      },
      required: false
    }
  },
  data() {
    return {
      setSelectedItems: []
    }
  },
  created() {
    this.setSelectedItems = this.selectedItems
  },
  computed: {
    selfDialog: {
      get() {
        return this.dialog
      },
      set() {
        return this.$emit('closeModel', true)
      }
    }
  },
  methods: {
    submit() {
      this.$emit('submitSuccess', this.setSelectedItems)
    }
  }
}
</script>

<style lang="css">
.item-checkbox {
  position: relative;
}
.item-checkbox .v-input--selection-controls__input {
  visibility: hidden;
  position: absolute;
  left: 0;
  top: 0;
}
.item-checkbox .v-input--is-label-active {
  background-color: rgba(255, 114, 131, 0.2);
  border-radius: 5px;
}
</style>
