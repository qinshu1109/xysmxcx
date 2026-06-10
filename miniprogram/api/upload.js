const { API_BASE_URL } = require('../utils/config')
const auth = require('../utils/auth')

function uploadFile(filePath) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${API_BASE_URL}/upload`,
      filePath,
      name: 'file',
      header: auth.getAuthHeader(),
      success(res) {
        let body = null
        try {
          body = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
        } catch (error) {
          wx.showToast({ title: '上传响应解析失败', icon: 'none' })
          reject(error)
          return
        }

        if (res.statusCode === 401 || body.code === 401) {
          auth.clearAuth()
          wx.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
          auth.requireLogin()
          reject(body)
          return
        }

        if (body.code === 0 && body.data && body.data.url) {
          resolve(body.data.url)
          return
        }

        wx.showToast({
          title: body.message || '上传失败',
          icon: 'none'
        })
        reject(body)
      },
      fail(error) {
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
        reject(error)
      }
    })
  })
}

module.exports = {
  uploadFile
}
