// pages/goodsdetail/index.js
//index.js
//获取应用实例
const app = getApp()
const WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData:{},
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 1000,
    isShow:false
  },
  closePop(){
    this.setData({
      isShow: false
    })
  },
  popUp(){
    this.setData({
      isShow:true
    })
  },
  getData(e){
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/detail',
      data:{id:e.id},
      success:res=>{
        console.log(res.data.data)
        this.setData({
          detailData: res.data.data
        })
        if(res.data.data.basicInfo.videoId){
          this.getVideoSrc(res.data.data.basicInfo.videoId)
        }
        WxParse.wxParse('article', 'html', res.data.data.content, this, 5);
        this.getCommit(e.id);
      }
    })
  },
  getCommit(goodsId){
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/reputation',
      data:{
        goodsId
      },
      success:res=>{
        if (res.data.data){
          this.setData({
            commitData: res.data.data
          })
        }        
      }
    })
  },
  getVideoSrc(videoId){
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/media/video/detail',
      data:{
        videoId
      },
      success:res=>{
        this.setData({
          videoSrc:res.data.data.fdMp4
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.getData(e)
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