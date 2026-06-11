const { getCatDetail } = require('../../api/cats')
const { getComments, createComment } = require('../../api/comments')
const { requireLogin } = require('../../utils/auth')
const { adaptCatDetail, adaptComment } = require('../../utils/adapters')

Page({
  data: {
    title: '猫咪详情',
    id: '',
    cat: null,
    comments: [],
    commentText: '',
    status: 'loading',
    errorMessage: '',
    navHeight: 88,
    navContentTop: 44,
    menuHeight: 32
  },

  onLoad(options) {
    this.setLayoutMetrics()
    this.setData({
      id: options && options.id ? options.id : ''
    })
    this.loadDetail()
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

  loadDetail() {
    const id = this.data.id
    if (!id) {
      this.setData({ status: 'error', errorMessage: '缺少猫咪 ID' })
      return
    }

    this.setData({ status: 'loading', errorMessage: '' })
    Promise.all([
      getCatDetail(id),
      getComments({ targetType: 'cat', targetId: id, page: 1, pageSize: 20 })
    ])
      .then(([cat, comments]) => {
        this.setData({
          cat: adaptCatDetail(cat),
          comments: (comments.items || []).map(adaptComment),
          status: 'ready'
        })
      })
      .catch((error) => {
        this.setData({
          status: 'error',
          errorMessage: error && error.message ? error.message : '猫咪详情加载失败'
        })
      })
  },

  onTapBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }

    wx.switchTab({
      url: '/pages/cats/index'
    })
  },

  onCommentInput(event) {
    this.setData({
      commentText: event.detail.value || ''
    })
  },

  onSendComment() {
    const content = this.data.commentText.trim()
    if (!content) {
      wx.showToast({
        title: '先写点什么吧',
        icon: 'none'
      })
      return
    }

    if (!requireLogin(`/pages/cat-detail/index?id=${this.data.id}`)) {
      return
    }

    createComment({
      targetType: 'cat',
      targetId: Number(this.data.id),
      content
    })
      .then(() => {
        this.setData({ commentText: '' })
        wx.showToast({
          title: '已发送',
          icon: 'none'
        })
        this.loadDetail()
      })
      .catch(() => {})
  }
})
