const { myCommentsPage } = require('../../utils/pageAssets')
const { requireLogin } = require('../../utils/auth')
const { deleteMyComment, getMyComments } = require('../../api/me')
const { adaptMyComment } = require('../../utils/adapters')

Page({
  data: {
    title: '我的评论',
    assets: myCommentsPage.assets,
    comments: [],
    state: 'loading',
    errorMessage: '',
    navHeight: 88,
    navContentTop: 44,
    menuHeight: 32
  },

  onLoad() {
    this.setLayoutMetrics()
    if (requireLogin('/pages/my-comments/index')) {
      this.loadComments()
    }
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

  loadComments() {
    this.setData({ state: 'loading', errorMessage: '' })
    getMyComments({ page: 1, pageSize: 50 })
      .then((data) => {
        const comments = (data.items || []).map(adaptMyComment)
        this.setData({
          comments,
          state: comments.length ? 'ready' : 'empty'
        })
      })
      .catch((error) => {
        this.setData({
          comments: [],
          state: 'error',
          errorMessage: error && error.message ? error.message : '我的评论加载失败'
        })
      })
  },

  onTapBack() {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      wx.navigateBack()
      return
    }

    wx.switchTab({ url: '/pages/mine/index' })
  },

  onTapDetail(event) {
    const item = this.data.comments.find((comment) => comment.id === Number(event.currentTarget.dataset.id))
    if (!item) {
      return
    }

    if (item.targetType === 'cat') {
      wx.navigateTo({
        url: `/pages/cat-detail/index?id=${item.targetId}`
      })
      return
    }

    wx.navigateTo({
      url: `/pages/help-detail/index?id=${item.targetId}`
    })
  },

  onTapDelete(event) {
    const id = Number(event.currentTarget.dataset.id)
    if (!id) {
      return
    }

    wx.showModal({
      title: '删除评论',
      content: '确认删除这条评论吗？',
      confirmText: '删除',
      confirmColor: '#ff5f68',
      success: (res) => {
        if (!res.confirm) {
          return
        }

        wx.showLoading({
          title: '删除中',
          mask: true
        })
        deleteMyComment(id)
          .then(() => {
            wx.showToast({
              title: '已删除',
              icon: 'none'
            })
            this.loadComments()
          })
          .catch((error) => {
            wx.showToast({
              title: error && error.message ? error.message : '删除失败',
              icon: 'none'
            })
          })
          .finally(() => {
            wx.hideLoading()
          })
      }
    })
  }
})
