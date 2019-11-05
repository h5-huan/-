const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //关闭模态框
  close_model: function () {
    this.setData({
      login_show: false
    })
  },
  getUserInfo: function (e) {
    let userInfo = e.detail.userInfo;
    console.log(userInfo);
    wx.login({
      success: res => {
        console.log(res.code);
        var logincode = res.code;
        if (userInfo) {
          wx.setStorageSync('userInfo', userInfo);
          wx.request({
            url: getApp().globalData.url + "login/getUserOpenId",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              code: logincode,
            },
            method: "POST",
            success: res => {
              console.log(res);
              var openid = res.data.info;//获取openid
              wx.setStorageSync('openid', openid);
              var shareindex4 = wx.getStorageSync('shareindex4');
              var sharedetail = wx.getStorageSync('sharedetail');
              if (shareindex4) {
                wx.reLaunch({
                  url: '../index4/index4',
                })
                wx.removeStorageSync('shareindex4');
              }else if (sharedetail){
                wx.reLaunch({
                  url: '../index/index?sharedetail=' + sharedetail,
                  success: function (e) {
                    var page = getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onLoad();
                  }
                })
                wx.removeStorageSync('sharedetail');
              }else{
                wx.reLaunch({
                  url: '../index/index',
                  success: function (e) {
                    var page = getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onLoad();
                  }
                })
              }
              
            }
          })
          
        } else {
          this.setData({
            login_show: true
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var userInfo = wx.getStorageSync('userInfo');
    // console.log(userInfo);
    // if (userInfo) {
    //   wx.login({
    //     success: res => {
    //       console.log(res.code);
    //       wx.request({
    //         url: getApp().globalData.url + "/client/common/login",
    //         header: { "Content-Type": "application/json" },
    //         data: {
    //           code: res.code,
    //           avatarUrl: userInfo.avatarUrl,
    //           nickName: userInfo.nickName,
    //           gender: userInfo.gender,
    //           country: userInfo.country,
    //           province: userInfo.province,
    //           city: userInfo.city,
    //           language: userInfo.language
    //         },
    //         method: "POST",
    //         success: res => {
    //           console.log(res.data);
    //           var setpersontoken = res.data.data.token;//获取token
    //           console.log(setpersontoken);
    //           wx.setStorageSync('setpersontoken', setpersontoken);
    //           wx.reLaunch({
    //             url: '../home/index',
    //           })
    //         },
    //         fail: res => {
    //           console.log(res);
    //         }
    //       })
    //     }
    //   })
      
    // }
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