const QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var amapFile = require('../../utils/amap-wx.js');
const WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexdata:[]
  },
  change: function (e) {
    var that = this;
    let json = e.currentTarget.dataset;
    let index = json.index;
    var token = wx.getStorageSync('token');
    var session_id = wx.getStorageSync('session_id');
    if (index == 1) {
      wx.reLaunch({
        url: '../index/index',
      })
    }
    if (index == 4) {
      wx.reLaunch({
        url: '../index4/index4',
      })
    }
    if (index == 3) {
      if (token && session_id) {
        wx.reLaunch({
          url: '../index3/index3',
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '请先注册成为会员，才能进行发布',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../register/register?type=zhuce',
              })
            } else {
              console.log('用户点击取消')
            }

          }
        })
      }
    }
    if (index == 5) {
      if (token && session_id) {
        wx.reLaunch({
          url: '../index5/index5',
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '请先注册成为会员，才能进行发布',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../register/register?type=zhuce',
              })
            } else {
              console.log('用户点击取消')
            }

          }
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    var session_id = wx.getStorageSync('session_id');
    var openid = wx.getStorageSync('openid');
    if (!openid) {
      wx.setStorageSync('shareindex4', 'shareindex4');
      wx.reLaunch({
        url: '../welcome/index',
      })
    }else{
      //赛程介绍
      wx.request({
        url: getApp().globalData.url + "Index/getConfigInfo",
        method: 'POST',
        data: {
          id: 2,
          token: token,
          session_id: session_id
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        // header: {
        //   'Content-Type': 'application/json'
        // },
        success: function (res) {
          console.log(res);
          if (res.data.info.content) WxParse.wxParse('content', 'html', res.data.info.content, that, 5);
          that.setData({
            scjs: res.data.info.content
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })
    }
    




  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {


  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

})
