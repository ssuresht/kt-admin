<template>
  <!-- ImageModel Dialog -->
  <v-dialog
    v-model="selfDialog"
    style="width: auto"
    content-class="no-shadow img-models"
  >
    <template v-slot:default>
      <v-card color="transparent">
        <v-card-text class="text-center">
          <template v-if="Array.isArray(images)">
            <div class="">
              <v-img
                v-for="(image, index) in images"
                :key="index"
                :src="image"
                alt=""
                contain
                max-width="100%"
                max-height="100%"
                width="auto"
                height="auto"
                class="d-inline-block mx-2"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </div>
          </template>
          <template v-else>
            <v-img
              :src="images"
              contain
              alt=""
              class="d-inline-block"
              max-width="100%"
              max-height="100%"
              width="auto"
              height="auto"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </template>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            color="white text-red border-red"
            min-width="236"
            @click.prevent="selfDialog = false"
          >
            {{ returnButtonText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <!-- ImageModel Dialog end -->
</template>

<script>
export default {
  name: 'ImageModel',
  props: {
    dialog: {
      type: Boolean,
      default: false,
      required: true
    },
    images: {
      type: [String, Array],
      default: '',
      required: true
    },
    returnButtonText: {
      type: String,
      default: '閉じる',
      required: false
    },
    loading: {
      type: Boolean,
      default: false,
      required: false
    }
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
  }
}
</script>
<style lang="css" scope>
.img-models {
  width: auto;
}
</style>
