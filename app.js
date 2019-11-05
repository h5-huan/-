//app.js
const QQMapWX = require('utils/qqmap-wx-jssdk.js');
App({
  // onLaunch: function () {
  //   //展示本地存储能力
  //   var logs = wx.getStorageSync('logs') || []
  //   logs.unshift(Date.now())
  //   wx.setStorageSync('logs', logs)
  //  // 检查登陆状态
  //   wx.checkSession({
  //     success: function () {
  //       //session_key 未过期，并且在本生命周期一直有效
  //       // console.log("已登陆");
  //     },
  //     fail: function () {
  //       // session_key 已经失效，需要重新执行登录流程
  //       // 登录
  //       wx.login({
  //           success: res => {
  //               console.log(res.code);
  //               var logincode = res.code;
  //           }
  //       })
  //     }
  //   })
  // },
  toats:function(e){
    wx.showToast({
      title: e,
      icon: 'success',
      duration: 1500
    })
  },
  tip: function (title, cb) {
    wx.showToast({
      title,
      complete: res => {
        cb && cb()
      }
    })
  },
  globalData: {
    userInfo: null,
    code:null,
    token:'',
    session_id:'',
    url: "https://vote.south-power.cn/index.php/Api/",
  }
})