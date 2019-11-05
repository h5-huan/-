const app = getApp();
const WxParse = require('../../utils/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    comscrren:false,
    content:''
  
  },
  //打开分类弹窗
  opentype: function () {
    this.setData({
      comscrren: true
    })
  },
  //关闭分类弹窗
  closecomtype: function () {
    this.setData({
      comscrren: false
    })
  },
  //返回首页,高手展示页
  //公司介绍
  goback: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    if (id==1){
      wx.reLaunch({
        url: '../index/index',
      })
    }
    if (id == 2) {
      wx.reLaunch({
        url: '../index4/index4',
      })
    }
    this.setData({
      comscrren: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var idx = options.idx;
    console.log(idx);
    if (idx==1){
      wx.setNavigationBarTitle({
        title: '公司介绍'
      })
    } else if(idx == 4){
      wx.setNavigationBarTitle({
        title: '地驰素'
      })
    } else if (idx == 5) {
      wx.setNavigationBarTitle({
        title: 'IPE水溶肥'
      })
    } else if (idx == 6) {
      wx.setNavigationBarTitle({
        title: '荷优禾保'
      })
    }
    
    wx.request({
      url: getApp().globalData.url + "Index/getConfigInfo",
      method: 'POST',
      data: {
        id: idx
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      // header: {
      //   'Content-Type': 'application/json'
      // },
      success: function (res) {
        console.log(res);
        if (res.data.info.content) WxParse.wxParse('msgs', 'html', res.data.info.content, that, 5);
        that.setData({
          content: res.data.info.content
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

})