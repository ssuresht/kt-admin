<template>
  <div class="user-details-page">
    <div
      class="
        heading-text
        fw-500
        d-flex
        justify-space-between
        flex-wrap
        align-center
        mt-5
        mb-8
      "
    >
      <h2 class="font-24px mb-1 mr-4">
        <span class="fw-500">ユーザー管理</span>
        <span class="line"></span>
        <span class="font-20px fw-400">ユーザー詳細</span>
      </h2>
      <v-btn :to="{ name: 'UserList' }" text class="text-7d transparent">
        <v-icon size="17" class="mr-1" style="fill: #7d7d7d">
          $PreviousAngleCircle
        </v-icon>
        戻る
      </v-btn>
    </div>
    <v-card class="pa-5 rounded-sm py-10">
      <v-container class="container-main py-10">
        <v-row>
          <v-col cols="12" md="4" class="pt-0">
            <div class="left-side-main">
              <div class="file-input-box d-flex align-center justify-center">
                <div class="file-input-inr">
                  <div class="image-preview" v-if="previewImageURL">
                    <img
                      class="rounded-circle object-fit-cover"
                      width="188"
                      height="188"
                      :src="previewImageURL"
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <div class="profile-details-text mt-4">
                <div class="text-center">
                  <h6 class="mb-1 font-14px">ID {{ singleUser.id }}</h6>
                  <div class="d-flex justify-center">
                    <v-icon
                      size="19"
                      :style="
                        `fill: ${
                          singleUser.member_type.toLowerCase() == 'member'
                            ? '#317C5A'
                            : '#8E8E8E'
                        }`
                      "
                    >
                      $VerifiedCheck
                    </v-icon>
                    <h6 class="mb-1 ml-2 font-14px">
                      {{ singleUser.user_name }}
                    </h6>
                  </div>
                  <h6 class="mb-1 font-14px">
                    {{ singleUser.user_name_kana }}
                  </h6>
                </div>
                <h6
                  class="my-0 font-14px"
                  :class="singleUser.status != 'Approved' ? 'text-center' : ''"
                  v-if="singleUser.created_at"
                >
                  登録日：{{ singleUser.created_at }}
                </h6>
                <template v-if="singleUser.status == 'Approved'">
                  <h6 class="my-0 font-14px" v-if="singleUser.last_login_date">
                    最終ログイン：{{ singleUser.last_login_date }}
                  </h6>
                  <div class="d-flex align-center mt-2">
                    <span class="text-center d-inline-block mr-1">
                      <v-btn
                        class="
                          bg-dark-green
                          rounded-xl
                          font-12px
                          white--text
                          fw-400
                          d-flex
                          justify-center
                          align-center
                        "
                        width="72"
                        height="20"
                        elevation="0"
                      >
                        完了
                      </v-btn>
                      <span class="font-18px d-block text-no-wrap">
                        {{ singleUser.completed_jobs }}
                        <span class="fw-400 font-12px">回</span>
                      </span>
                    </span>
                    <span class="text-center d-inline-block mr-1">
                      <v-btn
                        class="
                          bg-blue
                          rounded-xl
                          font-12px
                          white--text
                          fw-400
                          d-flex
                          justify-center
                          align-center
                        "
                        width="72"
                        height="20"
                        elevation="0"
                      >
                        キャンセル
                      </v-btn>
                      <span class="font-18px d-block text-no-wrap">
                        {{ singleUser.cancelled_jobs }}
                        <span class="fw-400 font-12px">回</span>
                      </span>
                    </span>
                    <span class="text-center d-inline-block mr-0">
                      <v-btn
                        class="
                          bg-red
                          rounded-xl
                          font-12px
                          white--text
                          fw-400
                          d-flex
                          justify-center
                          align-center
                        "
                        width="72"
                        height="20"
                        elevation="0"
                      >
                        当日欠勤
                      </v-btn>
                      <span class="font-18px d-block text-no-wrap">
                        {{ singleUser.absence_count }}
                        <span class="fw-400 font-12px">回</span>
                      </span>
                    </span>
                  </div>
                  <div class="mt-9">
                    <v-btn
                      text
                      height="0"
                      class="font-14px pa-0 ml-2 text-dark-blue"
                      @click.prevent="dialog.delete = true"
                    >
                      <v-icon size="18" class="text-dark-blue mr-1">
                        $Warning
                      </v-icon>
                      削除する
                    </v-btn>

                    <SimpleModel
                      :text="[
                        `このユーザーを削除しますか？`,
                        `削除すると対象のユーザーは非会員となります`
                      ]"
                      :dialog="dialog.delete"
                      :loading="loading"
                      @submitSuccess="deleteUser()"
                      @closeModel="dialog.delete = false"
                    ></SimpleModel>
                  </div>
                </template>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="8">
            <v-row>
              <v-col cols="12" md="6" class="mb-n2 pa-1">
                <div class="form-group d-flex align-center pa-1">
                  <label
                    class="
                      font-14px
                      bg-red-light
                      rounded-xl
                      d-flex
                      align-center
                      justify-center
                      text-center
                      mb-auto
                    "
                  >
                    <span>国籍</span>
                  </label>
                  <div class="detail-right">
                    <h6 class="ma-0 font-14px">
                      {{
                        singleUser.nationality ? singleUser.nationality.ja : '-'
                      }}
                    </h6>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="mb-n2 pa-1">
                <div class="form-group blk-right d-flex align-center pa-1">
                  <label
                    class="
                      font-14px
                      bg-red-light
                      rounded-xl
                      d-flex
                      align-center
                      justify-center
                      text-center
                      mb-auto
                    "
                  >
                    <span>性別</span>
                  </label>
                  <div class="detail-right">
                    <h6 class="ma-0 font-14px">
                      {{ singleUser.gender.ja }}
                    </h6>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="mb-n2 pa-1">
                <div class="form-group d-flex align-center pa-1">
                  <label
                    class="
                      font-14px
                      bg-red-light
                      rounded-xl
                      d-flex
                      align-center
                      justify-center
                      text-center
                      mb-auto
                    "
                  >
                    <span>選択言語</span>
                  </label>
                  <div class="detail-right">
                    <h6 class="ma-0 font-14px">
                      {{ getLanguage(singleUser.language_preference) }}
                    </h6>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="mb-n2 pa-1">
                <div class="form-group blk-right d-flex align-center pa-1">
                  <label
                    class="
                      font-14px
                      bg-red-light
                      rounded-xl
                      d-flex
                      align-center
                      justify-center
                      text-center
                      mb-auto
                    "
                  >
                    <span>生年月日</span>
                  </label>
                  <div class="detail-right">
                    <h6 class="ma-0 font-14px">
                      {{ singleUser.dob | moment('YYYY/M/D') }}
                      <span class="ml-1"
                        >({{ calculateAge(singleUser.dob) }}歳)</span
                      >
                    </h6>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="12" class="mb-n2 pa-1">
                <div class="form-group d-flex align-center pa-1">
                  <label
                    class="
                      font-14px
                      bg-red-light
                      rounded-xl
                      d-flex
                      align-center
                      justify-center
                      text-center
                      mb-auto
                    "
                  >
                    <span>住所</span>
                  </label>
                  <div class="detail-right">
                    <h6 class="ma-0 font-14px">
                      {{
                        singleUser.prefecture ? singleUser.prefecture.ja : ''
                      }}
                      {{
                        singleUser.municipalities
                          ? singleUser.municipalities
                          : ''
                      }}
                      {{ singleUser.address ? singleUser.address : '' }}
                    </h6>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="mb-n2 pa-1">
                <div class="form-group d-flex align-center pa-1">
                  <label
                    class="
                      font-14px
                      bg-red-light
                      rounded-xl
                      d-flex
                      align-center
                      justify-center
                      text-center
                      mb-auto
                    "
                  >
                    <span>最寄り駅</span>
                  </label>
                  <div class="detail-right">
                    <h6 class="ma-0 font-14px">{{ singleUser.station }}</h6>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="mb-n2 pa-1">
                <div class="form-group blk-right d-flex align-center pa-1">
                  <label
                    class="
                      font-14px
                      bg-red-light
                      rounded-xl
                      d-flex
                      align-center
                      justify-center
                      text-center
                      mb-auto
                    "
                  >
                    <span>現在の仕事状況</span>
                  </label>
                  <div class="detail-right">
                    <h6 class="ma-0 font-14px">
                      {{
                        singleUser.current_job_status
                          ? singleUser.current_job_status.ja
                          : '-'
                      }}
                    </h6>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="mb-n2 pa-1">
                <div class="form-group d-flex align-center pa-1">
                  <label
                    class="
                      font-14px
                      bg-red-light
                      rounded-xl
                      d-flex
                      align-center
                      justify-center
                      text-center
                      mb-auto
                    "
                  >
                    <span>婚姻状況</span>
                  </label>
                  <div class="detail-right">
                    <h6 class="ma-0 font-14px">
                      {{ singleUser.marital_status.ja }}
                    </h6>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="mb-n2 pa-1">
                <div class="form-group blk-right d-flex align-center pa-1">
                  <label
                    class="
                      font-14px
                      bg-red-light
                      rounded-xl
                      d-flex
                      align-center
                      justify-center
                      text-center
                      mb-auto
                    "
                  >
                    <span>電話番号</span>
                  </label>
                  <div class="detail-right">
                    <h6 class="ma-0 font-14px">{{ singleUser.phone }}</h6>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="12" class="mb-n2 pa-1">
                <div class="form-group d-flex align-center pa-1">
                  <label
                    class="
                      font-14px
                      bg-red-light
                      rounded-xl
                      d-flex
                      align-center
                      justify-center
                      text-center
                      mb-auto
                    "
                  >
                    <span>メールアドレス</span>
                  </label>
                  <div class="detail-right">
                    <h6 class="ma-0 font-14px">{{ singleUser.email }}</h6>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="mb-n2 pa-1">
                <div class="form-group d-flex align-center pa-1">
                  <label
                    :class="
                      singleUser.update_profile_history.updated_visa == '1'
                        ? 'bg-red white--text'
                        : 'bg-red-light'
                    "
                    class="
                      font-14px
                      rounded-xl
                      d-flex
                      align-center
                      justify-center
                      text-center
                      mb-auto
                    "
                  >
                    <span>ビザ</span>
                  </label>
                  <div
                    class="detail-right d-flex align-center img-modal"
                    @click="
                      dialog.images = true
                      loadImages = [
                        singleUser.visa_front_picture_path,
                        singleUser.visa_back_picture_path
                      ]
                    "
                  >
                    <h6 class="ma-0 font-14px">
                      {{ singleUser.visa_type ? singleUser.visa_type.ja : '' }}
                    </h6>
                    <v-icon size="18" v-if="singleUser.visa_type" class="ml-3">
                      $CameraIcon
                    </v-icon>
                    <v-img
                      class="d-none"
                      lazy-src=""
                      max-height="0"
                      max-width="0"
                      :src="singleUser.visa_front_picture_path"
                    ></v-img>
                    <v-img
                      class="d-none"
                      lazy-src=""
                      max-height="0"
                      max-width="0"
                      :src="singleUser.visa_back_picture_path"
                    ></v-img>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="mb-n2 pa-1">
                <validation-provider
                  v-slot="{ errors }"
                  name="visa_expiration_date"
                  rules="required"
                >
                  <div class="form-group blk-right d-flex align-center pa-1">
                    <label
                      class="
                        font-14px
                        bg-red-light
                        rounded-xl
                        d-flex
                        align-center
                        justify-center
                        text-center
                        mb-auto
                      "
                    >
                      <span>ビザ有効期限</span>
                    </label>

                    <div
                      class="detail-right date-visa-input d-flex align-center"
                    >
                      <div
                        class="date-picker-outr"
                        :class="
                          visaExpiryDate.value &&
                          visaExpiryDate.value < $moment().format('YYYY/MM/DD')
                            ? 'text-red'
                            : ''
                        "
                      >
                        <DatePicker
                          :field="visaExpiryDate"
                          :errors="errors"
                          dense
                          v-model="visaExpiryDate.value"
                          :error-messages="errors"
                          :error="errors.length !== 0"
                          :hide-details="errors.length <= 0"
                          @input="error = null"
                          :min="`${$moment().format('YYYY-MM-DD')}`"
                          :disabled="
                            singleUser.status != 'Approved' ? false : true
                          "
                          :separator="'/'"
                        >
                        </DatePicker>
                        <span
                          class="font-14px date-formatter"
                          v-html="getFormattedDate(visaExpiryDate.value)"
                        ></span>
                      </div>
                      <v-icon
                        v-if="
                          visaExpiryDate.value >
                            $moment().format('YYYY/MM/DD') &&
                            singleUser.status != 'Approved'
                        "
                        size="16"
                        class="ml-3"
                        >$Pincel</v-icon
                      >

                      <v-tooltip
                        color="white"
                        top
                        v-if="
                          visaExpiryDate.value < $moment().format('YYYY/MM/DD')
                        "
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            size="16"
                            class="ml-3 mt-1"
                            v-bind="attrs"
                            v-on="on"
                            >$WarningRed</v-icon
                          >
                        </template>
                        <span class="white-dark-bg"
                          >ビザの有効期限が切れています</span
                        >
                      </v-tooltip>
                    </div>
                  </div>
                  <div v-if="errors[0]" class="text-right">
                    <span class="font-10px text-no-wrap text-red pr-8">
                      {{ errors[0] }}
                    </span>
                  </div>
                </validation-provider>
              </v-col>
              <v-col cols="12" md="12" class="mb-n2 pa-1">
                <div class="form-group d-flex align-center pa-1">
                  <label
                    :class="
                      singleUser.update_profile_history.updated_picture_id ==
                      '1'
                        ? 'bg-red white--text'
                        : 'bg-red-light'
                    "
                    class="
                      font-14px
                      rounded-xl
                      d-flex
                      align-center
                      justify-center
                      text-center
                      mb-auto
                    "
                  >
                    <span>身分証明書</span>
                  </label>
                  <div
                    class="detail-right d-flex align-center img-modal"
                    @click="
                      dialog.images = true
                      loadImages = singleUser.picture_id_path
                    "
                  >
                    <h6 class="ma-0 font-14px">
                      {{
                        singleUser.picture_type_id
                          ? singleUser.picture_type_id.ja
                          : ''
                      }}
                    </h6>
                    <v-icon size="18" class="ml-3"> $CameraIcon </v-icon>
                  </div>
                  <v-img
                    class="d-none"
                    lazy-src=""
                    max-height="0"
                    max-width="0"
                    :src="singleUser.picture_id_path"
                  ></v-img>
                </div>
              </v-col>
              <v-col cols="12" md="12" class="mb-n2 pa-1">
                <div class="form-group d-flex align-center pa-1">
                  <label
                    :class="
                      singleUser.update_profile_history.updated_certificate ==
                      '1'
                        ? 'bg-red white--text'
                        : 'bg-red-light'
                    "
                    class="
                      font-14px
                      rounded-xl
                      d-flex
                      align-center
                      justify-center
                      text-center
                      mb-auto
                    "
                  >
                    <span>保有資格</span>
                  </label>
                  <div class="detail-right">
                    <template v-if="singleUser.certificates.length > 0">
                      <div
                        v-for="certificate in singleUser.certificates"
                        :key="certificate.id"
                        class="d-flex align-center mb-1 img-modal"
                        @click="
                          dialog.images = true
                          loadImages = certificate.image_path
                        "
                      >
                        <h6 class="ma-0 font-14px">
                          {{ certificate.title }}
                        </h6>
                        <v-icon
                          v-if="certificate.image_path"
                          size="18"
                          class="ml-3"
                        >
                          $CameraIcon
                        </v-icon>
                        <v-img
                          class="no-opacity"
                          lazy-src=""
                          max-height="0"
                          max-width="0"
                          :src="certificate.image_path"
                        ></v-img>
                      </div>
                    </template>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="12" class="mb-n2 pa-1">
                <div
                  class="form-group d-flex align-center pa-1"
                  :class="
                    !singleUser.reject_message ||
                    singleUser.reject_message == ''
                      ? 'border-bottom-0'
                      : ''
                  "
                >
                  <label
                    class="
                      font-14px
                      bg-red-light
                      rounded-xl
                      d-flex
                      align-center
                      justify-center
                      text-center
                      mb-auto
                    "
                  >
                    <span>職務経歴</span>
                  </label>
                  <div class="detail-right">
                    <template v-if="singleUser.work_history">
                      <h6
                        class="ma-0 font-14px d-flex align-start"
                        v-for="work in singleUser.work_history"
                        :key="work.id"
                      >
                        <span class="min-width-75px mr-2">
                          {{ work.date | moment('YYYY/MM') }}
                        </span>
                        <span>{{ work.memo }}</span>
                      </h6>
                    </template>
                  </div>
                </div>
              </v-col>

              <template
                v-if="
                  (singleUser.reject_at || singleUser.reject_message) &&
                    singleUser.status == 'Rejected'
                "
              >
                <div>
                  <v-col cols="12" md="12" class="mb-n2 pa-1">
                    <div
                      class="
                        form-group
                        d-flex
                        align-center
                        pa-1
                        border-bottom-0
                      "
                    >
                      <label
                        class="
                          font-14px
                          d-flex
                          align-center
                          justify-center
                          text-center
                          mb-auto
                          rounded-xl
                          bg-red-light
                        "
                      >
                        差戻し内容
                      </label>
                      <div class="reject-text">
                        <h6 class="ma-0 font-14px d-flex align-start text-red">
                          <span
                            v-if="singleUser.rejected_at"
                            class="min-width-75px mr-5"
                          >
                            {{ singleUser.rejected_at }}
                          </span>
                          <span>
                            {{ singleUser.reject_message }}
                          </span>
                        </h6>
                      </div>
                    </div>
                  </v-col>
                </div>
              </template>

              <template v-if="singleUser.status != 'Approved'">
                <v-col cols="12" md="12" class="mt-2">
                  <div class="text-left mt-1">
                    <template v-if="error">
                      <div class="ml-md-15 mb-3 fw-500 text-left font-12px">
                        <FlashMessage :error="error" />
                      </div>
                    </template>
                    <!-- Remand Dialog -->
                    <v-dialog
                      v-model="dialog.remand"
                      max-width="775"
                      content-class="no-shadow"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          type="button"
                          max-width="148px"
                          width="100%"
                          height="35"
                          class="white border-red text-red mr-5"
                          v-bind="attrs"
                          v-on="on"
                          :disabled="
                            singleUser.status == 'Rejected' ? true : false
                          "
                        >
                          差戻し
                        </v-btn>
                      </template>
                      <template v-slot:default>
                        <validation-observer ref="observer">
                          <v-form>
                            <v-card class="py-6 px-16">
                              <v-card-text class="pb-5 px-5">
                                <h4
                                  class="
                                    mb-3
                                    d-flex
                                    justify-center
                                    align-center
                                    font-20px
                                  "
                                >
                                  差し戻しの理由を入力してください
                                </h4>
                                <p
                                  class="
                                    mb-3
                                    fw-400
                                    font-12px
                                    text-red text-center
                                  "
                                >
                                  身分証明書と保有資格の両方を差し戻す場合、差し戻しメモにそれぞれの差し戻し理由を記載してください。
                                </p>
                                <validation-provider
                                  v-slot="{ errors }"
                                  :name="$t(rejectMessage.name)"
                                  rules="required"
                                >
                                  <v-textarea
                                    :error-messages="errors"
                                    :error="errors.length !== 0"
                                    :hide-details="errors.length <= 0"
                                    outlined
                                    v-model="rejectMessage.value"
                                    height="222px"
                                    rows="5"
                                    row-height="15"
                                    placeholder="テキストを入力してください"
                                  ></v-textarea>
                                </validation-provider>
                              </v-card-text>
                              <v-card-actions class="justify-center">
                                <v-btn
                                  type="button"
                                  color="white text-red border-red mr-3"
                                  min-width="236"
                                  @click.prevent="dialog.remand = false"
                                >
                                  戻る
                                </v-btn>
                                <v-btn
                                  type="button"
                                  color="bg-red white--text"
                                  min-width="236"
                                  @click.prevent="remandUserSubmit()"
                                  :loading="loading"
                                >
                                  差し戻す
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-form>
                        </validation-observer>
                      </template>
                    </v-dialog>
                    <!-- Remand Dialog end -->

                    <v-btn
                      type="button"
                      max-width="148px"
                      width="100%"
                      height="35"
                      class="bg-red white--text"
                      @click.prevent="dialog.approve = true"
                    >
                      承認
                    </v-btn>
                    <!-- Approve Dialog -->
                    <SimpleModel
                      :text="`このユーザーの登録申請を承認しますか？`"
                      :dialog="dialog.approve"
                      :loading="loading"
                      :submitButtonText="`承認`"
                      @submitSuccess="submit('Approved')"
                      @closeModel="dialog.approve = false"
                    ></SimpleModel>
                    <!-- Approve Dialog end -->
                  </div>
                </v-col>
              </template>

              <SuccessModel
                :text="successDialogModelText"
                :dialog="dialog.success"
                :buttonText="`一覧へ戻る`"
                :routeName="`UserList`"
              ></SuccessModel>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <template v-if="singleUser.status == 'Approved'">
      <v-container class="pa-0 mt-5 pa-0">
        <v-row>
          <v-col cols="12" md="12" class="py-0">
            <div
              class="
                fw-500
                heading-text
                d-flex
                justify-space-between
                flex-wrap
                align-center
                my-7
              "
            >
              <div class="d-flex align-center flex-wrap">
                <h2 class="font-20px ma-0 mr-7">応募求人</h2>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="12" class="d-flex w-100 pt-0">
            <DataTable
              :items="initialLoad ? [] : getUserJobs"
              :headers="headers"
              :total-records="getUserJobTotalRecord ? getUserJobTotalRecord : 0"
              :number-of-pages="getUserJobTotalPages ? getUserJobTotalPages : 0"
              @update:options="updateTable"
              :loading="loading"
            >
              <template v-slot:[`item.work_date`]="{ item }">
                {{ item.work_date | moment('YYYY/MM/DD') }}
                {{ [item.work_start_time, item.work_end_time].join('~') }}
              </template>

              <template v-slot:[`item.title`]="{ item }">
                <div class="d-flex align-center">
                  <v-badge
                    dot
                    inline
                    :color="item.publish == '1' ? '#AAEFA7' : '#B8B8B8'"
                  ></v-badge>
                  <span class="ml-4 truncate-lines lines-1">{{
                    item.title.ja
                  }}</span>
                </div>
              </template>

              <template v-slot:[`item.action`]="{ item }">
                <v-btn
                  :color="getStatusColors(item)"
                  width="72"
                  height="20"
                  elevation="0"
                  :class="[
                    item.status_label.en == 'Scheduled' ||
                    item.status_label.en == 'Completed'
                      ? 'white--text'
                      : ''
                  ]"
                  class="font-12px fw-500 rounded-xl"
                >
                  {{ item.status_label.ja }}
                </v-btn>
              </template>
            </DataTable>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <ImageModel
      :images="loadImages"
      :dialog="dialog.images"
      @closeModel="dialog.images = false"
    ></ImageModel>
  </div>
