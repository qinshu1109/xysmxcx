const authPage = {
  assets: {
    loginBg: '/static/auth/auth_login_bg.png',
    registerBg: '/static/auth/auth_register_bg.png',
    loginMascot: '/static/auth/auth_login_mascot_cat_fitted.png',
    registerMascot: '/static/auth/auth_register_mascot_cat_fitted.png',
    back: '/static/auth/icon_back.png',
    user: '/static/auth/icon_user.png',
    profile: '/static/auth/icon_profile_card.png',
    lock: '/static/auth/icon_lock.png',
    lockCheck: '/static/auth/icon_lock_check.png',
    eye: '/static/auth/icon_eye.png',
    eyeOff: '/static/auth/icon_eye_off.png'
  },
  login: {
    title: '欢迎来到校园拾喵驿站',
    subtitle: '登录后可以发布求助、发表评论'
  },
  register: {
    title: '创建你的爱心账号',
    subtitle: '一起守护校园里的小猫'
  }
}

const catsPage = {
  filters: [
    { label: '全部', value: 'all' },
    { label: '可领养', value: 'adoptable' },
    { label: '已绝育', value: 'neutered' },
    { label: '需关注', value: 'attention' },
    { label: '健康', value: 'healthy' }
  ]
}

const helpPage = {
  banners: [
    {
      id: 1,
      imageUrl: '/static/help-adoption/help_swiper_banner_01.png'
    }
  ],
  typeFilters: [
    { label: '全部', value: 'all' },
    { label: '求助', value: 'help' },
    { label: '领养', value: 'adoption' },
    { label: '喂养', value: 'feeding' },
    { label: '绝育', value: 'neuter' },
    { label: '受伤救助', value: 'injury' },
    { label: '其他', value: 'other' }
  ],
  statusFilters: [
    { label: '全部状态', value: 'all' },
    { label: '待处理', value: 'pending' },
    { label: '处理中', value: 'processing' },
    { label: '已完成', value: 'done' }
  ]
}

const publishPage = {
  banner: {
    imageUrl: '/static/publish/publish_tip_banner_01.png'
  },
  typeOptions: [
    { label: '求助', value: 'help' },
    { label: '领养', value: 'adoption' },
    { label: '喂养', value: 'feeding' },
    { label: '绝育', value: 'neuter' },
    { label: '受伤救助', value: 'injury' },
    { label: '其他', value: 'other' }
  ],
  form: {
    type: 'help',
    title: '',
    description: '',
    location: '',
    contact: ''
  },
  assets: {
    back: '/static/publish/icon_back_arrow.png',
    arrowRight: '/static/publish/icon_arrow_right.png',
    plus: '/static/publish/icon_plus.png',
    close: '/static/publish/icon_close.png',
    shield: '/static/publish/icon_privacy_shield.png',
    uploadImage: '/static/publish/icon_upload_image.png'
  }
}

const minePage = {
  user: {
    nickname: '未登录',
    account: '',
    roleText: '普通用户',
    slogan: '一起守护校园小猫',
    avatar: '/static/mine/mine_default_user_avatar.png',
    postCount: 0,
    commentCount: 0
  },
  assets: {
    guestHeaderBg: '/static/mine/mine_guest_header_bg.png',
    guestMascot: '/static/mine/mine_guest_mascot_cat.png',
    profileCardBg: '/static/mine/mine_profile_card_bg.png',
    decorPaw: '/static/mine/decor_paw.png',
    arrowRight: '/static/mine/icon_arrow_right.png'
  },
  guestMenus: [
    { key: 'posts', title: '我的发布', icon: '/static/mine/icon_my_posts.png' },
    { key: 'comments', title: '我的评论', icon: '/static/mine/icon_my_comments.png' },
    { key: 'about', title: '关于平台', icon: '/static/mine/icon_about.png' }
  ],
  userMenus: [
    { key: 'posts', title: '我的发布', icon: '/static/mine/icon_my_posts.png' },
    { key: 'comments', title: '我的评论', icon: '/static/mine/icon_my_comments.png' },
    { key: 'logout', title: '退出登录', icon: '/static/mine/icon_logout.png' }
  ]
}

const myPostsPage = {
  assets: {
    back: '/static/mypost/icon_back.png',
    time: '/static/mypost/icon_time.png',
    location: '/static/mypost/icon_location.png',
    bottomBanner: '/static/mypost/mypost_bottom_complete_banner.png',
    decorPaw: '/static/mypost/decor_paw.png'
  },
  filters: [
    { label: '全部', value: 'all' },
    { label: '待处理', value: 'pending' },
    { label: '处理中', value: 'processing' },
    { label: '已完成', value: 'done' }
  ]
}

const myCommentsPage = {
  assets: {
    back: '/static/mycomments/icon_back.png',
    time: '/static/mycomments/icon_time.png',
    arrowRight: '/static/mycomments/icon_arrow_right.png',
    tipBanner: '/static/mycomments/mycomments_tip_banner_01.png',
    decorPaw: '/static/mycomments/decor_paw.png'
  }
}

module.exports = {
  authPage,
  catsPage,
  helpPage,
  publishPage,
  minePage,
  myPostsPage,
  myCommentsPage
}
