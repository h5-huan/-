const QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var amapFile = require('../../utils/amap-wx.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: "https://vote.south-power.cn",
    userInfo:{},
    personCount:'',
    listdata:[],
    token: '',
    session_id: '',
    pageindex:1,
    shareids: '',
    shareuid: '',
    sharescrren: false,
    ewmimg: '',
    ewmimgshow: false,
    indexdata:[],
    userid:'',
    closeqxbox: ''
  },
  //加视频状态
  playvideo: function (res) {
    for (var i = 0; i < res.length; i++) {
      if (res[i].type == 2) {
        res[i].videotype = 1;
      }
    }
  },
  //视频播放
  bindvideo: function (e) {
    console.log(e);
    var that = this;
    var ids = e.currentTarget.dataset.id;
    var _listdata = that.data.listdata;
    for (var i = 0; i < _listdata.length; i++) {
      if (_listdata[i].id == ids) {
        _listdata[i].videotype = 2;
      } else {
        _listdata[i].videotype = 1;
      }
    }
    that.videoContext = wx.createVideoContext('myVideo_' + ids);
    that.videoContext.requestFullScreen();
    that.videoContext.play();
    that.setData({
      listdata: _listdata
    })
  },
  bindscreen_video(e) {
    console.log('点击的是视频');
    console.log(e);
    var that = this;
    var screen = e.detail;
    var ids = e.currentTarget.dataset.id;
    var _listdata = that.data.listdata;
    this.videoContext = wx.createVideoContext('myVideo_' + ids);
    if (screen.fullScreen == false) {    //退出全屏
      for (var i = 0; i < _listdata.length; i++) {
        if (_listdata[i].id == ids) {
          _listdata[i].videotype = 1;
        }
      }
      that.setData({
        listdata: _listdata
      })
      this.videoContext.pause();
      this.videoContext.seek(0);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var openid = wx.getStorageSync('openid');
    if (!openid){
      that.setData({
        closeqxbox: true
      })
    }
      if (options.scene || options.session_id) {
        if (options.scene) {
          var token = '';
          var session_id = decodeURIComponent(options.scene);
          console.log('二维码携带的session_id是' + qrId);
        }
        if (options.session_id) {
          var token = '';
          var session_id = options.session_id;
          console.log('分享页面收到的session_id是' + options.session_id);
        }
      }
    
		
		console.log('此时的session_id是' + session_id);
		that.setData({
      token: token,
      session_id: session_id
		})	
	  console.log('此时的that.data.session_id是' + that.data.session_id);		
		// if(session_id){
    //   wx.request({
    //     url: getApp().globalData.url + "login/login",
    //     method: 'POST',
    //     data: {
    //       openId: openid
    //     },
    //     header: { 'content-type': 'application/x-www-form-urlencoded' },
    //     // header: {
    //     //   'Content-Type': 'application/json'
    //     // },
    //     success: function (res) {
    //       console.log(res);
    //       if (res.data.id == 1) {
    //         var token = res.data.info.token;
    //         var session_id = res.data.info.session_id;
    //         var u_id = res.data.info.u_id;
    //         var ispass = res.data.info.ispass;
    //         var ispublish = res.data.info.ispublish;
    //         wx.setStorageSync('token', token);
    //         wx.setStorageSync('session_id', session_id);
    //         wx.setStorageSync('u_id', u_id);
    //         // that.setData({
    //         //   token: token,
    //         //   session_id: session_id
    //         // })
    //         if (ispublish == 0) {
    //           that.setData({
    //             publishbtn: true
    //           })
    //         } else {
    //           that.setData({
    //             publishbtn: false
    //           })
    //         }
    //         that.setData({
    //           ispass: ispass,
    //           ispublish: ispublish
    //         })
    //       }
    //     },
    //     fail: function (res) {
    //       console.log(res);
    //     }
    //   })
		// }    
    
    //个人发布动态
	  console.log('发布动态请求前的session_id是' + that.data.session_id);
    wx.request({
      url: getApp().globalData.url + "User/myDongtai",
      method: 'POST',
      data: {
        page:1,
        // token: token,
        session_id: that.data.session_id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res);
        that.playvideo(res.data.info.dongtaiList);
        for (var i = 0; i < res.data.info.dongtaiList.length;i++){
          res.data.info.dongtaiList[i].ispl=false;
          res.data.info.dongtaiList[i].inputtext = '';
        }
        var uid = res.data.info.userInfo.id;
        that.setData({
          userid: uid,
          userInfo: res.data.info.userInfo,
          personCount: res.data.info.dongtaiCount,
          ewmimg: 'https://vote.south-power.cn/' + res.data.info.userInfo.share_img
        })
        if (res.data.info.dongtaiList==''){
          that.setData({
            listdata:[]
          })
        }else{
          that.setData({
            listdata: res.data.info.dongtaiList
          })
        }
        console.log(that.data.listdata);
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  //加载下一页
  onReachBottom: function (e) {
    var that = this;
    var newpage = that.data.pageindex + 1;
    that.setData({
      pageindex: newpage
    })
    console.log(newpage);
    wx.request({
      url: getApp().globalData.url + "User/myDongtai",
      method: 'POST',
      data: {
        page: newpage,
        token: that.data.token,
        session_id: that.data.session_id,
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res);
        that.playvideo(res.data.info.dongtaiList);
          if (res.data.info.dongtaiList.length >= 1) {
            for (var i = 0; i < res.data.info.dongtaiList.length; i++) {
              res.data.info.dongtaiList[i].ispl = false;
              res.data.info.dongtaiList[i].inputtext = '';
            }
            var _data = that.data.listdata.concat(res.data.info.dongtaiList);
            that.setData({
              listdata: _data
            })
          }else{
            wx.showToast({
              title:'没有动态了',
              icon: 'loading',
            })
          }

      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  plinput:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    var _indexdata = that.data.listdata;
    for (var i = 0; i < _indexdata.length; i++) {
      if (_indexdata[i].user_id == uid && _indexdata[i].id == id) {
        _indexdata[i].inputtext = e.detail.value;
      }
      that.setData({
        listdata: _indexdata
      })
    }
  },
  sendmsg: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    var _indexdata = that.data.listdata;
    for (var i = 0; i < _indexdata.length; i++) {
      if (_indexdata[i].user_id == uid && _indexdata[i].id == id) {
        var test=_indexdata[i].inputtext;
      }
    }
    // if (!that.data.token && !that.data.session_id){
    //   wx.reLaunch({
    //     url: '../welcome/index',
    //   })
    // }else{}
    if (test){
      wx.request({
        url: getApp().globalData.url + "index/pinglun",
        method: 'POST',
        data: {
          id: id,
          comment_content: test,
          token: that.data.token,
          session_id: that.data.session_id
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          console.log(res);
          if (res.data.id==1){
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            });
            that.onLoad({sendinfo:JSON.stringify(that.data.sendinfo)});
            return false;
            for (var i = 0; i < _indexdata.length; i++) {
              if (_indexdata[i].user_id == uid && _indexdata[i].id == id) {
                _indexdata[i].inputtext='';
              }
            }
            that.onLoad();
            that.setData({
              listdata: _indexdata
            })
          }
        },
        fail: function (res) {
          console.log(res);
        }
      })
    }else{
      wx.showToast({
        title:'请输入留言',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //点赞
  dianzan: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var uid = e.currentTarget.dataset.uid;
    var dztype = e.currentTarget.dataset.dztype;
    var token = wx.getStorageSync('token');
    var session_id = wx.getStorageSync('session_id');
    var _indexdata = that.data.listdata;
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
            listdata: _indexdata
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
  //邀请好友
  onShareAppMessage: function (res) {
    var that = this;
    var openid = wx.getStorageSync('openid');
    var _listdata = that.data.listdata;
    console.log(res);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      if (res.target.id == 1) {
        return {
          title: '邀请好友！',
          imageUrl: '',
          path: 'pages/index6/index6?session_id=' + that.data.session_id,
          success: function (res) {
            wx.showToast({
              title: '邀请成功',
              icon: 'none',
              duration: 2000
            })
          },
          fail: function (res) {
          }
        }
      }
    } else if (res.from === 'menu'){
      return {
        title: '邀请好友！',
        imageUrl: '',
        path: 'pages/index6/index6?session_id=' + that.data.session_id,
        success: function (res) {
          wx.showToast({
            title: '邀请成功',
            icon: 'none',
            duration: 2000
          })
        },
        fail: function (res) {
        }
      }

    }
  },
  //投票
  toupiao: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var token = wx.getStorageSync('token');
    var session_id = wx.getStorageSync('session_id');
    if (!token && !session_id){
      wx.showModal({
        title: '提示',
        content: '请先注册成为会员，才能进行投票',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../register/register?type=' + that.data.session_id,
            })
          } else {
            console.log('用户点击取消')
          }

        }
      })
    }else{
      wx.request({
        url: getApp().globalData.url + "Index/dongtaiCount",
        method: 'POST',
        data: {
          type: 1,
          uid: that.data.userid,
          token: token,
          session_id: session_id
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          console.log(res);
          if (res.data.id == 1) {
            var _userInfo = that.data.userInfo;
            _userInfo.toups = parseInt(_userInfo.toups) + 1;
            that.setData({
              userInfo: _userInfo
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
    }
    
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
              this.setData({
                closeqxbox: false
              })
            }
          })

        }
      }
    })
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
  // 删除
  deletelist:function(e){
    var that=this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定删除这个动态吗?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.url + "user/delDongtai",
            method: 'POST',
            data: {
              id: id,
              token: that.data.token,
              session_id: that.data.session_id
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              console.log(res);
              if (res.data.id == 1) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000,
                  success: function () {
                    that.onLoad();
                  }
                })
              }
            },
            fail: function (res) {
              console.log(res);
            }
          })
        } else {
        }

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
      current: dongimg[src], // 当前显示图片的http链接
      urls: dongimg // 需要预览的图片http链接列表
    })
  }

})
