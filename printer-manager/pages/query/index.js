const app =getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        companyArray:[],
        Length:1,
        QueryToken:1,
        inputValue:"",
    },
    inputValue:function(e){
        this.setData({
            inputValue:e.detail.value
        })
},
Query:function(){
    var userStorage = wx.getStorageSync('user')
    var Token = userStorage.token
    this.setData({
        QueryToken: Token
    })
    var str = this.data.inputValue;
    if(str.length > 1){
        wx.request({
            url: app.host + app.url,
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              method: 'GET',
              url: '/printer_use/get_printer_bind',
              content: '[{"key":"token","value":"'+this.data.QueryToken+'"},{"key":"keyword","value":"'+this.data.inputValue+'"}]',
              token: app.api_token
            },
            success:  (res)=> {
                console.log(res.data.result);
                  this.setData({
                    companyArray:res.data.result,
                    Length:res.data.result.length
                  })
                }
     })

  } else {
      wx.showModal({
        title: '请检查搜索条件',
      })
  }console.log(this.data.companyArray,'chengg');
}
})