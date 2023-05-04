
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
        timer:null,
        sn:'',
        historyArray:[],
        iconType: [
            'success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'
          ],
        delete:false
    },
    //扫码识别
    scanSn:function(){
        var that = this
    wx.scanCode({
      success: function (res) {
        var sn = res.result
        that.setData({
            inputValue: sn,
            sn:sn
        })
        that.Query()
      }
    })
    },
    

    inputValue:function(e){
        var that = this ;
            that.setData({
                inputValue:e.detail.value,
                delete:true,
            })
        var currentValue = e.detail.value;
        if (!currentValue) {
            that.setData({
                delete:false
            })
        }
    },
    clearInputValue:function(){
        this.setData({
            delete:false,
            sn:''
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
    if(str.length > 1 && userStorage){
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
                var array = res.data.result;
                var hisArray = [];
                var hArray = this.data.historyArray;
                for(let i = 0 ; i < array.length ; i++ ){
                    var n = array[i];
                    hArray.push(n)
                }
                this.setData({
                    hArray:hisArray
                })
                //限制history数据不超过20条
                if(hArray.length >20 ){
                    var that = this
                    var oldArray = that.data.historyArray;
                    var num = oldArray.length - 20;
                    var newArray = oldArray.splice(num);
                    that.setData({
                        historyArray:newArray
                    })
                    console.log('数组length超过20');
                }
                wx.setStorageSync('history', this.data.historyArray)
                  this.setData({
                    Length:res.data.result.length,
                    companyArray:res.data.result,
                    count:this.data.count + 1,
                  })
                }
     })
  }  else if(!userStorage){
    wx.showModal({
        title: '请登录账号',
        success(res){
            wx.navigateTo({
                url: '../login/index',
              })
        }
      })
  }
  else{
    wx.showModal({
        title: '请检查搜索条件',
      })
  }
},
toHistory:function(){
    wx.navigateTo({
      url: './History/index',
    })
},
onShow:function(){
    //页面显示时每1分钟重置一次count
   
},
onHide:function(){
   
}
})