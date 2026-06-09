const { catsPageData } = require('../../utils/mockData')

Page({
  data: {
    title: '猫咪图鉴',
    keyword: '',
    filter: 'all',
    filters: catsPageData.filters,
    cats: catsPageData.cats,
    visibleCats: catsPageData.cats,
    page: 1,
    hasMore: false,
    status: 'ready',
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

  onTapFilter(event) {
    const value = event.currentTarget.dataset.value || 'all'
    if (value === this.data.filter) {
      return
    }

    this.setData({
      filter: value,
      page: 1
    })
    this.applyFilters()
  },

  applyFilters() {
    const keyword = this.data.keyword.trim()
    const filter = this.data.filter
    const visibleCats = this.data.cats.filter((cat) => {
      const matchedKeyword = !keyword || cat.name.indexOf(keyword) >= 0 || cat.location.indexOf(keyword) >= 0
      const matchedFilter = filter === 'all' || cat.tags.some((tag) => tag.value === filter)
      return matchedKeyword && matchedFilter
    })

    this.setData({
      visibleCats,
      status: visibleCats.length ? 'ready' : 'empty'
    })
  },

  onTapCat(event) {
    const id = event.currentTarget.dataset.id || 1
    wx.navigateTo({
      url: `/pages/cat-detail/index?id=${id}`
    })
  }
})
