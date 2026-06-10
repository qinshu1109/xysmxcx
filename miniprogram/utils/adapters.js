const { normalizeImageUrl } = require('./image')

const defaultAvatar = '/static/mine/mine_default_user_avatar.png'
const defaultHelpImage = '/static/help-adoption/help_thumb_xiaobai.png'
const defaultCatImage = '/static/cats-page/cat_xiaobai.jpg'

function formatDate(value, withTime) {
  if (!value) {
    return ''
  }
  const text = String(value).replace('T', ' ')
  return withTime ? text.slice(0, 16) : text.slice(0, 10)
}

function genderText(value) {
  const map = {
    male: '公',
    female: '母',
    unknown: '未知'
  }
  return map[value] || '未知'
}

function helpTypeText(value) {
  const map = {
    help: '求助',
    adoption: '领养',
    feeding: '喂养',
    neuter: '绝育',
    injury: '受伤救助',
    other: '其他'
  }
  return map[value] || '其他'
}

function statusText(value) {
  const map = {
    pending: '待处理',
    processing: '处理中',
    done: '已完成'
  }
  return map[value] || '待处理'
}

function boolText(value, yes, no) {
  return value ? yes : no
}

function firstImage(item, fallback) {
  if (Array.isArray(item.images) && item.images.length) {
    return normalizeImageUrl(item.images[0])
  }
  return normalizeImageUrl(item.imageUrl || item.image_url || item.image || fallback || '')
}

function adaptHome(data) {
  const configs = data.configs || {}
  return {
    platformName: configs.platform_name || '校园拾喵驿站',
    homeSlogan: configs.home_slogan || '',
    homeSubtitle: configs.home_subtitle || '',
    banners: (data.banners || []).map((item) => ({
      ...item,
      imageUrl: normalizeImageUrl(item.imageUrl || item.image_url)
    })),
    stats: data.stats || {
      catCount: 0,
      helpPostCount: 0,
      adoptionSuccessCount: 0
    },
    latestHelpPosts: (data.latestHelpPosts || []).map(adaptHelpPost),
    recommendedCats: (data.recommendedCats || []).map(adaptCat)
  }
}

function adaptCat(item) {
  const tags = []
  if (item.isAdoptable || item.is_adoptable) {
    tags.push({ label: '可领养', value: 'adoptable', type: 'adoptable' })
  }
  if (item.isNeutered || item.is_neutered) {
    tags.push({ label: '已绝育', value: 'neutered', type: 'neutered' })
  }
  if (item.needsAttention || item.needs_attention) {
    tags.push({ label: '需关注', value: 'attention', type: 'attention' })
  }
  if (!tags.length && String(item.healthStatus || item.health_status || '').indexOf('健康') >= 0) {
    tags.push({ label: '健康', value: 'healthy', type: 'healthy' })
  }

  return {
    ...item,
    id: item.id,
    name: item.name || '',
    location: item.location || '',
    gender: item.gender || 'unknown',
    genderText: genderText(item.gender),
    genderIcon: item.gender === 'female' ? '/static/cats-page/gender_female_badge.png' : '/static/cats-page/gender_male_badge.png',
    tags,
    image: firstImage(item, defaultCatImage),
    imageUrl: firstImage(item, defaultCatImage),
    healthStatus: item.healthStatus || item.health_status || '',
    isNeutered: Boolean(item.isNeutered || item.is_neutered),
    isAdoptable: Boolean(item.isAdoptable || item.is_adoptable),
    needsAttention: Boolean(item.needsAttention || item.needs_attention)
  }
}

