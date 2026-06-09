const { publishHelpAdoptionData } = require('../../utils/mockData')

Page({
  data: {
    title: '发布求助领养',
    banner: publishHelpAdoptionData.banner,
    typeOptions: publishHelpAdoptionData.typeOptions,
    form: publishHelpAdoptionData.form,
    uploadPhotos: publishHelpAdoptionData.uploadPhotos,
    assets: publishHelpAdoptionData.assets,
    titleCount: 0,
    descriptionCount: 0,
    state: 'ready',
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

    wx.switchTab({ url: '/pages/help/index' })
  },

  onSelectType(event) {
    const type = event.currentTarget.dataset.value || 'help'
    this.setData({
      'form.type': type
    })
  },

  onTitleInput(event) {
    const value = (event.detail.value || '').slice(0, 10)
    this.setData({
      'form.title': value,
      titleCount: value.length
    })
  },

  onDescriptionInput(event) {
    const value = (event.detail.value || '').slice(0, 200)
    this.setData({
      'form.description': value,
      descriptionCount: value.length
    })
  },

  onLocationInput(event) {
    this.setData({
      'form.location': event.detail.value || ''
    })
  },

  onContactInput(event) {
    this.setData({
      'form.contact': event.detail.value || ''
    })
  },

  onTapLocation() {
    wx.showToast({
      title: '地图选择后续接入',
      icon: 'none'
    })
  },

  onTapUpload() {
    wx.showToast({
      title: '上传功能后续接入',
      icon: 'none'
    })
  },

  onRemovePhoto(event) {
    const id = Number(event.currentTarget.dataset.id)
    const uploadPhotos = this.data.uploadPhotos.filter((item) => item.id !== id)
    this.setData({ uploadPhotos })
  },

  onSubmit() {
    const form = this.data.form
    if (!form.title.trim()) {
      wx.showToast({ title: '请填写标题', icon: 'none' })
      return
    }

    if (!form.description.trim()) {
      wx.showToast({ title: '请填写详细描述', icon: 'none' })
      return
    }

    if (!form.location.trim()) {
      wx.showToast({ title: '请填写发生地点', icon: 'none' })
      return
    }

    if (!form.contact.trim()) {
      wx.showToast({ title: '请填写联系方式', icon: 'none' })
      return
    }

    wx.showToast({
      title: '已提交发布',
      icon: 'none'
    })
  }
})
