import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index.js'
import VueMeta from 'vue-meta'

import Layout from '@/components/admin/layout/Layout'

Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true
})
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: {
      public: true,
      guest: true
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPassword.vue'),
    meta: {
      public: true,
      guest: true
    }
  },
  {
    path: '/update-password',
    name: 'ResetPassword',
    component: () => import('@/views/auth/ResetPassword.vue'),
    meta: {
      public: true,
      guest: true
    }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/views/Privacy/privacy.vue'),
    meta: {
      public: true,
      guest: true
    }
  },
  {
    path: '/terms-and-conditions',
    name: 'TermsAndConditions',
    component: () => import('@/views/TermsAndConditions/terms.vue'),
    meta: {
      public: true,
      guest: true
    }
  },
  {
    path: '/',
    redirect: 'login',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue')
      },
      {
        path: '/feedback',
        name: 'Feedbacks',
        component: () => import('@/views/feedback/index.vue'),
        meta: { title: 'フィードバック - 一覧' }
      },
      {
        path: '/feedback-create',
        name: 'FeedbackCreate',
        component: () => import('@/views/feedback/createOrEdit.vue'),
        meta: { title: 'フィードバック - 新規作成' }
      },
      {
        path: '/feedback-edit/:id',
        name: 'FeedbackEdit',
        component: () => import('@/views/feedback/createOrEdit.vue'),
        meta: { title: 'フィードバック - 新規作成' }
      },
      {
        path: '/students',
        name: 'Students',
        component: () => import('@/views/student/index.vue'),
        meta: { title: '学生 - 学生一覧' }
      },
      {
        path: '/applications',
        name: 'Applications',
        component: () => import('@/views/application/index.vue'),
        meta: { title: '応募管理' }
      },
      {
        path: '/student-profile/:id',
        name: 'StudentProfile',
        component: () => import('@/views/student/profile.vue'),
        meta: { title: '学生 - 学生詳細' }
      },
      {
        path: '/user-list',
        name: 'UserList',
        component: () => import('@/views/users/index.vue'),
        meta: { title: 'ユーザー管理 - ユーザー一覧' }
      },
      {
        path: '/user-details/:id',
        name: 'UserDetails',
        component: () => import('@/views/users/detail.vue'),
        meta: { title: 'ユーザー管理 - ユーザー詳細' }
      },
      {
        path: '/applications',
        name: 'UserApplications',
        component: () => import('@/views/users/applicants.vue'),
        meta: { title: '応募管理' }
      },
      {
        path: '/corporate',
        name: 'Corporate',
        component: () => import('@/views/corporate/index.vue'),
        meta: { title: '企業管理 - 一覧' }
      },
      {
        path: '/corporate-register',
        name: 'CorporateCreate',
        component: () => import('@/views/corporate/create.vue'),
        meta: { title: '企業管理 - 企業新規作成' }
      },
      {
        path: '/corporate-details/:id',
        name: 'CorporateEdit',
        component: () => import('@/views/corporate/edit.vue'),
        meta: { title: '企業管理 - 編集' }
      },
      {
        path: '/internship-create',
        name: 'InternshipPostCreate',
        component: () => import('@/views/internship/create.vue'),
        meta: { title: '求人広告 - 新規作成' }
      },
      {
        path: '/internship-edit/:id',
        name: 'InternshipPostEdit',
        component: () => import('@/views/internship/edit.vue'),
        meta: { title: '求人広告 - 編集' }
      },
      {
        path: '/internship-list',
        name: 'InternshipPostList',
        component: () => import('@/views/internship/list.vue'),
        meta: { title: '求人広告 - 一覧' }
      },
      {
        path: '/internship-draft',
        name: 'InternshipPostDraftList',
        component: () => import('@/views/internship/draft.vue'),
        meta: { title: '求人広告 - 下書き' }
      },
      {
        path: '/work-categories',
        name: 'WorkCategories',
        component: () => import('@/views/internship/occupation/index.vue'),
        meta: { title: '求人広告 - 職種管理' }
      },
      {
        path: '/internship-features',
        name: 'InternshipFeatures',
        component: () => import('@/views/internship/feature/index.vue'),
        meta: { title: '求人広告 - 特徴管理' }
      },
      {
        path: '/chat',
        name: 'Chat',
        component: () => import('@/views/chats/index.vue'),
        meta: { title: 'チャット - チャット一覧' }
      },
      {
        path: '/chat-details/:id',
        name: 'ChatDetails',
        component: () => import('@/views/chats/details.vue'),
        meta: { title: 'チャット - チャット詳細' }
      },
      {
        path: '/media',
        name: 'Media',
        component: () => import('@/views/media-post/index.vue'),
        meta: { title: 'コラム - 一覧' }
      },
      {
        path: '/media-tags',
        name: 'MediaTags',
        component: () => import('@/views/media-post/tags.vue'),
        meta: { title: 'コラム - タグ管理' }
      },
      {
        path: '/media-post-create',
        name: 'CreateMediaPost',
        component: () => import('@/views/media-post/create.vue'),
        meta: { title: 'コラム - 編集' }
      },
      {
        path: '/media-post-edit/:id',
        name: 'EditMediaPost',
        component: () => import('@/views/media-post/edit.vue'),
        meta: { title: 'コラム - 一覧' }
      },

      {
        path: '/notifications',
        name: 'Notifications',
        component: () => import('@/views/notifications/index.vue'),
        meta: { title: 'お知らせ管理 - お知らせ一覧' }
      },
      {
        path: '/notification-register',
        name: 'NotificationsCreate',
        component: () => import('@/views/notifications/create.vue'),
        meta: { title: 'お知らせ管理 - お知らせ編集' }
      },
      {
        path: '/notifications/:id',
        name: 'NotificationsEdit',
        component: () => import('@/views/notifications/edit.vue'),
        meta: { title: 'お知らせ管理 - お知らせ編集' }
      },
      {
        path: '/faqs',
        name: 'FAQs',
        component: () => import('@/views/faqs/index.vue'),
        meta: { title: 'FAQ管理 - FAQ一覧' }
      },
      {
        path: '/faq-register',
        name: 'FAQCreate',
        component: () => import('@/views/faqs/create.vue'),
        meta: { title: 'FAQ管理 - FAQ編集' }
      },
      {
        path: '/edit-faq/:id',
        name: 'FAQEdit',
        component: () => import('@/views/faqs/edit.vue'),
        meta: { title: 'FAQ管理 - FAQ編集' }
      },

      {
        path: '/educational_facilities',
        name: 'educational_facilities',
        component: () => import('@/views/educational_facilities/index.vue'),
        meta: { title: '教育機関' }
      },
      {
        path: '/admin-register',
        name: 'AdminsCreate',
        component: () => import('@/views/admin/create.vue'),
        meta: { title: '管理者 - 管理者登録' }
      },
      {
        path: '/admin-listing',
        name: 'AdminListing',
        component: () => import('@/views/admin/listing.vue'),
        meta: { title: '管理者 - 管理者登録' }
      },
      {
        path: '/admin-edit/:id',
        name: 'AdminsEdit',
        component: () => import('@/views/admin/edit.vue'),
        meta: { title: '管理者 - 管理者編集' }
      }
    ]
  },
  {
    path: '*',
    name: 'Error',
    component: () => import('@/views/error/Error.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

// Auth guard
router.beforeEach((to, from, next) => {
  const authRequired = !to.matched.some(record => record.meta.public)
  const loggedIn = store.getters.isLoggedIn

  if (to.meta.guest && to.meta.public) {
    next()
  }

  if (authRequired && !loggedIn) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (!authRequired && loggedIn) {
    next('/dashboard')
    return
  }
  next()
})

router.afterEach(to => {
  if (to.meta.title !== undefined) {
    document.title =
      to.meta.title != '' ? `${to.meta.title} | KOTONARU` : `KOTONARU`
  }
})

export default router
