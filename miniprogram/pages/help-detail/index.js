const { getHelpPostDetail } = require('../../api/helpPosts')
const { getComments, createComment } = require('../../api/comments')
const { requireLogin } = require('../../utils/auth')
const { adaptHelpPostDetail, adaptComment } = require('../../utils/adapters')

Page({
  data: {
    title: '求助详情',
    id: '',
    post: null,
    contactRows: [],
    progress: [],
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
      this.setData({ status: 'error', errorMessage: '缺少求助领养 ID' })
      return
    }

    this.setData({ status: 'loading', errorMessage: '' })
    Promise.all([
      getHelpPostDetail(id),
      getComments({ targetType: 'help_post', targetId: id, page: 1, pageSize: 20 })
    ])
      .then(([postData, comments]) => {
        const detail = adaptHelpPostDetail(postData)
        this.setData({
          post: detail.post,
          contactRows: detail.contactRows,
          progress: detail.progress,
          comments: (comments.items || []).map(adaptComment),
          status: 'ready'
        })
      })
      .catch((error) => {
        this.setData({
          status: 'error',
          errorMessage: error && error.message ? error.message : '求助详情加载失败'
        })
      })
  },

  onTapBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }

    wx.switchTab({
      url: '/pages/help/index'
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

    if (!requireLogin(`/pages/help-detail/index?id=${this.data.id}`)) {
      return
    }

    createComment({
      targetType: 'help_post',
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
