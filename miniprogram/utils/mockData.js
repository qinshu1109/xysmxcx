const homeData = {
  platformName: '校园拾喵驿站',
  banners: [
    {
      id: 1,
      imageUrl: '/static/home/home_swiper_banner_01.png'
    }
  ],
  stats: {
    catCount: 12,
    helpPostCount: 8,
    adoptionSuccessCount: 5
  },
  quickEntries: [
    {
      title: '猫咪图鉴',
      subtitle: '认识校园猫咪',
      icon: '/static/home/home_quick_icon_catbook.png'
    },
    {
      title: '意见反馈',
      subtitle: '您的建议很重要',
      icon: '/static/home/home_quick_icon_feedback.png'
    },
    {
      title: '申请志愿者',
      subtitle: '加入爱心团队',
      icon: '/static/home/home_quick_icon_volunteer.png'
    }
  ],
  latestHelpPosts: [
    {
      id: 1,
      title: '小白腿部受伤',
      description: '在图书馆附近发现小白腿部受伤',
      date: '2024-01-15',
      status: 'pending',
      statusText: '待处理',
      imageUrl: '/static/home/home_help_thumb_xiaobai.png'
    },
    {
      id: 2,
      title: '小花需要绝育',
      description: '小花最近发情严重',
      date: '2024-01-14',
      status: 'processing',
      statusText: '处理中',
      imageUrl: '/static/home/home_help_thumb_xiaohua.png'
    }
  ]
}

const catsPageData = {
  filters: [
    { label: '全部', value: 'all' },
    { label: '可领养', value: 'adoptable' },
    { label: '已绝育', value: 'neutered' },
    { label: '需关注', value: 'attention' },
    { label: '健康', value: 'healthy' }
  ],
  cats: [
    {
      id: 1,
      name: '小白',
      location: '图书馆附近',
      gender: 'female',
      genderIcon: '/static/cats-page/gender_female_badge.png',
      tags: [
        { label: '可领养', value: 'adoptable', type: 'adoptable' },
        { label: '已绝育', value: 'neutered', type: 'neutered' }
      ],
      image: '/static/cats-page/cat_xiaobai.jpg'
    },
    {
      id: 2,
      name: '小花',
      location: '食堂后门',
      gender: 'female',
      genderIcon: '/static/cats-page/gender_female_badge.png',
      tags: [
        { label: '需关注', value: 'attention', type: 'attention' },
        { label: '健康', value: 'healthy', type: 'healthy' }
      ],
      image: '/static/cats-page/cat_xiaohua.jpg'
    },
    {
      id: 3,
      name: '橘子',
      location: '宿舍楼下',
      gender: 'male',
      genderIcon: '/static/cats-page/gender_male_badge.png',
      tags: [
        { label: '可领养', value: 'adoptable', type: 'adoptable' },
        { label: '已绝育', value: 'neutered', type: 'neutered' }
      ],
      image: '/static/cats-page/cat_juzi.jpg'
    },
    {
      id: 4,
      name: '奶盖',
      location: '图书馆附近',
      gender: 'male',
      genderIcon: '/static/cats-page/gender_male_badge.png',
      tags: [
        { label: '需关注', value: 'attention', type: 'attention' },
        { label: '健康', value: 'healthy', type: 'healthy' }
      ],
      image: '/static/cats-page/cat_naigai.jpg'
    },
    {
      id: 5,
      name: '芝麻',
      location: '操场旁花丛',
      gender: 'male',
      genderIcon: '/static/cats-page/gender_male_badge.png',
      tags: [
        { label: '可领养', value: 'adoptable', type: 'adoptable' },
        { label: '已绝育', value: 'neutered', type: 'neutered' }
      ],
      image: '/static/cats-page/cat_zhima.jpg'
    },
    {
      id: 6,
      name: '阿福',
      location: '食堂后门',
      gender: 'male',
      genderIcon: '/static/cats-page/gender_male_badge.png',
      tags: [
        { label: '需关注', value: 'attention', type: 'attention' },
        { label: '健康', value: 'healthy', type: 'healthy' }
      ],
      image: '/static/cats-page/cat_afu.jpg'
    }
  ]
}

