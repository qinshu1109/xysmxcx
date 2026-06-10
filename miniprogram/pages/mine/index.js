const { minePage } = require('../../utils/pageAssets')
const { getToken, getUser, isLoggedIn, setAuth, clearAuth, requireLogin } = require('../../utils/auth')
const { getMyHelpPosts, getMyProfile, getMyComments } = require('../../api/me')
const { adaptUser } = require('../../utils/adapters')

const ADMIN_WEB_URL = 'http://localhost:5173'

function buildDisplayUser(user, counts) {
  const displayUser = adaptUser(user, counts)
  const role = user && user.role === 'admin' ? 'admin' : 'user'
  return {
    ...displayUser,
    role,
    roleText: role === 'admin' ? '管理员' : '普通用户'
  }
}

function buildUserMenus(user) {
  const menus = [...minePage.userMenus]
  if (user && user.role === 'admin') {
    const logoutIndex = menus.findIndex((item) => item.key === 'logout')
    const adminMenu = { key: 'admin', title: '管理员后台', icon: '/static/mine/icon_about.png' }
    if (logoutIndex >= 0) {
      menus.splice(logoutIndex, 0, adminMenu)
    } else {
      menus.push(adminMenu)
    }
  }
  return menus
}

Page({
  data: {
    title: '我的',
    isLoggedIn: false,
    user: minePage.user,
    assets: minePage.assets,
    guestMenus: minePage.guestMenus,
    userMenus: minePage.userMenus,
    state: 'ready',
    errorMessage: '',
    navHeight: 88,
    navContentTop: 44,
    menuHeight: 32
  },

  onLoad() {
    this.setLayoutMetrics()
    this.syncLoginState()
  },

  onShow() {
    this.syncLoginState()
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

  syncLoginState() {
    const loggedIn = isLoggedIn()
    if (!loggedIn) {
      this.setData({
        isLoggedIn: false,
        user: minePage.user,
        userMenus: minePage.userMenus,
        state: 'ready',
        errorMessage: ''
      })
      return
    }

    const cachedUser = getUser()
    this.setData({
      isLoggedIn: true,
      user: buildDisplayUser(cachedUser, {
        postCount: this.data.user.postCount,
        commentCount: this.data.user.commentCount
      }),
      userMenus: buildUserMenus(cachedUser),
      state: 'loading',
      errorMessage: ''
    })

    Promise.all([
      getMyProfile(),
      getMyHelpPosts({ page: 1, pageSize: 1 }),
      getMyComments({ page: 1, pageSize: 1 })
    ])
      .then(([profile, posts, comments]) => {
        const latestUser = {
          ...(cachedUser || {}),
          ...(profile || {})
        }
        setAuth(getToken(), latestUser)
        this.setData({
          user: buildDisplayUser(latestUser, {
            postCount: posts.total || 0,
            commentCount: comments.total || 0
          }),
          userMenus: buildUserMenus(latestUser),
          state: 'ready'
        })
      })
      .catch((error) => {
        this.setData({
          user: buildDisplayUser(cachedUser),
          userMenus: buildUserMenus(cachedUser),
          state: 'error',
          errorMessage: error && error.message ? error.message : '个人数据加载失败'
        })
      })
  },

  onTapLogin() {
    wx.navigateTo({ url: '/pages/login/index?redirect=%2Fpages%2Fmine%2Findex' })
  },

  onTapMenu(event) {
    const key = event.currentTarget.dataset.key
    if (key === 'logout') {
      clearAuth()
      this.setData({
        isLoggedIn: false,
        user: minePage.user,
        userMenus: minePage.userMenus,
        state: 'ready',
        errorMessage: ''
      })
      wx.showToast({
        title: '已退出登录',
        icon: 'none'
      })
      return
    }

    if (!this.data.isLoggedIn && (key === 'posts' || key === 'comments')) {
      requireLogin(key === 'posts' ? '/pages/my-posts/index' : '/pages/my-comments/index')
      return
    }

    if (key === 'admin') {
      wx.showModal({
        title: '管理员后台',
        content: `请在浏览器打开后台管理系统：${ADMIN_WEB_URL}`,
        confirmText: '复制地址',
        success(res) {
          if (res.confirm) {
            wx.setClipboardData({
              data: ADMIN_WEB_URL
            })
          }
        }
      })
      return
    }

    if (key === 'about') {
      wx.showToast({
        title: '校园拾喵驿站',
        icon: 'none'
      })
      return
    }

    if (key === 'posts') {
      wx.navigateTo({ url: '/pages/my-posts/index' })
      return
    }

    if (key === 'comments') {
      wx.navigateTo({ url: '/pages/my-comments/index' })
      return
    }
  }
})
