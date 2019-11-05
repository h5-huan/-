const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chanpin:[],
    saiqu:[],
    sqindex:0,
    cpindex: 0,
    sexarr:[
      {img:'/images/sex01.jpg',sex:'先生'},
      {img: '/images/sex02.jpg', sex: '女士' }
    ],
    control: '../../images/checkact.png',
    sexname:'先生',
    name:'',
    phone:'',
    zuowu:'',
    mianji:'',
    addr:'',

    tjr:'',
    submittext:'',
    linktype:''



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var token = wx.getStorageSync('token');
    var session_id = wx.getStorageSync('session_id');
    var openid = wx.getStorageSync('openid');
    var _type = options.type;
    that.setData({
      linktype: _type
    })
    //获取赛区、产品
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
        for (var i = 0; i < res.data.info.chanpin.length;i++){
          res.data.info.chanpin[i].active='';
        }
        that.setData({
          chanpin: res.data.info.chanpin,
          saiqu: res.data.info.saiqu
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
    if (_type=='xiugai'){
      that.setData({
        submittext:'立即修改'
      })
      wx.setNavigationBarTitle({
        title: '修改资料 '
      })
      wx.request({
        url: getApp().globalData.url + "index/getUserInfo",
        method: 'POST',
        data: {
          openId: openid,
          token: token,
          session_id: session_id
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        // header: {
        //   'Content-Type': 'application/json'
        // },
        success: function (res) {
          console.log(res);
          var _chanpin=that.data.chanpin;
          var _saiqu = that.data.saiqu;
          console.log(_chanpin, _saiqu);
          if (res.data.info.sex=='男'){
            that.setData({
              sexname:'先生',
              sexarr: [
                { img: '/images/sex01.jpg', sex: '先生' },
                { img: '/images/sex02.jpg', sex: '女士' }
              ]
            })
          } else if (res.data.info.sex == '女'){
            that.setData({
              sexname: '女士',
              sexarr: [
                { img: '/images/sex02.jpg', sex: '先生' },
                { img: '/images/sex01.jpg', sex: '女士' }
              ]
            })
          }
          for (var i = 0; i < _chanpin.length;i++){
            for (var m = 0; m < res.data.info.chanpin.length;m++){
              if (_chanpin[i].title == res.data.info.chanpin[m]) {
                console.log('成功了');
                _chanpin[i].active='active';
                that.setData({
                  chanpin: _chanpin
                })
              }
            }
          }
          for (var j = 0; j < _saiqu.length; j++){
            if (_saiqu[j].s_saiqu == res.data.info.saiqu) {
              that.setData({
                sqindex: j
              })
            }
          }
          that.setData({
            name: res.data.info.truename,
            phone: res.data.info.shouji,
            zuowu: res.data.info.zuowu,
            mianji: res.data.info.mianji,
            addr: res.data.info.address,
            tjr: res.data.info.tjr
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })
    } else{
      that.setData({
        submittext: '立即注册'
      })
      wx.setNavigationBarTitle({
        title: '注册 '
      })
    }
     
    
     
  },
  //选择性别
  checksex:function(e){
    var sex = e.currentTarget.dataset.sex;
    var _sexarr = this.data.sexarr;
    for (var i = 0; i < _sexarr.length;i++){
      if (_sexarr[i].sex == sex){
        _sexarr[i].img='/images/sex01.jpg';
      }else{
        _sexarr[i].img = '/images/sex02.jpg';
      }
    }
    this.setData({
      sexarr: _sexarr,
      sexname: sex
    })
    console.log(sex);
    
  },
  //注册协议
  bindcontrol: function () {
    var that = this;
    var _control = that.data.control;
    if (_control == '../../images/checkact.png') {
      that.setData({
        control: '../../images/check.png'
      })
    } else {
      that.setData({
        control: '../../images/checkact.png'
      })
    }
  },
  sqPicker: function (e) {
    this.setData({
      sqindex: e.detail.value
    })
  },
  // cpPicker: function (e) {
  //   this.setData({
  //     cpindex: e.detail.value
  //   })
  // },
  //选择产品
  checkcp:function(e){
    var that = this;
    var ids = e.currentTarget.dataset.id;
    var _chanpin = that.data.chanpin;
    for (var i = 0; i < _chanpin.length;i++){
      if (_chanpin[i].id == ids){
        if (_chanpin[i].active==''){
          _chanpin[i].active = 'active';
        }else{
          _chanpin[i].active = '';
        }
      }
    }
    that.setData({
      chanpin: _chanpin
    })
  },
  bindname: function(event) {
    this.setData({
      name: event.detail.value,
    })
  },
  bindphone: function (event) {
    this.setData({
      phone: event.detail.value,
    })
  },
  bindzuowu: function (event) {
    this.setData({
      zuowu: event.detail.value,
    })
  },
  bindmianji: function (event) {
    this.setData({
      mianji: event.detail.value,
    })
  },
  bindaddr: function (event) {
    this.setData({
      addr: event.detail.value,
    })
  },
  bindtjr: function (event) {
    this.setData({
      tjr: event.detail.value,
    })
  },
  orderSign: function (e) {
    console.log(e);
    var fId = e.detail.formId;
    var openid = wx.getStorageSync('openid');
    var userInfo = wx.getStorageSync('userInfo');
    var _u_id = wx.getStorageSync('u_id');
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var _name = this.data.name;
    var _sexname = this.data.sexname;
    var _phone = this.data.phone;
    var _zuowu = this.data.zuowu;
    var _mianji = this.data.mianji;
    var _addr = this.data.addr;
    var _sqindex = this.data.sqindex;
    var cpids = [];
    // var _cpindex = this.data.cpindex;
    var _saiqu = this.data.saiqu;
    var _chanpin = this.data.chanpin;
    var _tjr = this.data.tjr;
    var _control = this.data.control;
    var _linktype = this.data.linktype;
    for (var i = 0; i < _saiqu.length; i++) {
      if (i == _sqindex) {
        var actsq = _saiqu[i].id;
      }
    }
    
    for (var j = 0; j < _chanpin.length; j++){
      if (_chanpin[j].active =='active'){
        var cpid = _chanpin[j].title;
        cpids.push(cpid);
      }
    }
    console.log(cpids);
    var aa = new Array(cpids);
    var bb = aa.join("+"); 
    console.log(bb);
    // for (var j = 0; j < _chanpin.length; j++) {
    //   if (j == _cpindex) {
    //     var actcp = _chanpin[j].id;
    //   }
    // }
    if (_name == '' || _name.replace(/\s|\xA0/g, "") == "") {
      app.toats('请输入姓名');
    } else if (_phone == '' || _phone.replace(/\s|\xA0/g, "") == "") {
      app.toats('请输入手机号');
    } else if (!myreg.test(_phone)){
      app.toats('手机号格式有误');
    } else if (_zuowu == '' || _zuowu.replace(/\s|\xA0/g, "") == "") {
      app.toats('请输入种植作物');
    } else if (_mianji == '' || _mianji.replace(/\s|\xA0/g, "") == "") {
      app.toats('请输入种植面积');
    } else if (_addr == '' || _addr.replace(/\s|\xA0/g, "") == "") {
      app.toats('请输入详细地址');
    } else if (cpids==''){
      app.toats('请选择产品');
    } else if (_control =='../../images/check.png'){
      app.toats('请勾选注册协议');
    }else{
      var datas = {
        user_name: _name,
        truename: _name,
        shouji: _phone,
        zuowu: _zuowu,
        mianji: _mianji,
        address: _addr,
        saiqu: actsq,
        chanpin: bb,
        weixin_openId: openid,
        weixin_touxiang: userInfo.avatarUrl,
        weixin_nick: userInfo.nickName,
        form_id: fId
      }
      var _submittext = this.data.submittext;
      console.log(_submittext);
      if (_submittext=='立即注册'){
        datas.id = '';
      } else if (_submittext == '立即修改'){
        datas.id = _u_id;
      }
     
      
      if (_tjr == '' || _tjr.replace(/\s|\xA0/g, "") == ""){
        datas.tjr = _tjr;
      }
      if (_sexname =='先生'){
        datas.sex='男';
      } else if (_sexname == '女士'){
        datas.sex = '女';
      }
      wx.request({
        url: getApp().globalData.url + "Login/register",
        method: 'POST',
        data: datas,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        // header: {
        //   'Content-Type': 'application/json'
        // },
        success: function (res) {
          console.log(res);
          if (res.data.id==1){
            var token = res.data.info.token;
            var session_id = res.data.info.session_id;
            var u_id = res.data.info.u_id;
            var ispass = res.data.info.ispass
            wx.setStorageSync('token', token);
            wx.setStorageSync('session_id', session_id);
            wx.setStorageSync('u_id', u_id);
            wx.setStorageSync('ispass', ispass);
            if (_linktype == 'zhuce') {
              wx.showToast({
                title: '注册成功！',
                icon: 'none',
                duration: 2000,
                success: function () {
                },
              })
              wx.reLaunch({
                url: '../index/index',
              })
              // wx.navigateBack({
              //   delta: 1
              // })
            } else if (_linktype == 'xiugai') {
              wx.showToast({
                title: '修改成功！',
                icon: 'none',
                duration: 2000,
                success: function () {
                },
              })
              // wx.navigateBack({
              //   delta: 1
              // })
              wx.reLaunch({
                url: '../index/index',
              })
            } else{
              wx.showToast({
                title: '注册成功！',
                icon: 'none',
                duration: 2000,
                success: function () {
                },
              })
              // wx.navigateBack({
              //   delta: 1
              // })
              wx.reLaunch({
                url: '../index6/index6?session_id=' + _linktype,
              })
            }
            
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

})