const catDetailData = {
  cat: {
    id: 1,
    name: '小白',
    image: '/static/cat-detail/white_cat_top_hero.jpg',
    gender: '妹妹',
    age: '约1岁',
    color: '白色',
    adoptableText: '可领养',
    introTags: ['妹妹', '约1岁', '白色'],
    details: [
      {
        key: 'personality',
        icon: '/static/cat-detail/icon_heart.png',
        label: '性格',
        value: '亲人、胆小'
      },
      {
        key: 'location',
        icon: '/static/cat-detail/icon_location_pin.png',
        label: '出没地点',
        value: '图书馆附近'
      },
      {
        key: 'health',
        icon: '/static/cat-detail/icon_health_cross.png',
        label: '健康情况',
        value: '腿部轻微受伤'
      },
      {
        key: 'neutered',
        icon: '/static/cat-detail/icon_care_status.png',
        label: '是否绝育',
        value: '未绝育'
      },
      {
        key: 'adoptable',
        icon: '/static/cat-detail/icon_paw.png',
        label: '能否领养',
        value: '可以领养',
        highlight: true
      },
      {
        key: 'remark',
        icon: '/static/cat-detail/icon_note_list.png',
        label: '备注',
        value: '常在傍晚出现'
      }
    ]
  },
  comments: [
    {
      id: 1,
      nickname: '小太阳',
      avatar: '/static/cat-detail/comment_avatar_xiaotaiyang.png',
      content: '昨天在图书馆门口也看到它了',
      time: '昨天 18:32'
    },
    {
      id: 2,
      nickname: '爱猫人士',
      avatar: '/static/cat-detail/comment_avatar_aimaorenshi.png',
      content: '已联系同学帮忙观察',
      time: '昨天 19:07'
    },
    {
      id: 3,
      nickname: '春日暖阳',
      avatar: '/static/cat-detail/comment_avatar_chunri_nuanyang.png',
      content: '它很亲人，可以靠近',
      time: '昨天 20:15'
    }
  ]
}

const helpPageData = {
  banners: [
    {
      id: 1,
      imageUrl: '/static/help-adoption/help_swiper_banner_01.png'
    }
  ],
  typeFilters: [
    { label: '全部', value: 'all' },
    { label: '求助', value: 'help' },
    { label: '领养', value: 'adoption' }
  ],
  statusFilters: [
    { label: '全部状态', value: 'all' },
    { label: '待处理', value: 'pending' },
    { label: '处理中', value: 'processing' },
    { label: '已完成', value: 'done' }
  ],
  posts: [
    {
      id: 1,
      type: 'help',
      typeText: '求助',
      title: '小白腿部受伤',
      description: '在图书馆附近发现小白腿部受伤，需要志愿者协助观察并联系处理。',
      location: '图书馆附近',
      publisher: '小太阳',
      date: '2024-01-15',
      status: 'pending',
      statusText: '待处理',
      image: '/static/help-adoption/help_thumb_xiaobai.png'
    },
    {
      id: 2,
      type: 'help',
      typeText: '求助',
      title: '小花需要绝育',
      description: '小花最近发情严重，希望安排绝育并做好术后照看。',
      location: '食堂后门',
      publisher: '爱猫人士',
      date: '2024-01-14',
      status: 'processing',
      statusText: '处理中',
      image: '/static/help-adoption/help_thumb_xiaohua.png'
    },
    {
      id: 3,
      type: 'adoption',
      typeText: '领养',
      title: '橘子等待领养',
      description: '橘子性格亲人，已完成基础观察，正在寻找稳定温暖的新家。',
      location: '宿舍楼下',
      publisher: '春日暖阳',
      date: '2024-01-13',
      status: 'done',
      statusText: '已完成',
      image: '/static/help-adoption/help_thumb_juzi.png'
    }
  ]
}

