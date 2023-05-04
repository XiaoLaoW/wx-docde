//app.js
App({
  user: null,
  host: 'https://api-sonma.duoke.net',
  url: '/delivery/manager_transport',
  api_token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIzNDAwODMiLCJzY29wZSI6WyIqIl0sImlzcyI6ImFwaS5zb25tYS5uZXQiLCJleHAiOjE3OTI0NjY0OTJ9.UIvXNzyAPJmA6srrhxHFZXC0L8KhuNB-zIdtBTNlo3U',
  onLaunch: function () {
    const app = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
          console.log(res.code);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {

          //登陆
          wx.request({
            method: 'POST',
            url: this.host + '/delivery/manager_transport',
            data: {
              method: 'POST',
              url: '/session/weixin',
              content: '[{"key":"code","value":"' + res.code +'"}]',
              token: this.api_token
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: res => {
              console.log(res.data)
              //登陆成功
              if (res.statusCode == 200) {

                wx.setStorageSync('user', res.data.result)

                wx.showToast({
                  title: '登陆成功'
                })
                //跳转到领用页面
          wx.navigateTo({
            url: './pages/index/index.wxml',
          })
              }
            },
            fail: res => {
              console.log(res)
            }
          })
        } else {
          wx.showModal({
            title: '登陆失败',
            content: res.errMsg,
            showCancel: false
          })
        }
      }
    })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  
  checkLogin: function() {
    var user = wx.getStorageSync('user')
    if (user == '') {
      //跳转到登录页面
      wx.reLaunch({
        url: '/pages/login/index',
      })
      return false
    }
    return true
  },

  authCheck: function(res) {
    if(res.data.message == 'auth fail') {
      wx.navigateTo({
        url: '/pages/login/index',
      })
      return false
    }
    return true
  }
})