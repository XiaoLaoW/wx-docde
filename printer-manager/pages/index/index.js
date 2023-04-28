//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    sn: null,
    way: ['购买装机', '安装试用'],
    way_index: 0,
    username: '未登录',
    is_login: false,
    compan_name: null,
    desc1: '',
    desc2: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
    var user = wx.getStorageSync('user')
    if(user != '') {
      that.setData({
        username: user['username'],
        is_login: true
      })
    }
  },

  logout: function() {
    wx.removeStorageSync('user')
    app.checkLogin()
  },

  login: function() {
    wx.navigateTo({
      url: '../login/index',
    })
  },

  onHistoryClick: function() {
    if (!app.checkLogin()) {
      return
    }
    wx.navigateTo({
      url: 'record/index',
    })
  },

  wayChange: function(e) {
    this.setData({
      way_index: e.detail.value
    })
  },
  
  /**
   * 领用打印机
   */
  getSnInput: function (e) {
    var that = this
    var sn = e.detail.value
    that.data.sn = sn
    this.setData({
      sn: sn
    })
  },

  scanSn: function() {
    var that = this
    wx.scanCode({
      success: function (res) {

        var sn = res.result
        that.setData({
          sn: sn
        })
      }
    })
  },

  getCompanyNameInput: function(e) {
    var that = this
    var compan_name = e.detail.value
    that.data.compan_name = compan_name
    this.setData({
      compan_name: compan_name
    })
  },

  getDesc1Input: function(e) {
    var that = this
    var desc1 = e.detail.value
    that.data.desc1 = desc1
    this.setData({
      desc1: desc1
    })
  },

  getDesc2Input: function (e) {
    var that = this
    var desc2 = e.detail.value
    that.data.desc2 = desc2
    this.setData({
      desc2: desc2
    })
  },

  addPrinter: function() {
    this.addPrinter1(0)
  },

  addPrinter1: function(force) {
    if (!app.checkLogin()) {
      return
    }
    var that = this
    var sn = that.data.sn
    if (sn == null || sn.length != 10) {
      wx.showModal({
        title: '编号错误',
      })
      return
    }
    let compan_name = that.data.compan_name
    if (compan_name == null) {
      wx.showModal({
        title: '请填写公司名',
      })
      return
    }
    var user = wx.getStorageSync('user')
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    wx.request({
      url: app.host + app.url,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        method: 'POST',
        url: '/printer_use/add',
        content: '[{"key":"sn","value":"' + sn + '"},{"key":"remark","value":"' + that.data.way[that.data.way_index] + '"},{"key":"token","value":"' + user['token'] + '"},{"key":"companyName","value":"' + encodeURIComponent(that.data.compan_name) + '"},{"key":"force","value":"' + force + '"},{"key":"desc1", "value":"' + that.data.desc1 +'"},{"key":"desc2", "value":"'+ that.data.desc2 +'"}]',
        token: app.api_token
      },
      success: function (res) {
        console.log(res)
        if(res.data.code != 0 && res.data.code != 200) {
          if (app.authCheck(res)) {
            if (res.data.message == '该打印机已被领用') {
              wx.showModal({
                title: '该打印机已登记，是否需要再次登记？',
                success(res) {
                  if (res.confirm) {
                    that.addPrinter1(1)
                  }
                }
              })
            } else {
              wx.showModal({
                title: res.data['message'],
              })
            }
          }
        } else {
          wx.showToast({
            title: '成功',
          })
          //清除输入栏
          that.setData({
            sn: null,
            way_index: 0,
            compan_name: null,
            desc1: '',
            desc2: ''
          })
        }
      },
      fail: function (e) {
        var result = e.data
        wx.showModal({
          title: result['message'],
        })
      },
      complete: function(e) {
        wx.hideLoading()
      }
    });
  }
})
