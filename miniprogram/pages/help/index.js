const { helpPageData } = require('../../utils/mockData')

Page({
  data: {
    title: '求助领养',
    keyword: '',
    type: 'all',
    statusFilter: 'all',
    banners: helpPageData.banners,
    typeFilters: helpPageData.typeFilters,
    statusFilters: helpPageData.statusFilters,
    posts: helpPageData.posts,
    visiblePosts: helpPageData.posts,
    page: 1,
    hasMore: false,
    state: 'ready',
    errorMessage: '',
    navHeight: 88,
    navContentTop: 44,
    menuHeight: 32
  },

  onLoad() {
    this.setLayoutMetrics()
    this.applyFilters()
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
      keyword: event.detail.value || ''
    })
    this.applyFilters()
  },

  onTapType(event) {
    const type = event.currentTarget.dataset.value || 'all'
    if (type === this.data.type) {
      return
    }

    this.setData({ type, page: 1 })
    this.applyFilters()
  },

  onTapStatus(event) {
    const statusFilter = event.currentTarget.dataset.value || 'all'
    if (statusFilter === this.data.statusFilter) {
      return
    }

    this.setData({ statusFilter, page: 1 })
    this.applyFilters()
  },

  applyFilters() {
    const keyword = this.data.keyword.trim()
    const type = this.data.type
    const statusFilter = this.data.statusFilter
    const visiblePosts = this.data.posts.filter((post) => {
      const matchedKeyword = !keyword || post.title.indexOf(keyword) >= 0 || post.location.indexOf(keyword) >= 0
      const matchedType = type === 'all' || post.type === type
      const matchedStatus = statusFilter === 'all' || post.status === statusFilter
      return matchedKeyword && matchedType && matchedStatus
    })

    this.setData({
      visiblePosts,
      state: visiblePosts.length ? 'ready' : 'empty'
    })
  },

  onTapBanner() {
    wx.navigateTo({
      url: '/pages/publish/index'
    })
  },

  onTapPost(event) {
    const id = event.currentTarget.dataset.id || 1
    wx.navigateTo({
      url: `/pages/help-detail/index?id=${id}`
    })
  }
})
