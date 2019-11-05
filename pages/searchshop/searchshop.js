const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
     inputcontent:'',
     indexdata:[],
     pageindex:1,
     shopnone: false,
    imgurl: "https://vote.south-power.cn",


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var token = wx.getStorageSync('token');
    var session_id = wx.getStorageSync('session_id');
    that.setData({
      token: token,
      session_id: session_id
    })
  },
  // 监听输入
  sousuoinput: function (event) {
    this.setData({
      inputcontent: event.detail.value,
    })
  },
// 搜索按钮
  ssbtn:function(){
    var that=this;
    var test = that.data.inputcontent;
    if (test){
      that.setData({
        pageindex:1
      })
      wx.request({
        url: getApp().globalData.url + "Index/index",
        method: 'POST',
        data: {
          page: 1,
          token: that.data.token,
          session_id: that.data.session_id,
          number: test
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        // header: {
        //   'Content-Type': 'application/json'
        // },
        success: function (res) {
          console.log('sousuo111111')
          console.log(res);
          that.setData({
            indexdata: res.data.info.resultList
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })
    }else{
      wx.showToast({
        title:'请输入要搜索的注册号',
        icon: 'none',
        duration: 2000
      })
    }

  },
  //点击高手详情页
  binddetail: function (e) {
    var uid = e.currentTarget.dataset.uid;
    var ids = e.currentTarget.dataset.ids;
    var token = wx.getStorageSync('token');
    var session_id = wx.getStorageSync('session_id');
    if (e.target.dataset.hasOwnProperty('uid')) {
      console.log('我点击的是分享！');
      return false;
    } else {
    wx.request({
      url: getApp().globalData.url + "Index/dongtaiCount",
      method: 'POST',
      data: {
        type: 4,
        uid: uid,
        id: ids,
        token: token,
        session_id: session_id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
      },
      fail: function (res) {
        console.log(res);
      }
    })
    var send = { id: uid, pagetype: 'searchshop' };
    wx.navigateTo({
      url: '../masterdetail/masterdetail?sendinfo=' + JSON.stringify(send),
    })
    }
  },
  //投票
  toupiao: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    var token = wx.getStorageSync('token');
    var session_id = wx.getStorageSync('session_id');
    wx.request({
      url: getApp().globalData.url + "Index/dongtaiCount",
      method: 'POST',
      data: {
        type: 1,
        uid: uid,
        // id: id,
        token: token,
        session_id: session_id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      // header: {
      //   'Content-Type': 'application/json'
      // },
      success: function (res) {
        console.log(res);
        if (res.data.id == 1) {
          wx.showToast({
            title: '投票成功',
            icon: 'none',
            duration: 2000
          })
        }

      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  //点赞
  dianzan: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    var dztype = e.currentTarget.dataset.dztype;
    var token = wx.getStorageSync('token');
    var session_id = wx.getStorageSync('session_id');
    var _indexdata = that.data.indexdata;
    console.log(dztype);
    for (var i = 0; i < _indexdata.length; i++) {
      if (_indexdata[i].user_id == uid && _indexdata[i].id == id) {
        var dianzan = _indexdata[i].isdianzan;
        if (dianzan == dztype) {
          if (dztype == 1) {
            _indexdata[i].isdianzan = 2;
          }
          if (dztype == 2) {
            _indexdata[i].isdianzan = 1;
          }
          that.setData({
            indexdata: _indexdata
          })
        }
      }

    }
    console.log(that.data.indexdata);
    wx.request({
      url: getApp().globalData.url + "Index/dongtaiCount",
      method: 'POST',
      data: {
        type: 2,
        uid: uid,
        id: id,
        token: token,
        session_id: session_id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })

      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  //邀请好友
  onShareAppMessage: function (res) {
    var that = this;
    var openid = wx.getStorageSync('openid');
    console.log(res);
    if (res.from === 'button') {
      var ids = res.target.dataset.ids;
      var uid = res.target.dataset.uid;
      console.log(ids, uid);
      return {
        title: '分享首页给好友！',
        imageUrl: '',
        path: 'pages/index/index',
        success: function (res) {
          wx.request({
            url: getApp().globalData.url + "Index/dongtaiCount",
            method: 'POST',
            data: {
              type: 3,
              uid: uid,
              id: ids,
              token: that.data.token,
              session_id: that.data.session_id
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              console.log(res);
              if (res.data.id == 1) {
                wx.showToast({
                  title: '分享成功',
                  icon: 'none',
                  duration: 2000
                })
              }

            },
            fail: function (res) {
              console.log(res);
            }
          })
        },
        fail: function (res) {
        }
      }
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

  /**
   * 页面上拉触底事件的处理函数
   */
  //加载下一页
  onReachBottom: function (e) {
    var that = this;
    var test = that.data.inputcontent;
    var newpage = that.data.pageindex + 1;
    that.setData({
      pageindex: newpage
    })
    console.log(newpage);
    wx.request({
      url: getApp().globalData.url + "Index/index",
      method: 'POST',
      data: {
        page: newpage,
        token: that.data.token,
        session_id: that.data.session_id,
        number: test
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      // header: {
      //   'Content-Type': 'application/json'
      // },
      success: function (res) {
        console.log(res);
        if (res.data.id == 1) {
          if (res.data.info.resultList.length >= 1) {
            var _data = that.data.indexdata.concat(res.data.info.resultList);
            that.setData({
              indexdata: _data
            })
          }
        } else if (res.data.id == 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
          })
        }

      },
      fail: function (res) {
        console.log(res);
      }
    })
  },

})
