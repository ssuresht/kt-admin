<template>
  <div class="chat-details-page">
    <div
      class="
        heading-text
        fw-500
        d-flex
        justify-space-between
        flex-wrap
        align-center
        mt-5
        mb-4
      "
    >
      <h2 class="font-24px mb-1 mr-4">
        <span class="fw-500">チャット</span>
        <span class="line"></span>
        <span class="font-20px fw-400">チャット詳細</span>
      </h2>
      <v-btn :to="{ name: 'Chat' }" text class="text-7d transparent">
        <v-icon size="17" class="mr-1" style="fill: #7d7d7d"
          >$PreviousAngleCircle</v-icon
        >
        戻る
      </v-btn>
    </div>
    <v-container>
      <v-row>
        <template v-if="loading">
          <v-col cols="12">
            <v-skeleton-loader v-if="loading" type="list-item-two-line,card">
            </v-skeleton-loader>
            <v-skeleton-loader v-if="loading" type="card"> </v-skeleton-loader>
            <v-skeleton-loader v-if="loading" type="card"> </v-skeleton-loader>
          </v-col>
        </template>
        <template v-else>
          <v-col cols="12" md="4">
            <v-card class="py-4 px-7 mb-5">
              <v-card-title class="py-0 text-dark-green"
                >ユーザー情報</v-card-title
              >
              <div class="avatar-blk mt-5 d-flex align-center">
                <v-avatar size="80px">
                  <v-img
                    alt="Avatar"
                    :src="
                      singleChat.user ? singleChat.user.face_picture_path : ''
                    "
                  ></v-img>
                </v-avatar>
                <div class="avatar-right ml-6 mb-1">
                  <h6 class="font-14px mb-2 text-333">
                    ID：{{ singleChat.user ? singleChat.user.id : '' }}
                  </h6>
                  <h6 class="font-14px mb-0 text-333">
                    {{ singleChat.user ? singleChat.user.user_name : '' }}
                  </h6>
                </div>
              </div>
              <div class="text-right">
                <v-btn
                  text
                  class="text-dark-green transparent"
                  target="_blank"
                  :to="{
                    name: 'UserDetails',
                    params: { id: singleChat.user ? singleChat.user.id : 0 }
                  }"
                >
                  <span class="mr-2">詳細を見る</span>
                  <v-icon
                    style="fill: #317c5a; transform: rotate(-180deg)"
                    size="17"
                    >$PreviousAngleCircle</v-icon
                  >
                </v-btn>
              </div>
            </v-card>
            <v-card class="py-4 px-7 mb-5">
              <v-card-title class="py-0 text-dark-green">企業情報</v-card-title>
              <div class="avatar-blk mt-5 d-flex align-center">
                <v-avatar size="80px">
                  <v-img
                    alt="Avatar"
                    :src="
                      singleChat.user ? singleChat.corporate.photo_id_path : ''
                    "
                  ></v-img>
                </v-avatar>
                <div class="avatar-right ml-6 mb-1">
                  <h6 class="font-14px mb-2 text-333">
                    ID：{{ singleChat.corporate ? singleChat.corporate.id : 0 }}
                  </h6>
                  <h6 class="font-14px mb-0 text-333">
                    {{ singleChat.corporate ? singleChat.corporate.name : '' }}
                  </h6>
                </div>
              </div>
              <div class="text-right">
                <v-btn
                  text
                  class="text-dark-green transparent"
                  target="_blank"
                  :to="{
                    name: 'corporateEdit',
                    params: {
                      id: singleChat.corporate ? singleChat.corporate.id : 0
                    }
                  }"
                >
                  <span class="mr-2">詳細を見る</span>
                  <v-icon
                    style="fill: #317c5a; transform: rotate(-180deg)"
                    size="17"
                    >$PreviousAngleCircle</v-icon
                  >
                </v-btn>
              </div>
            </v-card>
            <v-card class="py-4 px-7 mb-5">
              <v-card-title class="py-0 text-dark-green">仕事情報</v-card-title>
              <div class="message-chat-detail-blk mt-5 mb-1">
                <h6 class="text-333 font-14px text-truncate">
                  {{ singleChat.job ? singleChat.job.title : '' }}
                </h6>
                <div class="chat-inr-blk">
                  <div class="d-flex align-center chat-inr-item">
                    <span class="label-detail-chat font-14px">業種</span>
                    <span class="text-333 font-14px" v-if="singleChat.job">
                      {{ singleChat.job ? singleChat.job.job_type.ja : '' }}
                    </span>
                  </div>
                  <div class="d-flex align-center chat-inr-item">
                    <span class="label-detail-chat font-14px">職種</span>
                    <span class="text-333 font-14px">
                      {{ singleChat.job ? singleChat.job.position_type : '' }}
                    </span>
                  </div>
                  <div class="d-flex align-center chat-inr-item">
                    <span class="label-detail-chat font-14px">勤務日</span>
                    <span class="text-333 font-14px text-truncate">
                      {{ singleChat.job ? singleChat.job.work_date : '' }}(木)
                      <span class="ml-2" v-if="singleChat.job">
                        {{
                          [
                            singleChat.job.work_start_time,
                            singleChat.job.work_end_time
                          ].join('～')
                        }}
                      </span>
                    </span>
                  </div>
                  <div class="d-flex align-center chat-inr-item">
                    <span class="label-detail-chat font-14px">勤務場所</span>
                    <span
                      class="text-333 font-14px text-truncate"
                      v-if="singleChat.job"
                    >
                      {{
                        [
                          singleChat.job.prefecture
                            ? singleChat.job.prefecture.ja
                            : '',
                          singleChat.job.city,
                          singleChat.job.address
                        ].join(' ')
                      }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <v-btn
                  text
                  target="_blank"
                  class="text-dark-green transparent"
                  :to="{
                    name: 'JobDetails',
                    params: { id: singleChat.job ? singleChat.job.id : 0 }
                  }"
                >
                  <span class="mr-2">詳細を見る</span>
                  <v-icon
                    style="fill: #317c5a; transform: rotate(-180deg)"
                    size="17"
                    >$PreviousAngleCircle</v-icon
                  >
                </v-btn>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="8">
            <v-card>
              <v-card-title class="bg-green white--text justify-space-between">
                <span
                  class="mr-auto d-flex align-center cursor-pointer"
                  style="max-width: 80%"
                  @click="
                    $router.push({
                      name: 'JobDetails',
                      params: { id: singleChat.job ? singleChat.job.id : 0 }
                    })
                  "
                >
                  <span class="my-auto text-truncate font-18px">{{
                    singleChat.job ? singleChat.job.title : ''
                  }}</span>
                  <v-icon
                    class="ml-1"
                    style="fill: #fff; transform: rotate(-180deg)"
                  >
                    $PreviousAngleCircle
                  </v-icon>
                </span>
                <v-icon
                  @click="setFaviroteChat()"
                  :style="
                    singleChat.is_favorite == 1
                      ? '--inner:#FFF7C0; --outer: #B8B8B8;'
                      : '--inner:#B8B8B8; --outer: #B8B8B8;'
                  "
                >
                  $Star
                </v-icon>
              </v-card-title>
              <v-card-text class="pr-1">
                <div
                  class="chat-main-blk d-flex flex-column pr-2"
                  ref="chat_main_container"
                >
                  <div
                    v-for="chat in singleChat.chat"
                    :key="chat.id"
                    :class="
                      chat.user_type == 'corporate' ? 'chat-right' : 'chat-left'
                    "
                    class="chat-text-blk d-flex align-center"
                  >
                    <v-avatar size="40px" class="chat-avatar mt-auto">
                      <v-img
                        alt="Avatar"
                        :src="
                          chat.user_type == 'corporate'
                            ? singleChat.corporate.photo_id_path
                            : singleChat.user.face_picture_path
                        "
                      ></v-img>
                    </v-avatar>
                    <div class="chat-text-message pa-3">
                      <p class="ma-0 text-333 font-14px">
                        {{ chat.message }}
                      </p>
                    </div>
                    <span class="mt-auto chat-datetime font-14px">
                      {{ chat.created_at }}
                    </span>
                    <v-progress-circular
                      v-if="chat.loading_send_message"
                      indeterminate
                      color="deep-orange lighten-2"
                    ></v-progress-circular>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      loading: false,
      singleChat: {
        chat: [],
        user: {},
        job: {},
        corporate: {}
      }
    }
  },
  created() {
    this.getDataFromApi()
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    async getDataFromApi() {
      this.loading = true
      await this.$store
        .dispatch('CHATS_GET', { id: this.$route.params.id })
        .then(response => {
          this.loading = false
          if (response?.data?.chats) {
            this.singleChat = response?.data?.chats
          } else {
            this.showAlert(response)
          }
          this.scrollChatContainerToBottom()
        })
        .catch(error => {
          this.loading = false
          this.showAlert(error)
        })
    },
    scrollChatContainerToBottom() {
      this.$nextTick(() => {
        var chatContainer = this.$refs.chat_main_container
        if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight
      })
    },
    setFaviroteChat() {
      if (!this.singleChat?.id) return

      let isFavorited = !this.singleChat.is_favorite
      let payload = {
        chat_id: this.singleChat.id,
        user_id: this.user.id,
        is_favorite: isFavorited ? 1 : 0
      }
      this.$store.dispatch('CHATS_SAVE_FAVORITE', payload).then(res => {
        if (res.status == 200) {
          this.showAlert(res)
        }
        this.singleChat.is_favorite = isFavorited
      })
    }
  }
}
</script>

<style lang="scss" src="./styles.scss" scoped></style>
