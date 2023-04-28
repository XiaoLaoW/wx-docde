// pages/index/record/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:[],
    agency_list:[],
    name_index: 0,
    record_list:[],

    pageNum:1,
    total_page:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var user = wx.getStorageSync('user')
    wx.request({
      url: 'https://api-sonma.duoke.net' + app.url,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        method: 'GET',
        url: '/printer_use/agency_list',
        content: '[{"key":"token","value":"' + user['token'] + '"}]',
        token: app.api_token
      },
      success: function (res) {
        var result = res.data.result
        console.log(res)
        if (res.data.code != 0 && res.data.code != 200) {
          if (app.authCheck(res)) {
            wx.showModal({
              title: res.data['message'],
            })
          } else {
            wx.showModal({
              title: res.data['message'],
            })
          }
        } else {
          that.data.agency_list = result
          var index
          for (index in result) {
            that.data.name.push(result[index]['agencyName'])
          }
          that.setData({
            name: that.data.name
          })

          //如果是办事处管理员或者办事处成员，则直接显示领用记录
          if (user['roleId'] != 1) {
            that.record()
          }
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
 * 领用记录查询
 */
  record: function() {
    var that = this

    var user = wx.getStorageSync('user')

    wx.showLoading({
      title: '请稍等',
    })
    var content = '[{"key":"token","value":"' + user['token'] + '"},{"key":"pageNo","value":"' + that.data.pageNum + '"},{"key":"pageSize","value":"10"},{"key":"agency_id","value":"' + that.data.agency_list[that.data.name_index]['id']+'"}]'

    wx.request({
      url: 'https://api.sonma.net' + app.url,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        method: 'GET',
        url: '/printer_use/list',
        content: content,
        token: app.api_token
      },
      success: function (res) {
        var result = res.data.result
        console.log(res)
        if (res.data.code != 0 && res.data.code != 200) {
          wx.showModal({
            title: res.data['message'],
          })
        } else {
          var total_page = Math.ceil(result.total / result.pageSize)
          console.log('total_page->'+total_page)
          // var total_page = result.total / result.pageSize
          // var remain = result.total % result.pageSize
          // if(remain > 0) {
          //   total_page++
          // }
          that.setData({
            record_list: result.data,
            total_page: total_page
          })
          wx.showToast({
            title: '成功',
          })
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

  nameChange: function(e) {
    this.setData({
      name_index: e.detail.value
    })
  },

  previous: function(e) {
    var that = this

    if (that.data.record_list.length == 0) {
      wx.showModal({
        title: '没有记录',
        content: '',
      })
      return
    }

    if (that.data.pageNum == 1) {
      wx.showModal({
        title: '已经是第一页',
        content: '',
      })
      return
    }
    var pageNum = that.data.pageNum - 1
    that.setData({
      pageNum: pageNum
    })

    that.record()
  },

  next: function(e) {
    var that = this

    if (that.data.record_list.length == 0) {
      wx.showModal({
        title: '没有记录',
        content: '',
      })
      return
    }

    if (that.data.pageNum == that.data.total_page) {
      wx.showModal({
        title: '已经是第最后一页',
        content: '',
      })
      return
    }

    var pageNum = that.data.pageNum + 1
    that.setData({
      pageNum: pageNum
    })

    that.record()
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