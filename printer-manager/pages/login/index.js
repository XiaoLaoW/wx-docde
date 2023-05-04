// pages/login/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    acount: null,
    password: null
  },

  getAcountInput: function(e) {
    var that = this
    var acount = e.detail.value
    this.setData({
      acount: acount
    })
  },

  getPasswordInput: function(e) {
    var that = this
    var password = e.detail.value
    this.setData({
      password: password
    })
  },

/**
 * 登录
 */
  login: function() {
    var that = this
    var acount = that.data.acount
    var password = that.data.password
    if(acount == null) {
      wx.showModal({
        title: '请输入帐号',
      })
      return
    }
    if(password == null) {
      wx.showModal({
        title: '请输入密码',
      })
      return
    }
    wx.request({
      method: 'POST',
      url: 'https://api.sonma.net' + app.url,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        method: 'POST',
        url: '/session',
        content: '[{"key":"username","value":"'+acount+'"},{"key":"password","value":"'+password+'"}]',
        token: app.api_token
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code != 0 && res.data.code != 200) {
          wx.showModal({
            title: res.data['message'],
          })
        } else {
          wx.showToast({
            title: '登录成功',
          })

          wx.setStorageSync('user', res.data.result)

          //跳转到领用页面
          wx.reLaunch({
            url: '../index/index',
          })
          //将openId更新到服务器
        }
      },
      fail: function (e) {
        var result = e.data
        wx.showModal({
          title: result['message'],
        })
      }
    }
    );
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})