</template>

<script>
import DataTable from '@/components/ui/DataTable'
import DatePicker from '@/components/ui/DatePickerDialog'
import SimpleModel from '@/components/models/SimpleModel'
import SuccessModel from '@/components/models/SuccessModel'
import ImageModel from '@/components/models/ImageModel'
import FlashMessage from '@/components/FlashMessage'
import { mapGetters } from 'vuex'

export default {
  name: 'DetailsPage',
  components: {
    FlashMessage,
    DataTable,
    DatePicker,
    SimpleModel,
    SuccessModel,
    ImageModel
  },
  metaInfo: {
    title: 'コトナル 管理者 ユーザー管理 | ユーザー詳細'
  },
  data() {
    return {
      error: null,
      loadImages: '',
      dialog: {
        images: false,
        visa: false,
        profile: false,
        certificate: {},
        delete: false,
        remand: false,
        approve: false,
        success: false
      },
      successDialogModelText: '',
      headers: [
        {
          text: 'No.',
          align: 'center',
          sortable: false,
          value: 'id'
        },
        {
          text: '仕事タイトル',
          align: 'center',
          sortable: false,
          value: 'title'
        },
        {
          text: '企業名',
          align: 'center',
          sortable: false,
          value: 'corporate_name'
        },
        {
          text: '業種',
          align: 'center',
          sortable: false,
          value: 'job_type.ja'
        },
        {
          text: '職種',
          align: 'center',
          sortable: false,
          value: 'position_type.ja'
        },
        {
          text: '勤務日時',
          align: 'center',
          sortable: true,
          value: 'work_date'
        },
        {
          text: 'ステータス',
          align: 'center',
          sortable: false,
          helpIcon: false,
          value: 'action'
        }
      ],
      initialLoad: true,
      loading: false,
      previewImageURL: null,
      visaExpiryDate: {
        name: 'visa_expiration_date',
        menu: false,
        value: '',
        date: '',
        locale: 'ja'
      },
      rejectMessage: {
        name: 'reject_message',
        value: ''
      }
    }
  },
  created() {
    this.getDataFromApi()
    this.getUserJobsFromApi()
  },
  computed: {
    singleUser() {
      return this.$store.getters.singleUser
    },
    ...mapGetters([
      'user',
      'getAllSettings',
      'getUserJobs',
      'getUserJobTotalPages',
      'getUserJobTotalRecord'
    ])
  },
  methods: {
    async getUserJobsFromApi(e = undefined, obj = {}) {
      this.loading = true
      let data = {}
      data.sort_by_order = e?.sortDesc[0] ? 'desc' : 'asc'
      data.sort_by = e?.sortBy[0] ? e.sortBy[0] : 'work_date'
      data.page = e?.page ? e.page : 1
      data.paginate = e?.itemsPerPage ? e.itemsPerPage : 25
      data.user_id = this.$route.params.id

      data = Object.assign({}, obj, data)

      await this.$store
        .dispatch('USERS_JOBS', data)
        .then(() => {
          if (this.initialLoad) {
            this.initialLoad = false
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    updateTable(e) {
      if (!this.initialLoad) this.getDataFromApi(e)
    },
    async getDataFromApi() {
      this.loading = true
      await this.$store
        .dispatch('USERS_GET', { id: this.$route.params.id })
        .then(() => {
          this.previewImageURL = this.singleUser.face_picture_path
          this.visaExpiryDate.value = this.singleUser.visa_expiry_date
            ? this.singleUser.visa_expiry_date.split('-').join('/')
            : null
        })
        .finally(() => {
          this.loading = false
        })
    },
    calculateAge(birthday) {
      return this.$moment().diff(birthday, 'years')
    },
    remandUserSubmit() {
      this.$refs.observer.validate().then(success => {
        if (!success) {
          return
        }

        this.error = null
        this.loading = true
        const payload = {
          user_id: this.$route.params.id,
          status: 'Rejected',
          reject_message: this.rejectMessage.value
        }

        this.$store
          .dispatch('USERS_CHANGE_STATUS', payload)
          .then(response => {
            this.closeModels()
            this.singleUser.status = 'Rejected'
            this.successDialogModelText = '差戻しが完了しました'
            this.dialog.success = true
          })
          .catch(error => {
            this.closeModels()
            this.showAlert(error)
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    submit(status = false) {
      this.loading = true
      const payload = {
        user_id: this.$route.params.id,
        status: status ? status : this.singleUser.status
      }

      this.error = null
      if (this.visaExpiryDate.value && this.visaExpiryDate.value != '') {
        payload.visa_expiry_date = this.visaExpiryDate.value
      } else {
        this.closeModels()
        this.loading = false
        this.error = 'ビザ有効期限を入力してください'
        return
      }

      this.$store
        .dispatch('USERS_CHANGE_STATUS', payload)
        .then(response => {
          this.closeModels()
          if (status == 'Approved') {
            this.singleUser.status = 'Approved'
            this.successDialogModelText = 'ユーザーの登録を承認しました'
            this.dialog.success = true
          }
        })
        .catch(error => {
          this.closeModels()
          this.showAlert(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    closeModels() {
      Object.keys(this.dialog).forEach(item => {
        this.dialog[item] = false
      })
    },
    getFormattedDate(date) {
      if (!date || date == '')
        return `
        <span class='date-underline'>&nbsp;</span>
        <span class='date-underline'>&nbsp;</span>
        <span class='date-underline'>&nbsp;</span>
        <span class='date-underline'>&nbsp;</span>
        <span>/</span>
        <span class='date-underline'>&nbsp;</span>
        <span class='date-underline'>&nbsp;</span>
        <span>/</span>
        <span class='date-underline'>&nbsp;</span>
        <span class='date-underline'>&nbsp;</span>
      `
      const [year, month, day] = date.split('/')
      const [a, b] = day.split('')
      const [c, d] = month.split('')
      const [e, f, g, h] = year.split('')
      return `
        <span class='date-underline'>${e}</span>
        <span class='date-underline'>${f}</span>
        <span class='date-underline'>${g}</span>
        <span class='date-underline'>${h}</span>
        <span>/</span>
        <span class='date-underline'>${c}</span>
        <span class='date-underline'>${d}</span>
        <span>/</span>
        <span class='date-underline'>${a}</span>
        <span class='date-underline'>${b}</span>
      `
    },
    getStatusColors(item) {
      return item.status_label.en == 'Applied'
        ? '#FFF7C0' // Yellow
        : item.status_label.en == 'Scheduled'
        ? '#AAEFA7' // Green
        : item.status_label.en == 'Completed'
        ? '#317C5A' // Dark Green
        : item.status_label.en == 'Canceled'
        ? '#6EC4DB' // Blue
        : item.status_label.en == 'No show'
        ? '#E87C64' // Red
        : item.status_label.en == 'Reject'
        ? '#7D7D7D'
        : '' // Grey
    },
    getLanguage(langId) {
      // return
      return this.getAllSettings.language_settings[langId]
    },
    async deleteUser() {
      this.error = null
      if (this.$route.params.id > 0) {
        this.loading = true
        await this.$store
          .dispatch('USERS_DELETE', { id: this.$route.params.id })
          .then(() => {
            this.$router.push({ name: 'UserList' })
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>

<style lang="scss" src="./__style.scss" scope></style>