const helpDetailData = {
  post: {
    id: 1,
    title: '小白腿部受伤',
    type: 'help',
    typeText: '受伤救助',
    publishTime: '2024-01-15 14:20 发布',
    status: 'pending',
    statusText: '待处理',
    image: '/static/help-detail/help_detail_hero_photo.png',
    description: '在图书馆附近发现小白腿部受伤，走路不太稳定，希望志愿者帮忙查看。',
    location: '图书馆附近',
    contact: '138****1234',
    publisher: '小林',
    icon: '/static/help-detail/icon_cat_badge.png'
  },
  contactRows: [
    {
      key: 'location',
      icon: '/static/help-detail/icon_location.png',
      label: '地点',
      value: '图书馆附近'
    },
    {
      key: 'contact',
      icon: '/static/help-detail/icon_phone.png',
      label: '联系方式',
      value: '138****1234'
    },
    {
      key: 'publisher',
      icon: '/static/help-detail/icon_user.png',
      label: '发布人',
      value: '小林'
    }
  ],
  progress: [
    { label: '已提交', active: true },
    { label: '处理中', active: false },
    { label: '已完成', active: false }
  ],
  comments: [
    {
      id: 1,
      nickname: '喵星人守护者',
      role: '志愿者',
      avatar: '/static/help-detail/comment_avatar_guardian.png',
      content: '已经看到信息，下午去看看',
      time: '今天 10:30'
    },
    {
      id: 2,
      nickname: '爱心小橘',
      role: '志愿者',
      avatar: '/static/help-detail/comment_avatar_aixin.png',
      content: '它现在还在图书馆后面',
      time: '今天 11:05'
    },
    {
      id: 3,
      nickname: '暖心喵喵',
      role: '志愿者',
      avatar: '/static/help-detail/comment_avatar_warm.png',
      content: '需要猫包的话我可以提供',
      time: '今天 11:20'
    }
  ]
}

const publishHelpAdoptionData = {
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
  uploadPhotos: [
    {
      id: 1,
      image: '/static/publish/publish_upload_thumb_xiaohua.png'
    },
    {
      id: 2,
      image: '/static/publish/publish_upload_thumb_xiaobai.png'
    }
  ],
  assets: {
    back: '/static/publish/icon_back_arrow.png',
    arrowRight: '/static/publish/icon_arrow_right.png',
    plus: '/static/publish/icon_plus.png',
    close: '/static/publish/icon_close.png',
    shield: '/static/publish/icon_privacy_shield.png',
    uploadImage: '/static/publish/icon_upload_image.png'
  }
}

const minePageData = {
  user: {
    nickname: '爱猫同学',
    account: 'cat_user01',
    roleText: '普通用户',
    slogan: '一起守护校园小猫',
    avatar: '/static/mine/mine_default_user_avatar.png',
    postCount: 3,
    commentCount: 8
  },
  assets: {
    guestHeaderBg: '/static/mine/mine_guest_header_bg.png',
    guestMascot: '/static/mine/mine_guest_mascot_cat.png',
    profileCardBg: '/static/mine/mine_profile_card_bg.png',
    decorPaw: '/static/mine/decor_paw.png',
    arrowRight: '/static/mine/icon_arrow_right.png'
  },
  guestMenus: [
    {
      key: 'posts',
      title: '我的发布',
      icon: '/static/mine/icon_my_posts.png'
    },
    {
      key: 'comments',
      title: '我的评论',
      icon: '/static/mine/icon_my_comments.png'
    },
    {
      key: 'about',
      title: '关于平台',
      icon: '/static/mine/icon_about.png'
    }
  ],
  userMenus: [
    {
      key: 'posts',
      title: '我的发布',
      icon: '/static/mine/icon_my_posts.png'
    },
    {
      key: 'comments',
      title: '我的评论',
      icon: '/static/mine/icon_my_comments.png'
    },
    {
      key: 'logout',
      title: '退出登录',
      icon: '/static/mine/icon_logout.png'
    }
  ],
  tabs: [
    {
      key: 'home',
      text: '首页',
      icon: '/static/mine/tab_home_inactive.png',
      active: false
    },
    {
      key: 'catbook',
      text: '猫咪图鉴',
      icon: '/static/mine/tab_catbook_inactive.png',
      active: false
    },
    {
      key: 'help',
      text: '求助领养',
      icon: '/static/mine/tab_help_inactive.png',
      active: false
    },
    {
      key: 'mine',
      text: '我的',
      icon: '/static/mine/tab_mine_active.png',
      active: true
    }
  ]
}

