const { helpPage } = require('../../utils/pageAssets')
const { getHelpPosts } = require('../../api/helpPosts')
const { adaptHelpPost } = require('../../utils/adapters')
const { requireLogin } = require('../../utils/auth')

Page({
  data: {
    title: '求助领养',
    keyword: '',
    type: 'all',
    statusFilter: 'all',
    banners: helpPage.banners,
    typeFilters: helpPage.typeFilters,
    statusFilters: helpPage.statusFilters,
    posts: [],
    visiblePosts: [],
    page: 1,
    pageSize: 20,
    hasMore: false,
    state: 'loading',
    errorMessage: '',
    navHeight: 88,
    navContentTop: 44,
    menuHeight: 32
  },

  onLoad() {
    this.setLayoutMetrics()
  },

  onShow() {
    this.loadPosts()
  },

  setLayoutMetrics() {
    const win = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    const menu = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null
    const statusBarHeight = win.statusBarHeight || 20
    const menuTop = menu && menu.top ? menu.top : statusBarHeight + 8
    const menuHeight = menu && menu.height ? menu.height : 32
    const gap = Math.max(menuTop - statusBarHeight, 6)

    this.setData({
      navContentTop: statusBarHeight + gap,
      menuHeight,
      navHeight: statusBarHeight + gap + menuHeight + gap
    })
  },

  onKeywordInput(event) {
    this.setData({
      keyword: event.detail.value || '',
      page: 1
    })
    this.loadPosts()
  },

  onTapType(event) {
    const type = event.currentTarget.dataset.value || 'all'
    if (type === this.data.type) {
      return
    }

    this.setData({ type, page: 1 })
    this.loadPosts()
  },

  onTapStatus(event) {
    const statusFilter = event.currentTarget.dataset.value || 'all'
    if (statusFilter === this.data.statusFilter) {
      return
    }

    this.setData({ statusFilter, page: 1 })
    this.loadPosts()
  },

  loadPosts() {
    this.setData({ state: 'loading', errorMessage: '' })
    getHelpPosts({
      keyword: this.data.keyword.trim(),
      type: this.data.type === 'all' ? '' : this.data.type,
      status: this.data.statusFilter === 'all' ? '' : this.data.statusFilter,
      page: this.data.page,
      pageSize: this.data.pageSize
    })
      .then((data) => {
        const posts = (data.items || []).map(adaptHelpPost)
        this.setData({
          posts,
          visiblePosts: posts,
          hasMore: data.page * data.pageSize < data.total,
          state: posts.length ? 'ready' : 'empty'
        })
      })
      .catch((error) => {
        this.setData({
          posts: [],
          visiblePosts: [],
          hasMore: false,
          state: 'error',
          errorMessage: error && error.message ? error.message : '求助领养列表加载失败'
        })
      })
  },

  onTapBanner() {
    if (requireLogin('/pages/publish/index')) {
      wx.navigateTo({
        url: '/pages/publish/index'
      })
    }
  },

  onTapPost(event) {
    const id = event.currentTarget.dataset.id
    if (!id) {
      return
    }
    wx.navigateTo({
      url: `/pages/help-detail/index?id=${id}`
    })
  }
})
