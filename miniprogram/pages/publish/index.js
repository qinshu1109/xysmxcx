const { publishPage } = require('../../utils/pageAssets')
const { requireLogin } = require('../../utils/auth')
const { uploadFile } = require('../../api/upload')
const { createHelpPost } = require('../../api/helpPosts')

Page({
  data: {
    title: '发布求助领养',
    banner: publishPage.banner,
    typeOptions: publishPage.typeOptions,
    form: { ...publishPage.form },
    uploadPhotos: [],
    assets: publishPage.assets,
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
    requireLogin('/pages/publish/index')
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
      title: '请直接输入地点',
      icon: 'none'
    })
  },

  onTapUpload() {
    const remain = 3 - this.data.uploadPhotos.length
    if (remain <= 0) {
      wx.showToast({
        title: '最多上传 3 张',
        icon: 'none'
      })
      return
    }

    const onChoose = (paths) => {
      const current = this.data.uploadPhotos
      const added = paths.slice(0, remain).map((path) => ({
        id: `${Date.now()}-${Math.random()}`,
        image: path,
        filePath: path
      }))
      this.setData({
        uploadPhotos: current.concat(added)
      })
    }

    if (wx.chooseMedia) {
      wx.chooseMedia({
        count: remain,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        success(res) {
          onChoose((res.tempFiles || []).map((file) => file.tempFilePath))
        }
      })
      return
    }

    wx.chooseImage({
      count: remain,
      sourceType: ['album', 'camera'],
      success(res) {
        onChoose(res.tempFilePaths || [])
      }
    })
  },

  onRemovePhoto(event) {
    const id = event.currentTarget.dataset.id
    const uploadPhotos = this.data.uploadPhotos.filter((item) => item.id !== id)
    this.setData({ uploadPhotos })
  },

  onSubmit() {
    if (!requireLogin('/pages/publish/index')) {
      return
    }

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

    this.setData({ state: 'loading', errorMessage: '' })
    wx.showLoading({ title: '发布中', mask: true })
    Promise.all(this.data.uploadPhotos.map((photo) => uploadFile(photo.filePath)))
      .then((images) => createHelpPost({
        title: form.title.trim(),
        type: form.type,
        description: form.description.trim(),
        location: form.location.trim(),
        contactPhone: form.contact.trim(),
        images
      }))
      .then((created) => {
        wx.showToast({
          title: '发布成功',
          icon: 'none'
        })
        const id = created && created.id
        setTimeout(() => {
          if (id) {
            wx.redirectTo({ url: `/pages/help-detail/index?id=${id}` })
            return
          }
          wx.switchTab({ url: '/pages/help/index' })
        }, 300)
      })
      .catch((error) => {
        this.setData({
          state: 'ready',
          errorMessage: error && error.message ? error.message : '发布失败'
        })
      })
      .finally(() => {
        wx.hideLoading()
      })
  }
})