const myPostsPageData = {
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
  ],
  posts: [
    {
      id: 1,
      title: '小白腿部受伤',
      type: 'help',
      typeText: '受伤救助',
      date: '2024-01-15',
      location: '图书馆附近',
      status: 'pending',
      statusText: '待处理',
      description: '在图书馆附近发现小白腿部受伤，无法正常行走，需要紧急救助。',
      image: '/static/mypost/mypost_thumb_xiaobai.png'
    },
    {
      id: 2,
      title: '橘子寻找领养人',
      type: 'adoption',
      typeText: '领养',
      date: '2024-01-10',
      location: '食堂后门',
      status: 'done',
      statusText: '已完成',
      description: '橘子性格温顺亲人，已绝育驱虫，希望能找到一个温暖的家。',
      image: '/static/mypost/mypost_thumb_juzi.png'
    },
    {
      id: 3,
      title: '小花需要绝育',
      type: 'neuter',
      typeText: '绝育求助',
      date: '2024-01-08',
      location: '校医院附近',
      status: 'processing',
      statusText: '处理中',
      description: '小花最近发情严重，想为它申请免费绝育名额，减轻它的痛苦。',
      image: '/static/mypost/mypost_thumb_xiaohua.png'
    },
    {
      id: 4,
      title: '两只小奶猫急需救助',
      type: 'help',
      typeText: '受伤救助',
      date: '2024-01-05',
      location: '体育馆门口',
      status: 'done',
      statusText: '已完成',
      description: '发现两只小奶猫被遗弃在纸箱里，身体虚弱，急需救助和照顾。',
      image: '/static/mypost/mypost_thumb_kittens.png'
    },
    {
      id: 5,
      title: '布偶猫寻找领养家庭',
      type: 'adoption',
      typeText: '领养',
      date: '2024-01-01',
      location: '宿舍楼下',
      status: 'done',
      statusText: '已完成',
      description: '布偶猫性格温柔黏人，因个人原因无法继续饲养，希望找个有爱的家庭。',
      image: '/static/mypost/mypost_thumb_buou.png'
    }
  ]
}

const myCommentsPageData = {
  assets: {
    back: '/static/mycomments/icon_back.png',
    time: '/static/mycomments/icon_time.png',
    arrowRight: '/static/mycomments/icon_arrow_right.png',
    tipBanner: '/static/mycomments/mycomments_tip_banner_01.png',
    decorPaw: '/static/mycomments/decor_paw.png'
  },
  comments: [
    {
      id: 1,
      content: '昨天在图书馆门口也看到它了',
      targetTitle: '小白腿部受伤',
      targetPrefix: '',
      targetIcon: '/static/mycomments/target_xiaobai.png',
      targetType: 'help_post',
      targetId: 1,
      time: '2024-01-15 18:32'
    },
    {
      id: 2,
      content: '小花最近经常在食堂后门出现',
      targetTitle: '小花档案',
      targetPrefix: '',
      targetIcon: '/static/mycomments/target_xiaohua.png',
      targetType: 'cat',
      targetId: 2,
      time: '2024-01-14 17:08'
    },
    {
      id: 3,
      content: '已转发到班级群，希望能帮到它！',
      targetTitle: '小花需要绝育',
      targetPrefix: '【求助】',
      targetIcon: '/static/mycomments/target_help.png',
      targetType: 'help_post',
      targetId: 2,
      time: '2024-01-13 15:21'
    },
    {
      id: 4,
      content: '有同学说在操场附近见过，已留言联系',
      targetTitle: '校园橘猫走失',
      targetPrefix: '【寻猫】',
      targetIcon: '/static/mycomments/target_lost.png',
      targetType: 'help_post',
      targetId: 3,
      time: '2024-01-12 10:45'
    },
    {
      id: 5,
      content: '辛苦志愿者啦，感谢你们的付出！',
      targetTitle: '志愿者招募·周末喂养',
      targetPrefix: '',
      targetIcon: '/static/mycomments/target_volunteer.png',
      targetType: 'help_post',
      targetId: 4,
      time: '2024-01-11 09:30'
    }
  ]
}

const authPageData = {
  assets: {
    loginBg: '/static/auth/auth_login_bg.png',
    registerBg: '/static/auth/auth_register_bg.png',
    loginMascot: '/static/auth/auth_login_mascot_cat.png',
    registerMascot: '/static/auth/auth_register_mascot_cat.png',
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

module.exports = {
  homeData,
  catsPageData,
  catDetailData,
  helpPageData,
  helpDetailData,
  publishHelpAdoptionData,
  minePageData,
  myPostsPageData,
  myCommentsPageData,
  authPageData
}
