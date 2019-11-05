const QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var amapFile = require('../../utils/amap-wx.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //发布
    val: '',
    avatarUrl: [],
    video: '',
    imgurl: "https://vote.south-power.cn/Public/Uploads/",
    order: [
      { 'id': 0, 'state': '图片上传' },
      { 'id': 1, 'state': '视频上传' }
    ],
    order_index: 0
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
    if (index == 4) {
      wx.reLaunch({
        url: '../index4/index4',
      })
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
  // 图片上传视频上传切换
  orderTab: function (e) {
    var that = this;
    let order_index = e.currentTarget.dataset.index;
    if (order_index==0){
      this.setData({
        video:''
      })
    } else if (order_index == 1){
      this.setData({
        avatarUrl: []
      })
    }
    if (this.data.order_index == order_index) return;
    this.setData({ order_index });
  },

  // 。。。。。。。。。。。发布。。。。。。。。。。。
  textinput: function (e) {
    let val = e.detail.value;
    this.setData({ val })
  },
  //删除选中的图片
  binddel: function (e) {
    var dataset = e.currentTarget.dataset;
    var Index = dataset.index;

    this.data.avatarUrl.splice(Index, 1);

    this.setData({
      avatarUrl: this.data.avatarUrl
    });
  },
  //点击上传图片按钮效果
  addImage: function () {
    var that = this;
    var orderindex = that.data.order_index;
    if (orderindex==0){
      wx.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          var tempFilePaths = res.tempFilePaths;
          var arr = that.data.avatarUrl.concat(tempFilePaths);
          that.setData({
            avatarUrl: arr
          })
        },
        fail: function (res) {

        },
        complete: function (res) {

        }
      })
    } else if (orderindex == 1){
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        compressed: true,
        maxDuration: 60,
        camera: 'back',
        success: function (res) {
          that.setData({
            video: res.tempFilePath
          })
        }
      })
    }
    
  },
  //点击图片预览效果
  previewImage: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      pictures = that.data.avatarUrl;
    wx.previewImage({
      current: pictures[index],
      urls: pictures
    })
    that.setData({
      avatarUrl: pictures,
    })
  },
  submit: function () {
    var that = this;
    var textval = that.data.val;
    var _avatarUrl = that.data.avatarUrl;
    var _video = that.data.video;
    var orderindex = that.data.order_index;
    var token = wx.getStorageSync('token');
    var session_id = wx.getStorageSync('session_id');
    if (orderindex==0){
    if (textval == '' || textval == null || textval.replace(/\s|\xA0/g, "") == "") {
      wx.showToast({
        title: '请输入描述！',
        icon: 'none',
        duration: 2000
      })
    } else if (textval.length > 200) {
      wx.showToast({
        title: '描述不超过200字！',
        icon: 'none',
        duration: 2000
      })
    } else if (_avatarUrl === null || _avatarUrl.length > 9) {
      wx.showToast({
        title: '图片不超过9张',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showLoading({
        title: '发布中',
      })
      console.log(token, session_id);
      if (that.data.avatarUrl.length > 0) {
        var datas = [];
        var upload_number = 0;
        for (var i = 0, iLength = that.data.avatarUrl.length; i < iLength; i++) {
          var url = that.data.avatarUrl[i];
          console.log(url);
          wx.uploadFile({
            url: getApp().globalData.url + "user/upImgs",      //此处换上你的接口地址
            filePath: url,
            name: 'imgs',
            header: {
              "Content-Type": "multipart/form-data"
            },
            // header: {
            //   "Content-Type": "multipart/form-data",
            //   'accept': 'application/json',
            // },
            formData: {
              token: token,
              session_id: session_id
            },
            success: function (res) {
              console.log(res);
              var data = JSON.parse(res.data);
              console.log(data.info);
              var _url = data.info;
              datas.push(_url);
              console.log(datas);
              upload_number++;
              if (upload_number == that.data.avatarUrl.length) {
                wx.request({
                  url: getApp().globalData.url + "User/dongtaiAdd",
                  method: 'POST',
                  data: {
                    describe: textval,
                    imgs: datas.join(","),
                    type:1,
                    token: token,
                    session_id: session_id
                  },
                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                  success: function (res) {
                    console.log(res);
                      if (res.data.id == 1) {
                        wx.showToast({
                          title: res.data.msg,
                          icon: 'none',
                          duration: 2000
                        })
                        wx.reLaunch({
                          url: '../index/index',
                        })
                      }else{
                        wx.showToast({
                          title: res.data.msg,
                          icon: 'none',
                          duration: 2000
                        })
                      }
                    


                  },
                  fail: function (res) {
                    console.log(res);
                  }
                })
              }

            },
            fail: function (res) {
              console.log(res);

            },
          })
        }
      }else {
        wx.request({
          url: getApp().globalData.url + "User/dongtaiAdd",
          method: 'POST',
          data: {
            describe: textval,
            imgs:'',
            type: 1,
            token: token,
            session_id: session_id
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            console.log(res);
            if (res.data.id == 1) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
              wx.reLaunch({
                url: '../index/index',
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail: function (res) {
            console.log(res);
          }
        })

      }
    }
    } else if(orderindex == 1){
      if (textval == '' || textval == null || textval.replace(/\s|\xA0/g, "") == "") {
        wx.showToast({
          title: '请输入描述！',
          icon: 'none',
          duration: 2000
        })
      } else if (textval.length > 200) {
        wx.showToast({
          title: '描述不超过200字！',
          icon: 'none',
          duration: 2000
        })
      }else {
        wx.showLoading({
          title: '发布中',
        })
        if (_video) {
          var upload_number = 0;
          console.log(_video);
            wx.uploadFile({
              url: getApp().globalData.url + "user/upImgs",      //此处换上你的接口地址
              filePath: _video,
              name: 'imgs',
              header: {
                "Content-Type": "multipart/form-data"
              },
              // header: {
              //   "Content-Type": "multipart/form-data",
              //   'accept': 'application/json',
              // },
              formData: {
                token: token,
                session_id: session_id
              },
              success: function (res) {
                console.log(res);
                var data = JSON.parse(res.data);
                console.log(data.info);
                if (data.id==1){
                  wx.request({
                    url: getApp().globalData.url + "User/dongtaiAdd",
                    method: 'POST',
                    data: {
                      describe: textval,
                      imgs: data.info,
                      type: 2,
                      token: token,
                      session_id: session_id
                    },
                    header: { 'content-type': 'application/x-www-form-urlencoded' },
                    success: function (res) {
                      console.log(res);
                      if (res.data.id == 1) {
                        wx.showToast({
                          title: res.data.msg,
                          icon: 'none',
                          duration: 2000
                        })
                        wx.reLaunch({
                          url: '../index/index',
                        })
                      } else {
                        wx.showToast({
                          title: res.data.msg,
                          icon: 'none',
                          duration: 2000
                        })
                      }



                    },
                    fail: function (res) {
                      console.log(res);
                    }
                  })
                }else{
                  wx.showToast({
                    title: data.msg,
                    icon: 'none',
                    duration: 2000
                  })
                }

              },
              fail: function (res) {
                console.log(res);

              },
            })
        } else {
          wx.request({
            url: getApp().globalData.url + "User/dongtaiAdd",
            method: 'POST',
            data: {
              describe: textval,
              imgs: '',
              type: 2,
              token: token,
              session_id: session_id
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              console.log(res);
              if (res.data.id == 1) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
                wx.reLaunch({
                  url: '../index/index',
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            fail: function (res) {
              console.log(res);
            }
          })

        }
      }


    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var openid = wx.getStorageSync('openid');
    if (!openid) {
      wx.reLaunch({
        url: '../welcome/index',
      })
    }


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {


  },


})