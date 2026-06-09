const { helpDetailData } = require('../../utils/mockData')

Page({
  data: {
    title: '求助详情',
    post: helpDetailData.post,
    contactRows: helpDetailData.contactRows,
    progress: helpDetailData.progress,
    comments: helpDetailData.comments,
    commentText: '',
    status: 'ready',
    errorMessage: '',
    navHeight: 88,
    navContentTop: 44,
    menuHeight: 32
  },

  onLoad() {
    this.setLayoutMetrics()
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

  onTapBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }

    wx.redirectTo({
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

    const comments = [
      {
        id: Date.now(),
        nickname: '我',
        role: '志愿者',
        avatar: '/static/help-detail/comment_avatar_guardian.png',
        content,
        time: '刚刚'
      },
      ...this.data.comments
    ]

    this.setData({
      comments,
      commentText: ''
    })

    wx.showToast({
      title: '已发送',
      icon: 'none'
    })
  }
})