function adaptCatDetail(item) {
  const cat = adaptCat(item || {})
  return {
    ...cat,
    image: cat.image,
    adoptableText: boolText(cat.isAdoptable, '可领养', '暂不可领养'),
    introTags: [genderText(cat.gender), cat.age || '年龄未知', cat.color || '毛色未知'],
    details: [
      {
        key: 'personality',
        icon: '/static/cat-detail/icon_heart.png',
        label: '性格',
        value: cat.personality || '暂无记录'
      },
      {
        key: 'location',
        icon: '/static/cat-detail/icon_location_pin.png',
        label: '出没地点',
        value: cat.location || '暂无记录'
      },
      {
        key: 'health',
        icon: '/static/cat-detail/icon_health_cross.png',
        label: '健康情况',
        value: cat.healthStatus || '暂无记录'
      },
      {
        key: 'neutered',
        icon: '/static/cat-detail/icon_care_status.png',
        label: '是否绝育',
        value: boolText(cat.isNeutered, '已绝育', '未绝育')
      },
      {
        key: 'adoptable',
        icon: '/static/cat-detail/icon_paw.png',
        label: '能否领养',
        value: boolText(cat.isAdoptable, '可以领养', '暂不可领养'),
        highlight: true
      },
      {
        key: 'remark',
        icon: '/static/cat-detail/icon_note_list.png',
        label: '备注',
        value: cat.remark || '暂无备注'
      }
    ]
  }
}

function adaptHelpPost(item) {
  return {
    ...item,
    id: item.id,
    type: item.type || 'help',
    typeText: helpTypeText(item.type),
    title: item.title || '',
    description: item.description || '',
    location: item.location || '',
    publisher: item.userNickname || item.publisher || '同学',
    date: formatDate(item.createdAt || item.created_at || item.date),
    status: item.status || 'pending',
    statusText: statusText(item.status || 'pending'),
    image: firstImage(item, defaultHelpImage),
    imageUrl: firstImage(item, defaultHelpImage)
  }
}

function adaptHelpPostDetail(item) {
  const post = adaptHelpPost(item || {})
  post.publishTime = `${formatDate(item.createdAt || item.created_at, true)} 发布`
  post.contact = item.contactPhoneMasked || item.contact || ''
  post.icon = '/static/help-detail/icon_cat_badge.png'

  return {
    post,
    contactRows: [
      {
        key: 'location',
        icon: '/static/help-detail/icon_location.png',
        label: '地点',
        value: post.location || '暂无记录'
      },
      {
        key: 'contact',
        icon: '/static/help-detail/icon_phone.png',
        label: '联系方式',
        value: post.contact || '暂无记录'
      },
      {
        key: 'publisher',
        icon: '/static/help-detail/icon_user.png',
        label: '发布人',
        value: post.publisher || '同学'
      }
    ],
    progress: buildProgress(post.status)
  }
}

function buildProgress(status) {
  const order = ['pending', 'processing', 'done']
  const activeIndex = Math.max(order.indexOf(status), 0)
  return [
    { label: '已提交', active: activeIndex >= 0 },
    { label: '处理中', active: activeIndex >= 1 },
    { label: '已完成', active: activeIndex >= 2 }
  ]
}

function adaptComment(item) {
  return {
    ...item,
    id: item.id,
    nickname: item.userNickname || item.nickname || '同学',
    role: item.role || '同学',
    avatar: normalizeImageUrl(item.userAvatar || item.avatar || defaultAvatar),
    content: item.content || '',
    time: formatDate(item.createdAt || item.created_at || item.time, true),
    targetType: item.targetType || item.target_type,
    targetId: item.targetId || item.target_id
  }
}

function adaptMyComment(item) {
  const comment = adaptComment(item)
  const isCat = comment.targetType === 'cat'
  return {
    ...comment,
    targetTitle: item.targetTitle || '详情',
    targetPrefix: '',
    targetIcon: isCat ? '/static/mycomments/target_xiaohua.png' : '/static/mycomments/target_help.png'
  }
}

function adaptUser(user, extra) {
  const counts = extra || {}
  return {
    nickname: user && user.nickname ? user.nickname : '爱猫同学',
    account: user && user.username ? user.username : '',
    roleText: '普通用户',
    slogan: '一起守护校园小猫',
    avatar: normalizeImageUrl(user && user.avatar ? user.avatar : defaultAvatar),
    postCount: counts.postCount || 0,
    commentCount: counts.commentCount || 0
  }
}

module.exports = {
  adaptHome,
  adaptCat,
  adaptCatDetail,
  adaptHelpPost,
  adaptHelpPostDetail,
  adaptComment,
  adaptMyComment,
  adaptUser,
  genderText,
  helpTypeText,
  statusText
}
