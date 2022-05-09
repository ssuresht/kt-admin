<template>
  <div>
    <v-card class="mt-5" height="205px">
      <div class="mx-10">
        <div class="pt-10">
          <div class="font-14px">
            タグ
          </div>
          <validation-provider v-slot="{ errors }" name="media_tag_id" rules="">
            <v-autocomplete
              :error-messages="errors"
              :error="errors.length !== 0"
              :hide-details="errors.length <= 0"
              outlined
              multiple
              dense
              color="#13ABA3"
              class="font-16px mt-1"
              :items="getAllMediaTags"
              item-text="name"
              item-value="id"
              placeholder="選択してください"
              v-model="mediaTag.value"
            >
              <template v-slot:selection="{ attrs, item, select, selected }">
                <v-chip
                  class="mt-1"
                  v-bind="attrs"
                  :input-value="selected"
                  @click="select"
                 
                >
                  <span>{{ item.name }}</span>
                  <v-avatar right @click="removeItem(item.id)">
                    <v-icon size="17">$GreenCross</v-icon>
                  </v-avatar>
                </v-chip>
              </template>
            </v-autocomplete>
          </validation-provider>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ColumnTag',
  
  data() {
    return {}
  },
  props: {
    mediaTag: {
      required: true
    }
  },
  computed: {
    ...mapGetters(['getAllMediaTags'])
  },
  created() {
    this.getDataFromApi()
  },
  methods: {
    removeItem(id) {
      this.mediaTag.value = this.mediaTag.value.filter(item => item !== id)
    },
    async getDataFromApi() {
      await this.$store.dispatch('MEDIA_TAGS_GET_ALL', {
        sort_by: 'created_at',
        sort_by_order: 'desc',
        paginate: 100,
        page: 1
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.v-input__append-inner {
  display: none !important;
}
</style>
