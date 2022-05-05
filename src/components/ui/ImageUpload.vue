<template>
  <div>
    <v-card class="text-center mt-5" height="794px">
      <div class=" pt-13">
        <validation-provider
          v-slot="{ errors }"
          name="seo_featured_image"
          rules="size:5120"
        >
          <div
            :class="{ 'px-2': $vuetify.breakpoint.smAndDown }"
            class=" file-input-box-container mx-auto"
          >
            <div
              class="file-input-box d-flex align-center justify-center"
              :class="data.previewImageURL ? 'hide-borders' : ''"
            >
              <div
                class="file-input-inr"
                :class="data.previewImageURL ? 'hide-icons' : ''"
              >
                <v-file-input
                  accept="image/*"
                  :error-messages="errors"
                  :error="errors.length !== 0"
                  :hide-details="errors.length <= 0"
                  hide-input
                  truncate-length="1"
                  @change="previewImage"
                  v-model="data.logoImage"
                  :class="data.previewImageURL ? 'hide-icons' : ''"
                  prepend-icon="mdi-plus-circle"
                  class="rounded-circle align-center justify-center pa-0 ma-auto white--text file-circle-icon bg-default"
                ></v-file-input>
                <h6 class="font-14px fw-500 text-default mb-0 text-green">
                  写真を登録する
                </h6>
                <div
                  @click="previewImage"
                  class="image-preview"
                  v-if="data.previewImageURL"
                >
                  <img
                    class="object-fit-cover"
                    :src="data.previewImageURL"
                    id="image"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>

          <template v-if="errors && errors.length > 0">
            <span class="font-12px text-red">{{ errors[0] }}</span>
          </template>
          <div
            :class="{ 'px-2': $vuetify.breakpoint.smAndDown }"
            class="file-upload-information-container mx-auto"
          >
            <div
              class="file-upload-information d-flex align-center justify-center font-14px mt-4"
            >
              画素：1,000px×2,000px<br />
              サイズ：5MB以下<br />
              形式：jpg、png
            </div>
          </div>
        </validation-provider>
      </div>
      <div class="mx-10">
        <div class="text-start mt-4">
          <span class="font-14px ">altテキスト</span>
          <validation-provider
            v-slot="{ errors }"
            name="seo_ogp"
            :rules="data.seo_ogp.rules"
          >
            <v-textarea
              :error-messages="errors"
              :error="errors.length !== 0"
              :hide-details="errors.length <= 0"
              single-line
              class="mt-1"
              outlined
              v-model="data.seo_ogp.value"
              dense
              rows="2"
              placeholder="altテキスト"
            ></v-textarea>
          </validation-provider>
        </div>
        <div class="text-start mt-2">
          <span class="font-14px ">スラグ</span>
          <validation-provider
            v-slot="{ errors }"
            name="seo_slug"
            :rules="data.seo_slug.rules"
          >
            <v-text-field
              :error-messages="errors"
              :error="errors.length !== 0"
              :hide-details="errors.length <= 0"
              single-line
              class="mt-1"
              outlined
              v-model="data.seo_slug.value"
              dense
              placeholder="スラグ"
            ></v-text-field>
          </validation-provider>
        </div>
        <div class="text-start mt-2">
          <div class="d-flex justify-space-between">
            <span class="font-14px ">メタディスクリプション</span>
            <span class="font-12px text-grey pt-1">推奨120文字以内</span>
          </div>

          <validation-provider
            v-slot="{ errors }"
            name="seo_meta_description"
            :rules="data.seo_meta_description.rules"
          >
            <v-textarea
              :error-messages="errors"
              :error="errors.length !== 0"
              :hide-details="errors.length <= 0"
              v-model="data.seo_meta_description.value"
              single-line
              class="mt-1"
              outlined
              dense
              min-height="175px"
              placeholder="メタディスクリプション"
            ></v-textarea>
            <div class="d-flex justify-end font-14px text-grey text-14px pb-12">
              {{
                data.seo_meta_description && data.seo_meta_description.value
                  ? data.seo_meta_description.value.length
                  : 0
              }}
            </div>
          </validation-provider>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ImageUpload',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    previewImage() {
      this.data.previewImageURL = URL.createObjectURL(this.data.logoImage)
    }
  }
}
</script>

<style lang="scss" scoped>
.file-input-box-container {
  max-width: 290px !important;
  .file-input-box {
    height: 134px;
    width: 100% !important;
    border: 1px dashed #13aba3;
    box-sizing: border-box;
    position: relative;
    border-radius: 5px;

    &.hide-borders {
      border: none;
    }
    &:hover {
      .hide-icons {
        position: relative;
        z-index: 100;
      }
    }
    .file-input-inr {
      position: relative;
      margin: auto;
      .file-circle-icon {
        ::v-deep.v-icon {
          color: #13aba3 !important;
          font-size: 30px !important;
        }
        &.hide-icons {
          & * {
            width: 100%;
            height: 100%;
            opacity: 0;
            z-index: 2;
          }
        }
        &:hover {
          // Show Input select File icon on hover of the box
          ::v-deep.v-icon {
            position: relative;
            z-index: 10;
          }
        }

        .v-input__prepend-outer {
          margin: auto;
          .v-icon {
            color: #fff !important;
          }
        }
      }

      &.hide-icons {
        width: 100%;
        height: 100%;
        background-color: transparent !important;
        h6 {
          visibility: hidden;
        }
        & * {
          background-color: transparent !important;
          width: 100%;
          height: 100%;
        }
      }
      .image-preview {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
}
.file-upload-information-container {
  max-width: 290px !important;
  .file-upload-information {
    width: 100%;
    border-radius: 5px;
    height: 89px;
    background: #f9f9f9;
    color: #7d7e7e;
    text-align: center;
  }
}

::v-deep {
  .v-label {
    font-size: 14px;
  }
}
</style>
