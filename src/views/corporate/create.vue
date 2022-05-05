<template>
  <div class="corporate-page create-page">
    <v-sheet color="transparent">
      <PageTitle
        :items="{
          title: '企業管理',
          subTitle: '企業新規作成',
          back: {
            action: () => {
              $router.push({
                name: 'Corporate'
              })
            }
          }
        }"
      ></PageTitle>
      <v-row>
        <v-col cols="12">
          <validation-observer ref="observer">
            <v-form @submit.prevent="submit">
              <v-card class="pa-5 rounded-sm">
                <v-container class="container-main">
                  <v-row>
                    <v-col cols="12" md="4" class="mt-1">
                      <div
                        class="d-flex flex-column align-center justify-center"
                      >
                        <div
                          class="file-input-box d-flex align-center justify-center preview"
                          @mouseover="$refs.close.style.visibility = 'visible'"
                          @mouseleave="$refs.close.style.visibility = 'hidden'"
                          v-if="croppedImagePreview"
                        >
                          <div
                            class="close d-flex align-center justify-center"
                            ref="close"
                          >
                            <v-btn
                              @click="croppedImagePreview = null"
                              width="50px"
                              height="50px"
                              color="primary"
                              fab
                              dark
                              ><v-icon color="white">mdi-close</v-icon></v-btn
                            >
                          </div>
                          <img
                            class="full-height full-width"
                            :src="croppedImagePreview"
                          />
                        </div>
                        <validation-provider
                          v-else
                          v-slot="{ errors }"
                          :name="$t('logo_img')"
                          rules="size:2048|ext:jpg,png|maxDimensions:500,500"
                        >
                          <div
                            class="file-input-box d-flex align-center justify-center"
                          >
                            <div class="file-input-inr">
                              <v-file-input
                                ref="fileInput"
                                accept="image/*"
                                :error-messages="errors"
                                :error="errors.length !== 0"
                                :hide-details="errors.length <= 0"
                                hide-input
                                truncate-length="1"
                                name="logo_image"
                                @change="previewImage"
                                v-model="fields.logo_img"
                                prepend-icon="mdi-plus"
                                class="rounded-circle align-center justify-center pa-0 ma-auto white--text file-circle-icon bg-default"
                              ></v-file-input>
                              <h6 class="font-14px fw-500 text-default mb-0">
                                ロゴを登録する
                              </h6>
                            </div>
                          </div>
                          <template v-if="errors.length > 0">
                            <span class="font-12px text-red">{{
                              errors[0]
                            }}</span>
                          </template>
                        </validation-provider>

                        <ImageCrop
                          v-if="previewImageURL"
                          :imageSrc="previewImageURL"
                          @image-crop-success="imageCropSuccess"
                          @crop-image-cancel="imageCropCancel"
                        ></ImageCrop>
                        <v-sheet
                          color="#F9F9F9"
                          width="200px"
                          height="91px"
                          class="d-flex align-center justify-center font-14px mt-4 rounded"
                        >
                          画素：256px×256px以上<br />
                          サイズ：2Mb以下<br />
                          形式：jpg、png
                        </v-sheet>
                      </div>
                    </v-col>
                    <v-col cols="12" md="8">
                      <v-row>
                        <v-col cols="12" md="12" class="mb-n5">
                          <label class="d-block font-14px mb-1">
                            <span>内部ID</span>
                            <span class="error--text ml-2 font-12px"></span>
                          </label>

                          <validation-provider
                            v-slot="{ errors }"
                            name="内部ID"
                            ref="observer"
                            rules=""
                          >
                            <v-text-field
                              :error-messages="errors"
                              :error="errors.length !== 0"
                              :hide-details="errors.length <= 0"
                              outlined
                              v-model="fields.internal_company_id"
                              dense
                              placeholder="登録時に生成します"
                              :disabled="true"
                            >
                            </v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="12" class="mb-n5">
                          <label class="d-block font-14px mb-1">
                            <span>企業名</span>
                            <span class="error--text ml-2 font-12px">必須</span>
                          </label>
                          <validation-provider
                            v-slot="{ errors }"
                            :name="$t('name')"
                            rules="required:企業名 "
                          >
                            <v-text-field
                              :error-messages="errors"
                              :error="errors.length !== 0"
                              :hide-details="errors.length <= 0"
                              outlined
                              v-model="fields.name"
                              dense
                              placeholder="企業名"
                              color="grey"
                              id="name"
                              name="name"
                              @input="handleNameInput"
                            >
                            </v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="12" class="mb-n5">
                          <label class="d-block font-14px mb-1">
                            <span>企業名フリガナ</span>
                          </label>
                          <validation-provider
                            v-slot="{ errors }"
                            :name="$t('name_furigana')"
                            rules="max:100"
                          >
                            <v-text-field
                              :error-messages="errors"
                              :error="errors.length !== 0"
                              :hide-details="errors.length <= 0"
                              outlined
                              v-model="fields.furigana_name"
                              dense
                              id="furigana"
                              name="furigana"
                              placeholder="企業名フリガナ"
                            >
                            </v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="12" class="mb-n5">
                          <label class="d-block font-14px mb-1">
                            <span>業界</span>
                          </label>
                          <validation-provider
                            v-slot="{ errors }"
                            :name="$t('business_industry_id')"
                          >
                            <v-select
                              :error-messages="errors"
                              :error="errors.length !== 0"
                              :hide-details="errors.length <= 0"
                              outlined
                              v-model="fields.business_industry_id"
                              dense
                              placeholder="選択してください"
                              item-text="name"
                              item-value="id"
                              :items="getCorporateCategories"
                              color="grey"
                            >
                            </v-select>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="12" class="mb-n5">
                          <label class="d-block font-14px mb-1">
                            <span>住所</span>
                          </label>
                          <validation-provider
                            v-slot="{ errors }"
                            :name="$t('office_adress')"
                            rules="max:100"
                          >
                            <v-text-field
                              :error-messages="errors"
                              :error="errors.length !== 0"
                              :hide-details="errors.length <= 0"
                              auto-select-first
                              chips
                              deletable-chips
                              dense
                              multiple
                              small-chips
                              v-model="fields.office_address"
                              outlined
                              item-text="ja"
                              item-value="id"
                              placeholder="住所"
                              color="grey"
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="12" class="mb-n5">
                          <label class="d-block font-14px mb-1">
                            <span>電話番号</span>
                          </label>
                          <validation-provider
                            v-slot="{ errors }"
                            :name="$t('office_phone')"
                          >
                            <v-text-field
                             
                              :error-messages="errors"
                              :error="errors.length !== 0"
                              :hide-details="errors.length <= 0"
                              outlined
                              v-model="fields.office_phone"
                              dense
                              placeholder="電話番号"
                            >
                            </v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="12" class="mb-n5">
                          <label class="d-block font-14px mb-1">
                            <span>メールアドレス1</span>
                          </label>
                          <validation-provider
                            v-slot="{ errors }"
                            :name="$t('office_email1')"
                            rules="email"
                          >
                            <v-text-field
                              :error-messages="errors"
                              :error="errors.length !== 0"
                              :hide-details="errors.length <= 0"
                              outlined
                              v-model="fields.office_email1"
                              dense
                              placeholder="メールアドレス1"
                            >
                            </v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="12" class="mb-n5">
                          <label class="d-block font-14px mb-1">
                            <span>メールアドレス2</span>
                          </label>
                          <validation-provider
                            v-slot="{ errors }"
                            :name="$t('office_email2')"
                            rules="email"
                          >
                            <v-text-field
                              :error-messages="errors"
                              :error="errors.length !== 0"
                              :hide-details="errors.length <= 0"
                              outlined
                              v-model="fields.office_email2"
                              dense
                              placeholder="メールアドレス2"
                            >
                            </v-text-field>
                          </validation-provider>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="12" class="mb-n5">
                          <label class="d-block font-14px mb-1">
                            <span>メールアドレス3</span>
                          </label>
                          <validation-provider
                            v-slot="{ errors }"
                            :name="$t('office_email3')"
                            rules="email"
                          >
                            <v-text-field
                              :error-messages="errors"
                              :error="errors.length !== 0"
                              :hide-details="errors.length <= 0"
                              outlined
                              v-model="fields.office_email3"
                              dense
                              placeholder="メールアドレス3"
                            >
                            </v-text-field>
                          </validation-provider>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="12" class="mb-n5">
                          <label class="d-block font-14px mb-1">
                            <span>ホームページURL</span>
                          </label>
                          <validation-provider
                            v-slot="{ errors }"
                            :name="$t('website_url')"
                            rules="url"
                          >
                            <v-text-field
                              :error-messages="errors"
                              :error="errors.length !== 0"
                              :hide-details="errors.length <= 0"
                              outlined
                              v-model="fields.website_url"
                              dense
                              placeholder="ホームページURL"
                            >
                            </v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="12" class="mb-n5">
                          <label class="d-block font-14px mb-1">
                            <span>担当者名</span>
                          </label>
                          <validation-provider
                            v-slot="{ errors }"
                            :name="$t('client_liason')"
                            rules="max:50"
                          >
                            <v-text-field
                              :error-messages="errors"
                              :error="errors.length !== 0"
                              :hide-details="errors.length <= 0"
                              outlined
                              v-model="fields.client_liason"
                              dense
                              placeholder="担当者名"
                            >
                            </v-text-field>
                          </validation-provider>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="12" class="mb-n5">
                          <label class="d-block font-14px mb-1">
                            <span>メモ</span>
                          </label>
                          <validation-provider
                            v-slot="{ errors }"
                            :name="$t('admin_memo')"
                            rules="max:1500"
                          >
                            <v-textarea
                              :error-messages="errors"
                              :error="errors.length !== 0"
                              :hide-details="errors.length <= 0"
                              outlined
                              v-model="fields.admin_memo"
                              dense
                              placeholder="メモ"
                            >
                            </v-textarea>
                          </validation-provider>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12" md="12" class="mb-n5">
                          <label class="d-block font-14px mb-1">
                            <span>ステータス</span>
                          </label>
                          <validation-provider
                            v-slot="{ errors }"
                            :name="$t('status')"
                            rules=""
                          >
                            <v-col cols="6" class="ml-16 pl-8">
                              <v-switch
                                color="primary"
                                class="mt-0 pt-0"
                                value
                                input-value="true"
                                :error-messages="errors"
                                :error="errors.length !== 0"
                                :hide-details="errors.length <= 0"
                                v-model="fields.status"
                                :label="switchLabel"
                              ></v-switch>
                            </v-col>
                          </validation-provider>
                        </v-col>
                      </v-row>
                      <v-col cols="12" md="8" class="mt-3 pl-10">
                        <v-btn
                          type="submit"
                          :loading="loading"
                          color=""
                          width="150"
                          height="35"
                          class="bg-default white--text ml-13"
                          placeholder="企業名"
                        >
                          登録
                        </v-btn>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-form>
          </validation-observer>
          <SuccessModel
            :text="`企業情報を登録しました。`"
            :buttonText="`企業一覧へ戻る`"
            :routeName="`Corporate`"
            :dialog="successDialog"
            @closeModel="successDialog = false"
          ></SuccessModel>
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<script>
import SuccessModel from '@/components/models/SuccessModel'
import ImageCrop from '@/components/admin/partials/Corporate/ImageCrop'
import CorporateMixin from './corporate.mixin'
export default {
  name: 'Create',
  mixins: [CorporateMixin],
  components: { SuccessModel, ImageCrop },
  metaInfo: {
    title: 'コトナル 管理者 企業管理 | 企業新規作成'
  },
  methods: {
    submit() {
      this.$refs.observer.validate().then(success => {
        if (!success) {
          return
        }
        this.loading = true
        this.fields.logo_img = this.croppedImagePreview
        this.$store
          .dispatch('CORPORATE_CREATE', this.fields)
          .then(() => {
            this.successDialog = true
            this.loading = false
          })
          .catch(error => {
            this.$refs.observer.setErrors(error.data.errors)
          })
          .finally(() => (this.loading = false))
      })
    }
  }
}
</script>

<style lang="scss" src="./style.scss" scope></style>
