const QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var amapFile = require('../../utils/amap-wx.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timejuli: [
      { 'id': 0, 'state': '按赛区', 'img': '../../images/tab1.png', 'jt': '../../images/dizhi.png', 'active': '' },
      { 'id': 1, 'state': '按产品', 'img': '../../images/tab2.png', 'jt': '../../images/dizhi.png', 'active': '' }
    ],
    adv: [],
    inputcontent: '',
    indexscrren: false,
    imgurl: "https://vote.south-power.cn",
    tab2: false,
    tab4: false,
    token: '',
    session_id: '',
    pageindex: 1,
    sqshow: false,
    cpshow: false,
    sqdata: [],
    cpdata: [],
    sqtext: '',
    cptext: '',
    shscreen: '',
    publishbtn: '',
    ispass: '',
    ispublish: '',
    shareids: '',
    shareuid: '',
    sharescrren: false,
    ewmimg: '',
    ewmimgshow: false,
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
    } if (index == 2) {
      wx.reLaunch({
        url: '../index2/index2',
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
  //搜索店铺
  sousuoinput: function (event) {
    this.setData({
      inputcontent: event.detail.value,
    })
  },
  // 搜索按钮
  ssbtn: function () {
    var that = this;
    var test = that.data.inputcontent;
    var _cptext = that.data.cptext;
    var _sqtext = that.data.sqtext;
    //if (test) {
      that.setData({
        pageindex: 1
      })
      var datas = {
        page: 1,
        token: that.data.token,
        session_id: that.data.session_id,
        number: test
      }
      if (_cptext == '全部') {
        datas.chanpin = '';
      } else {
        datas.chanpin = _cptext;
      }
      if (_sqtext != '全部') {
        datas.saiqu = '';
      } else {
        datas.saiqu = _sqtext;
      }
      wx.request({
        url: getApp().globalData.url + "Index/index",
        method: 'POST',
        data: datas,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        // header: {
        //   'Content-Type': 'application/json'
        // },
        success: function (res) {
          console.log('sousuo4')
          console.log(res);
          if (res.data.id == 1) {
            that.playvideo(res.data.info.resultList);
            that.setData({
              indexdata: res.data.info.resultList
            })
          } else {
            that.setData({
              indexdata: []
            })
          }
        },
        fail: function (res) {
          console.log(res);
        }
      })
    /*} else {
      wx.showToast({
        title: '请输入要搜索的注册号',
        icon: 'none',
        duration: 2000
      })
    }*/

  },
  //视频播放
  bindvideo: function (e) {
    console.log(e);
    var that = this;
    var ids = e.currentTarget.dataset.id;
    var _indexdata = that.data.indexdata;
    for (var i = 0; i < _indexdata.length; i++) {
      if (_indexdata[i].id == ids) {
        _indexdata[i].videotype = 2;
      } else {
        _indexdata[i].videotype = 1;
      }
    }
    that.videoContext = wx.createVideoContext('myVideo_' + ids);
    that.videoContext.requestFullScreen();
    that.videoContext.play();
    that.setData({
      indexdata: _indexdata
    })
  },
  bindscreen_video(e) {
    console.log('点击的是视频');
    console.log(e);
    var that = this;
    var screen = e.detail;
    var ids = e.currentTarget.dataset.id;
    var _indexdata = that.data.indexdata;
    this.videoContext = wx.createVideoContext('myVideo_' + ids);
    if (screen.fullScreen == false) {    //退出全屏
      this.videoContext.pause();
      this.videoContext.seek(0);
      for (var i = 0; i < _indexdata.length; i++) {
        if (_indexdata[i].id == ids) {
          _indexdata[i].videotype = 1;
        }
      }
      that.setData({
        indexdata: _indexdata
      })
    }
  },
  //点击高手详情页
  binddetail: function (e) {
    var that = this;
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
        if (res.data.id == 1) {
          var _data = that.data.indexdata;
          for (var i = 0; i < _data.length; i++) {
            if (_data[i].user_id == uid && _data[i].id == ids) {
              _data[i].dongtaiCountList.liulan = parseInt(_data[i].dongtaiCountList.liulan) + 1;
            }
          }
          that.setData({
            indexdata: _data
          })

        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
    var send = { id: uid, pagetype: 'index4' };
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
          for (var i = 0; i < _indexdata.length; i++) {
            if (uid == _indexdata[i].user_id) {
              _indexdata[i].userInfo.toups = parseInt(_indexdata[i].userInfo.toups) + 1;
            }
          }
          that.setData({
            indexdata: _indexdata
          })
        }
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
  //点击分享按钮
  sharebtn: function (e) {
    var uid = e.currentTarget.dataset.uid;
    var ids = e.currentTarget.dataset.ids;
    console.log(ids, uid);
    this.setData({
      shareids: ids,
      shareuid: uid,
      sharescrren: true
    })
  },
  //关闭分享弹窗
  shareclose: function (e) {
    this.setData({
      sharescrren: false,
      ewmimgshow: false
    })
  },
  //发送给朋友
  //邀请好友
  onShareAppMessage: function (res) {
    var that = this;
    var openid = wx.getStorageSync('openid');
    var _indexdata = that.data.indexdata;
    console.log(res);
    if (res.from === 'button') {
      return {
        title: '分享高手展示给好友！',
        imageUrl: '',
        path: 'pages/index4/index4?sharetpe=index4',
        success: function (res) {
          wx.request({
            url: getApp().globalData.url + "Index/dongtaiCount",
            method: 'POST',
            data: {
              type: 3,
              uid: that.data.shareuid,
              id: that.data.shareids,
              token: that.data.token,
              session_id: that.data.session_id
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              console.log(res);
              if (res.data.id == 1) {
                for (var i = 0; i < _indexdata.length; i++) {
                  if (that.data.shareuid == _indexdata[i].user_id && that.data.shareids == _indexdata[i].id) {
                    _indexdata[i].dongtaiCountList.fenxiang = parseInt(_indexdata[i].dongtaiCountList.fenxiang) + 1;
                  }
                }
                that.setData({
                  indexdata: _indexdata
                })
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
    } else if (res.from === 'menu'){
      return {
        title: '分享高手展示给好友！',
        imageUrl: '',
        path: 'pages/index4/index4?sharetpe=index4',
        success: function (res) {
          wx.showToast({
            title: '分享成功',
            icon: 'none',
            duration: 2000
          })
        },
        fail: function (res) {
        }
      }

    }
  },
  //生成分享图片
  makeimg: function () {
    this.setData({
      ewmimgshow: true
    })
  },
  downloadImage: function (imageUrl) {
    // 下载文件  
    wx.downloadFile({
      url: imageUrl,
      success: function (res) {
        console.log("下载文件：success");
        console.log(res);

        // 保存图片到系统相册  
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log("保存图片：success");
            app.tip('保存成功');
          },
          fail(res) {
            console.log("保存图片：fail");
            console.log(res);
            app.tip('保存失败');
          }
        })
      },
      fail: function (res) {
        console.log("下载文件：fail");
        console.log(res);
        wx.showModal({
          title: '下载文件失败',
          content: res.errMsg,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else {
              console.log('用户点击取消')
            }

          }
        })

      }
    })
  },
  //保存二维码图片
  onSavePicClick: function () {
    var that = this;
    var downloadewm = that.data.ewmimg;
    console.log("downloadUrl=" + downloadewm);
    if (!wx.saveImageToPhotosAlbum) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
      return;
    }
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.writePhotosAlbum" 这个 scope  
    wx.getSetting({
      success(res) {
        console.log(res);
        if (typeof res.authSetting['scope.writePhotosAlbum'] == 'undefined') {
          // 未授过权
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function (res) {
              console.log(res);
              app.tip('授权相册成功');
              that.downloadImage(downloadewm);
            }
          });
        }
        else if (res.authSetting['scope.writePhotosAlbum'] === false) {
          // 已拒绝过授权，则打开设置界面引导用户开启授权
          wx.showModal({
            title: '是否授权保存图片到相册',
            content: '需要获取您的相册授权，请确认授权，否则无法保存图片到本地相册',
            success: function (res) {
              if (res.cancel) {
                console.info("1授权失败返回数据");
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (data) {
                    console.log(data);
                    if (data.authSetting["scope.writePhotosAlbum"]) {
                      app.tip('授权相册成功');
                      that.downloadImage(downloadewm);
                    } else {
                      app.tip('授权相册失败');
                    }
                  }
                })
              }
            }
          })
        } else {
          that.downloadImage(downloadewm);
        }
      },
      fail(res) {
        console.log(res);
      }

    })
  },
  // 筛选
  bindshaixuan: function (e) {
    var that = this;
    var _index = e.currentTarget.dataset.index;
    var _sqshow = that.data.sqshow;
    var _cpshow = that.data.cpshow;
    console.log(_index);
    if (_index == 0) {
      if (_sqshow == false) {
        that.setData({
          sqshow: true
        })
      } else {
        that.setData({
          sqshow: false
        })
      }
    }
    if (_index == 1) {
      if (_cpshow == false) {
        that.setData({
          cpshow: true
        })
      } else {
        that.setData({
          cpshow: false
        })
      }
    }
  },
  // 赛区筛选
  bindsaiqu: function (e) {
    var that = this;
    var title = e.currentTarget.dataset.title;
    var _timejuli = that.data.timejuli;
    var _cptext = that.data.cptext;
    var _inputcontent = that.data.inputcontent;
    console.log(title);
    that.setData({
      pageindex: 1
    })
    var datas = {
      page: 1,
      token: that.data.token,
      session_id: that.data.session_id
    }
    if (title == '全部') {
      datas.saiqu = '';
    } else {
      datas.saiqu = title;
    }
    if (_cptext == '全部') {
      datas.chanpin = '';
    } else {
      datas.chanpin = _cptext;
    }
    if (_inputcontent != '') {
      datas.number = _inputcontent;
    }
    wx.request({
      url: getApp().globalData.url + "Index/index",
      method: 'POST',
      data: datas,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      // header: {
      //   'Content-Type': 'application/json'
      // },
      success: function (res) {
        console.log(res);
        for (var i = 0; i < _timejuli.length; i++) {
          _timejuli[0].state = title;
          that.setData({
            timejuli: _timejuli,
          })
        }
        that.playvideo(res.data.info.resultList);
        that.setData({
          sqshow: false,
          indexdata: res.data.info.resultList ? res.data.info.resultList : [],
          sqtext: title
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  //产品筛选
  bindchanpin: function (e) {
    var that = this;
    var title = e.currentTarget.dataset.title;
    var _timejuli = that.data.timejuli;
    var _sqtext = that.data.sqtext;
    var _inputcontent = that.data.inputcontent;
    console.log(title);
    that.setData({
      pageindex: 1
    })
    var datas = {
      page: 1,
      token: that.data.token,
      session_id: that.data.session_id
    }
    if (title == '全部') {
      datas.chanpin = '';
    } else {
      datas.chanpin = title;
    }
    if (_sqtext == '全部') {
      datas.saiqu = '';
    } else {
      datas.saiqu = _sqtext;
    }
    if (_inputcontent != '') {
      datas.number = _inputcontent;
    }
    wx.request({
      url: getApp().globalData.url + "Index/index",
      method: 'POST',
      data: datas,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      // header: {
      //   'Content-Type': 'application/json'
      // },
      success: function (res) {
        console.log(res);
        for (var i = 0; i < _timejuli.length; i++) {
          _timejuli[1].state = title;
          that.setData({
            timejuli: _timejuli,
          })
        }
        that.playvideo(res.data.info.resultList);
        that.setData({
          cpshow: false,
          indexdata: res.data.info.resultList ? res.data.info.resultList : [],
          cptext: title
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  //参比赛
  takepart: function () {
    var that = this;
    var token = that.data.token;
    var session_id = that.data.session_id;
    var _ispass = that.data.ispass;
    if (token && session_id) {
      if (_ispass == 2) {
        wx.reLaunch({
          url: '../index3/index3',
        })
      } else {
        that.setData({
          shscreen: true
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请先注册成为会员，才能参加比赛',
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
  },
  // 关闭审核弹窗
  closesh: function () {
    this.setData({
      shscreen: false
    })
  },
  //修改资料
  changedovument: function () {
    wx.navigateTo({
      url: '../register/register?type=xiugai',
    })
  },


  //加视频状态
  playvideo: function (res) {
    for (var i = 0; i < res.length; i++) {
      if (res[i].type == 2) {
        res[i].videotype = 1;
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var openid = wx.getStorageSync('openid');
    var token = wx.getStorageSync('token');
    var session_id = wx.getStorageSync('session_id');
    if (!openid) {
      if (options.sharetpe = index4){
        wx.setStorageSync('shareindex4', shareindex4);
      }
      wx.reLaunch({
        url: '../welcome/index',
      })
    } else {
    that.setData({
      token:token,
      session_id:session_id
    })
    console.log(openid);
    wx.request({
      url: getApp().globalData.url + "login/login",
      method: 'POST',
      data: {
        openId: openid
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res);
        if (res.data.id == 1) {
          var token = res.data.info.token;
          var session_id = res.data.info.session_id;
          var u_id = res.data.info.u_id;
          var ispass = res.data.info.ispass
          wx.setStorageSync('token', token);
          wx.setStorageSync('session_id', session_id);
          that.setData({
            token: token,
            session_id: session_id
          })
          wx.setStorageSync('u_id', u_id);
          var ispublish = res.data.info.ispublish;
          if (ispublish == 0) {
            that.setData({
              publishbtn: true
            })
          } else {
            that.setData({
              publishbtn: false
            })
          }
          that.setData({
            ispass: ispass,
            ispublish: ispublish
          })
        } else {

        }

      },
      fail: function (res) {
        console.log(res);
      }
    })
    wx.request({
      url: getApp().globalData.url + "Index/index",
      method: 'POST',
      data: {
        token: token,
        session_id: session_id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      // header: {
      //   'Content-Type': 'application/json'
      // },
      success: function (res) {
        console.log(res);
        that.playvideo(res.data.info.resultList);
        that.setData({
          indexdata: res.data.info.resultList
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
    // 筛选
    wx.request({
      url: getApp().globalData.url + "login/registerInfo",
      method: 'POST',
      data: {
        token: token,
        session_id: session_id
      },
      // header: { 'content-type': 'application/x-www-form-urlencoded' },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          cpdata: res.data.info.chanpin,
          sqdata: res.data.info.saiqu
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
    //分享图片
    wx.request({
      url: getApp().globalData.url + "Index/getPhoto",
      method: 'POST',
      data: {
        token: token,
        session_id: session_id,
        photo_type: 'detail_share'
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res);
        for (var i = 0; i < res.data.info.length; i++) {
          if (res.data.info[i].photo_type == 'detail_share') {
            var img = res.data.info[i].tuimg;
            that.setData({
              ewmimg: 'https://vote.south-power.cn/Public/Uploads/' + img,
            })
          }
        }

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
  //加载下一页
  onReachBottom: function (e) {
    var that = this;
    var newpage = that.data.pageindex + 1;
    var _sqtext = that.data.sqtext;
    var _cptext = that.data.cptext;
    var _inputcontent = that.data.inputcontent;
    that.setData({
      pageindex: newpage
    })
    var datas = {
      page: newpage,
      token: that.data.token,
      session_id: that.data.session_id,
      number: _inputcontent
    }
    console.log(newpage);
    if (_sqtext == '全部') {
      datas.saiqu = '';
    } else {
      datas.saiqu = _sqtext;
    }
    if (_cptext == '全部') {
      datas.chanpin = '';
    } else {
      datas.chanpin = _cptext;
    }
    wx.request({
      url: getApp().globalData.url + "Index/index",
      method: 'POST',
      data: datas,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      // header: {
      //   'Content-Type': 'application/json'
      // },
      success: function (res) {
        console.log(res);
        if (res.data.id == 1) {
          if (res.data.info.resultList.length >= 1) {
            that.playvideo(res.data.info.resultList);
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
  previewImage: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var dongimg = event.currentTarget.dataset.srclist;
    var that = this;
    for (var i=0;i<dongimg.length;i++) {
      dongimg[i] = that.data.imgurl+dongimg[i];
    }
    wx.previewImage({
      current:dongimg[src],
      urls: dongimg // 需要预览的图片http链接列表
    })
  }

})
