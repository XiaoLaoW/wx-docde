const app =getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        companyArray:[],
        Length:1,
        QueryToken:1,
        inputValue:"",
        count:0,
        timer:null,
        sn:'',
    },
    //扫码识别
    scanSn:function(){
        var that = this
    wx.scanCode({
      success: function (res) {
        var sn = res.result
        console.log(sn);
        that.setData({
            inputValue: sn,
            sn:sn
        })
        that.Query()
      }
    })
    },
    

    inputValue:function(e){
        this.setData({
            inputValue:e.detail.value
        })
    },
Query:function(){


    var userStorage = wx.getStorageSync('user')
    var Token = userStorage.token
    this.setData({
        QueryToken: Token
    })
    var str = this.data.inputValue;
    var count = this.data.count;
    if(str.length > 1 && count < 11){
        wx.request({
            url: app.host + app.url,
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              method: 'GET',
              url: '/printer_use/get_printer_bind',
              content: '[{"key":"token","value":"'+this.data.QueryToken+'"},{"key":"keyword","value":"'+this.data.inputValue+'"}]',
              token: app.api_token
            },
            success:  (res)=> {
                console.log(res.data.result,res.data.result.length);
                wx.setStorageSync('history',res.data.result )
                  this.setData({
                    Length:res.data.result.length,
                    companyArray:res.data.result,
                    count:this.data.count + 1,
                    
                  })
                }
     })
    
  } else if(count > 10){
      //限制1分钟内只能搜索10次
      wx.showModal({
        title: '稍等一下再搜索',
      })
  } else{
    wx.showModal({
        title: '请检查搜索条件',
      })
  }
    console.log(this.data.count);
},
toHistory:function(){
    wx.navigateTo({
      url: './History/index',
    })
},
onShow:function(){
    //页面显示时每1分钟重置一次count
    var timer = setInterval((e) => {
        this.setData({
            count:0
        })
        console.log('已重置');
    }, 60000);
    this.setData({
        timer:timer
    })
},
onHide:function(){
    clearInterval(this.data.timer)
    console.log('yincang');
}
})