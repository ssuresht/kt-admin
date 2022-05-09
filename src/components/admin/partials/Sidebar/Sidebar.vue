<template>
  <v-navigation-drawer
    app
    clipped
    v-model="DRAWER_STATE"
    :mini-variant="!DRAWER_STATE"
    :width="sidebarWidth"
    :permanent="$vuetify.breakpoint.mdAndUp"
    :temporary="$vuetify.breakpoint.smAndDown"
    :mini-variant-width="sidebarMinWidth"
    :class="{ 'drawer-mini': !DRAWER_STATE }"
    v-if="DRAWER_STATE"
  >
    <v-treeview
      :items="items"
      activatable
      :multiple-active="false"
      selected-color="indigo"
      open-on-click
      expand-icon="mdi-chevron-down"
      on-icon="mdi-bookmark"
      off-icon="mdi-bookmark-outline"
      indeterminate-icon="mdi-bookmark-minus"
      item-text="title"
      item-key="title"
      class="treeview-custom-sidebar"
      return-object
      transition
      v-if="DRAWER_STATE"
    >
      <template v-slot:label="{ item }">
        <div class="d-flex align-center" :class="item.class ? item.class : ''">
          <template v-if="item.link == '/logout'">
            <span class="page-link" @click="logOut()">
              {{ item.title }}
            </span>
          </template>
          <template v-else>
            <router-link class="page-link" v-if="item.link" :to="item.link">
              {{ item.title }}
            </router-link>
            <span class="page-link" v-else>
              {{ item.title }}
            </span>
          </template>
          <template v-if="item.badgeCount">
            <v-badge color="#E14D56" inline :content="item.badgeCount">
            </v-badge>
          </template>
        </div>
      </template>
      <template v-slot:prepend="{ item }">
        <v-icon
          v-if="!item.hideIcon"
          class="icon-arrow-right fill-primary"
          :size="item.iconText ? '6' : '17'"
          ref="icon"
          :style="
            item.icon_color
              ? `--color: ${item.icon_color}; --light-color: ${item.icon_color_light}`
              : ''
          "
        >
          {{ item.iconText ? item.iconText : item.icon }}
        </v-icon>
      </template>
    </v-treeview>
  </v-navigation-drawer>
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
  props: {
    source: String
  },
  data() {
    return {
      sidebarWidth: 240,
      sidebarMinWidth: 76
    }
  },
  mounted() {
    let tabsCollection = document.getElementsByClassName('v-treeview-node')
    Array.from(tabsCollection).forEach(item => {
      const link = item.querySelector(
        '.v-treeview-node__label > div > a.router-link-exact-active'
      )
      if (link) {
        const svg = item.querySelector('.v-treeview-node__prepend > span > svg')
        const svgPath = item.querySelector(
          '.v-treeview-node__prepend > span > svg > path'
        )
        setTimeout(() => {
          link.classList.add('text-primary')
        }, 1000)

        svg.classList.add('active-svg')
        if (svg.classList.contains('search-icon')) {
          svg.classList.add('search-icon-stroke')
        }
        svgPath.classList.add('active-svg')
      }
    })
    Array.from(tabsCollection).forEach(item => {
      item.addEventListener('click', () => {
        Array.from(tabsCollection).forEach(t1 => {
          let text
          if (t1.classList.contains('v-treeview-node--leaf')) {
            text = t1.querySelector('.v-treeview-node__label > div > a')
          } else {
            text = t1.querySelector('.v-treeview-node__label > div > span')
          }
          const svg = t1.querySelector('.v-treeview-node__prepend > span > svg')
          const svgPath = t1.querySelector(
            '.v-treeview-node__prepend > span > svg > path'
          )
          text.classList.remove('text-primary')
          svg.classList.remove('active-svg')
          svg.classList.remove('search-icon-stroke')
          svgPath.classList.remove('active-svg')
        })

        if (!item.classList.contains('v-treeview-node--leaf')) {
          const subMenu =
            item.querySelector('.v-treeview-node__children') &&
            item.querySelector('.v-treeview-node__children')

          for (let i = 0; i < subMenu.children.length; i++) {
            subMenu.children[i].addEventListener('click', () => {
              for (let j = 0; j < subMenu.children.length; j++) {
                const child = subMenu.children[j].querySelector(
                  '.v-treeview-node__content'
                )
                const childSvg = child.querySelector(
                  '.v-treeview-node__prepend > span > svg'
                )
                const childSvgPath = child.querySelector(
                  '.v-treeview-node__prepend > span > svg > path'
                )
                const text = child.querySelector(
                  '.v-treeview-node__label > div > a'
                )
                text.classList.remove('text-primary')
                childSvg.classList.remove('svg-active')
                childSvgPath.classList.remove('svg-active')
              }

              const child = subMenu.children[i].querySelector(
                '.v-treeview-node__content'
              )
              const childSvg = child.querySelector(
                '.v-treeview-node__prepend > span > svg'
              )
              const childSvgPath = child.querySelector(
                '.v-treeview-node__prepend > span > svg > path'
              )
              const text = child.querySelector(
                '.v-treeview-node__label > div > a'
              )
              childSvg.classList.add('svg-active')
              childSvgPath.classList.add('svg-active')
              setTimeout(() => {
                text.classList.add('text-primary')
              }, 1000)
            })
          }
        }

        var text
        if (item.classList.contains('v-treeview-node--leaf')) {
          text = item.querySelector('.v-treeview-node__label > div > a')
        } else {
          text = item.querySelector('.v-treeview-node__label > div > span')
        }
        const svg = item.querySelector('.v-treeview-node__prepend > span > svg')
        if (svg.classList.contains('search-icon')) {
          svg.classList.add('search-icon-stroke')
        }
        const svgPath = item.querySelector(
          '.v-treeview-node__prepend > span > svg > path'
        )
        svg.classList.add('active-svg')
        svgPath.classList.add('active-svg')
        setTimeout(() => {
          text.classList.add('text-primary')
        }, 1000)
      })
    })
  },
  computed: {
    ...mapGetters([
      'user',
      'getApprovedCompanies',
      'getTotalStudents',
      'getTotalUnreadApplications'
    ]),
    ...mapState(['drawer']),
    DRAWER_STATE: {
      get() {
        return this.drawer
      },
      set(newValue) {
        if (newValue === this.drawer) return
        this.TOGGLE_DRAWER()
      }
    },

    items() {
      return [
        {
          title: this.$t('sidebar.link_titles.top'),
          icon: '$HomeIcon',
          link: { name: 'Dashboard' }
        },
        {
          title: this.$t('sidebar.link_titles.job_info.title'),
          icon: '$Search',
          model: false,
          class: 'hide-count-on-open',
          badgeCount: 0,
          children: [
            {
              title: this.$t('sidebar.link_titles.job_info.list_all'),
              icon: 'mdi-circle-small',
              iconText: '$ArrowRightDrop',
              link: { name: 'InternshipPostList' }
            },
            {
              title: this.$t('sidebar.link_titles.job_info.create_new'),
              icon: 'mdi-circle-small',
              iconText: '$ArrowRightDrop',
              badgeCount: 0,

              link: { name: 'InternshipPostCreate' }
            },
            {
              title: this.$t('sidebar.link_titles.job_info.draft'),
              icon: 'mdi-circle-small',
              iconText: '$ArrowRightDrop',
              link: { name: 'InternshipPostDraftList' }
            },
            {
              title: '職種管理',
              icon: 'mdi-circle-small',
              iconText: '$ArrowRightDrop',
              link: { name: 'WorkCategories' }
            },
            {
              title: this.$t('sidebar.link_titles.job_info.feature_management'),
              icon: 'mdi-circle-small',
              iconText: '$ArrowRightDrop',
              link: { name: 'InternshipFeatures' }
            }
          ]
        },

        {
          title: this.$t('sidebar.link_titles.application.title'),
          icon: '$PaperPlaneIcon',
          model: false,
          badgeCount: this.$store.getters.getTotalUnreadApplications,
          class: 'hide-count-on-open',
          link: { name: 'Applications' }
        },

        {
          title: this.$t('sidebar.link_titles.feedback.title'),
          icon: '$messages',
          model: false,
          children: [
            {
              title: this.$t('sidebar.link_titles.feedback.list_all'),
              icon: 'mdi-circle-small',
              iconText: '$ArrowRightDrop',
              link: { name: 'Feedbacks' }
            },
            {
              title: this.$t('sidebar.link_titles.feedback.create_new'),
              icon: 'mdi-circle-small',
              iconText: '$ArrowRightDrop',
              link: { name: 'FeedbackCreate' }
            }
          ]
        },
        {
          title: this.$t('sidebar.link_titles.user_management.title', {
            count: this.$store.getters.getTotalStudents
          }),
          icon: '$Account',
          link: { name: 'Students' }
        },
        {
          title: this.$t('sidebar.link_titles.corporate.title', {
            count: this.$store.getters.getApprovedCompanies
          }),
          icon: '$Companies',
          model: false,
          children: [
            {
              title: this.$t('sidebar.link_titles.corporate.list_all'),
              icon: 'mdi-circle-small',
              iconText: '$ArrowRightDrop',
              link: { name: 'Corporate' }
            },
            {
              title: this.$t(
                'sidebar.link_titles.corporate.create_new_corporation'
              ),
              icon: 'mdi-circle-small',
              iconText: '$ArrowRightDrop',
              link: { name: 'CorporateCreate' }
            }
          ]
        },
        {
          title: this.$t('sidebar.link_titles.column.title'),
          icon: '$Bell',
          model: false,
          children: [
            {
              title: this.$t('sidebar.link_titles.column.list_all'),
              icon: 'mdi-circle-small',
              iconText: '$ArrowRightDrop',
              link: { name: 'Media' }
            },
            {
              title: this.$t('sidebar.link_titles.column.tag_management'),
              icon: 'mdi-circle-small',
              iconText: '$ArrowRightDrop',
              link: { name: 'MediaTags' }
            }
          ]
        },
        {
          title: this.$t('sidebar.link_titles.settings.title'),
          icon: '$Setting',
          model: false,
          children: [
            {
              title: '教育機関',
              icon: 'mdi-circle-small',
              iconText: '$ArrowRightDrop',
              link: { name: 'educational_facilities' }
            },
            {
              title: '管理者',
              icon: 'mdi-circle-small',
              iconText: '$ArrowRightDrop',
              link: { name: 'AdminListing' }
            },
            {
              title: 'ログアウト',
              icon: 'mdi-circle-small',
              iconText: '$ArrowRightDrop',
              link: '/logout'
            }
          ]
        }
      ]
    }
  },
  methods: {
    ...mapActions(['TOGGLE_DRAWER']),
    logOut() {
      this.$store.dispatch('AUTH_LOGOUT')
    }
  }
}
</script>

<style src="./Sidebar.scss" lang="scss" />
