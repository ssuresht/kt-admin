<template>
  <div>
    <div
      v-if="items"
      class="fw-500
              heading-text
              d-flex
              justify-space-between
              flex-wrap
              align-center
              mt-7
              mb-8"
    >
      <div class="d-flex align-center flex-wrap">
        <h2 class="font-24px mb-1 mr-7">
          <span class="fw-500">{{ items.title }}</span>
          <span class="line" v-if="items.subTitle"></span>
          <span class="font-20px fw-400" v-if="items.subTitle">{{
            items.subTitle
          }}</span>
        </h2>
      </div>
      <v-row class="pl-6" no-gutters v-if="items.tabs && items.tabs.length > 0">
        <v-col
          cols="auto"
          class="mr-4"
          v-for="(tab, index) in items.tabs"
          :key="index"
        >
          <v-btn
            :ref="`tab-${index}`"
            depressed
            color="transparent"
            @click="tabAction(tab, index)"
            class=" pa-0"
          >
            {{ tab.title }} ({{ tab.count }})
            <div class="position-relative" v-if="tab.notification">
              <v-badge
                color="#E14D56"
                inline
                :content="tab.notification"
              ></v-badge>
            </div>
          </v-btn>
        </v-col>
      </v-row>
      <div
        class="d-flex font-14px align-center"
        v-if="items.buttons && items.buttons.length > 0"
      >
        <v-btn
          color="primary"
          min-width="188px"
          min-height="35px"
          v-for="(button, index) in items.buttons"
          :key="index"
          class="ml-5"
          id="btns"
          :class="button.class"
          @click="button.action"
          v-bind="button.others"
        >
          <div class="d-flex align-center">
            <v-icon size="15">{{ button.icon }}</v-icon>
            <span class="ml-1" v-if="button.icon">{{ button.title }}</span>
            <span v-else>{{ button.title }}</span>
          </div>
        </v-btn>
      </div>
      <div class="d-flex font-14px align-center" v-if="items.back">
        <v-btn @click="items.back.action" text color="transparent">
          <v-icon>$ChevronLeft</v-icon
          ><span class="text-7d mt-1">戻る</span></v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pageTitle',
  props: {
    items: {
      default: [],
      required: true
    }
  },
  mounted() {
    if (this.items.tabs && this.items.tabs.length > 0)
      this.$refs['tab-0'][0].$el.classList.add('primary--text')
  },
  methods: {
    tabAction(tab, index) {
      for (let refs in this.$refs) {
        if (refs === `tab-${index}`) {
          this.$refs[refs][0].$el.classList.add('primary--text')
        } else {
          this.$refs[refs][0].$el.classList.remove('primary--text')
        }
      }
      tab.action()
    }
  }
}
</script>

<style lang="scss" scoped>
#btns {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
</style>
