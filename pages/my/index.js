// pages/category/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    balance: 0,
    freeze: 0,
    score: 2,
    score_sign_continuous: 2,
    isSign:false
  },
  goCharge(){
    wx.navigateTo({
      url: "/pages/recharge/index"
    })
  },
  goWithDraw() {
    wx.navigateTo({
      url: "/pages/withdraw/index"
    })
  },
  toOrder(){
    wx.navigateTo({
      url: "/pages/order/index"
    })
  },
  toAddress() {
    wx.navigateTo({
      url: "/pages/address/index"
    })
  },
  getSign(e){
    this.setData({
      isSign:true
    });       
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/score/today-signed',
      data:{
        token: app.globalData.token
      },
      success:res=>{
        if(res.code==0){
          this.setData({
            score_sign_continuous:2
          })
        }
      }
    })
  },
  relogin() {
    wx.authorize({
      scope: 'scope.userInfo',
      success() {
        app.globalData.token = null;
        app.login();
        wx.showModal({
          title: '提示',
          content: '重新登陆成功',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              this.onShow();
            }
          }
        })
      },
      fail(res) {
        console.log(res);
        wx.openSetting({});
      }
    })
  },
  getPhoneNumber(e){
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: '无法获取手机号码',
        showCancel: false
      })
      return;
    } 
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/wxapp/bindMobile',
      data:{
        token: app.globalData.token,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success:res=>{
        if(res.data.code == 0) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
          that.getUserApiInfo();
        } else {
          wx.showModal({
            title: '提示',
            content: '绑定失败',
            showCancel: false
          })
        }
      }
    })
  },
  showAboutus(){
    wx.showModal({
      title: '关于我们',
      content: '深圳市意龙通信有限公司（以下简称“意龙”），成立于2011年11月，投资总额超过3亿元人民币，主要用于技术研发费用、设备实验室建立与生产基地建设。总部位于深圳市福田区香林路富春东方大厦302A，是一家专注于研发和生产具备“三防军工品质”产品企业，致力于为客户提供最安全可靠的三防产品和服务方案。',
      showCancel:false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // getUserInfo: function (e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
  onLoad: function (options) {
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求  
          // console.log(res.code)
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    // let that = this;    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    
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
    // this.getSign();
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

  },
  navigateTo(){

  }
})