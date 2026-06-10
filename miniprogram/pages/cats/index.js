const { catsPage } = require('../../utils/pageAssets')
const { getCats } = require('../../api/cats')
const { adaptCat } = require('../../utils/adapters')

Page({
  data: {
    title: '猫咪图鉴',
    keyword: '',
    filter: 'all',
    filters: catsPage.filters,
    cats: [],
    visibleCats: [],
    page: 1,
    pageSize: 20,
    hasMore: false,
    status: 'loading',
    errorMessage: '',
    navHeight: 88,
    navContentTop: 44,
    menuHeight: 32
  },

  onLoad() {
    this.setLayoutMetrics()
  },

  onShow() {
    this.loadCats()
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
    this.loadCats()
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
    this.loadCats()
  },

  loadCats() {
    const filter = this.data.filter
    this.setData({ status: 'loading', errorMessage: '' })
    getCats({
      keyword: this.data.keyword.trim(),
      filter: filter === 'all' ? '' : filter,
      page: this.data.page,
      pageSize: this.data.pageSize
    })
      .then((data) => {
        const items = (data.items || []).map(adaptCat)
        this.setData({
          cats: items,
          visibleCats: items,
          hasMore: data.page * data.pageSize < data.total,
          status: items.length ? 'ready' : 'empty'
        })
      })
      .catch((error) => {
        this.setData({
          cats: [],
          visibleCats: [],
          hasMore: false,
          status: 'error',
          errorMessage: error && error.message ? error.message : '猫咪列表加载失败'
        })
      })
  },

  onTapCat(event) {
    const id = event.currentTarget.dataset.id
    if (!id) {
      return
    }
    wx.navigateTo({
      url: `/pages/cat-detail/index?id=${id}`
    })
  }
})
