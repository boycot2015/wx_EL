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
    isShowMsk: false,
    buyType:'buy',
    shopCartData:{},
    selNum:1,
    totalCount:0,
    isBack:false,
    canReduce: true,
    canAdd:true
  },
  closePop(){
    this.setData({
      isShowMsk: false,
    })
  },
  popUpCart(){
    this.setData({
      isShowMsk:true,
      buyType: 'cart',
    })
  },
  popUpBuy() {
    this.setData({
      isShowMsk: true,
       buyType: 'buy'
    })
  },
  doAddCart(){
    if (!this.data.type1 && this.data.detailData.properties) {
      wx.showModal({
        title: '提示',
        content: '请选择尺寸!',
        showCancel: false
      })
      return;
    }
    if (!this.data.type2 && this.data.detailData.properties) {
      wx.showModal({
        title: '提示',
        content: '请选择颜色!',
        showCancel: false
      })
      return;
    }
    

    let cartData = this.getCartInfo();
    this.setData({
      shopCartData: cartData,
      totalCount: this.data.selNum + this.data.totalCount
    })
    wx.setStorage({
      key: "cartData",
      data: cartData
    })
    wx.setStorage({
      key: 'totalCount',
      data: this.data.totalCount,
    })
    this.closePop();  
  },
  tapCart(){
    wx.switchTab({
      url: '/pages/shop-cart/index',
    })
  },
  goUnPay(){
    let SettlementData = [];
    let buyData = {};
    buyData.name = this.data.detailData.basicInfo.name;
    buyData.minPrice = this.data.detailData.basicInfo.minPrice;
    buyData.selNum = this.data.selNum;
    buyData.pic = this.data.detailData.basicInfo.pic;
    if (this.data.detailData.properties){
      buyData.type = this.data.detailData.properties[0].name;
    }
    buyData.id = this.data.detailData.basicInfo.id; 
    buyData.color = this.data.selColor;
    buyData.selSize = this.data.selSize;

    SettlementData.push(buyData);
    wx.setStorage({
      key: 'SettlementData',
      data: SettlementData,
    })
    this.closePop();
    wx.navigateTo({
      url: '/pages/unpayed/index',
    })
  },
  getCartInfo(){
    let cartData = {};
    let shopCartData = this.data.shopCartData;    
    cartData.name = this.data.detailData.basicInfo.name;
    cartData.minPrice = this.data.detailData.basicInfo.minPrice;
    cartData.selNum = this.data.selNum;    
    cartData.pic = this.data.detailData.basicInfo.pic;    
    cartData.id = this.data.detailData.basicInfo.id;    
    cartData.isSelect = true; 
    if (this.data.detailData.properties){
      cartData.type = this.data.detailData.properties[0].name;
      cartData.color = this.data.selColor;
      cartData.size = this.data.selSize;
      if (shopCartData instanceof Array) {
        return  this.toAddDifferData(cartData,shopCartData);
      } else if (shopCartData.name) {
        return this.concatData(cartData, shopCartData, shopCartData.name == cartData.name && shopCartData.color == cartData.color && shopCartData.size == cartData.size);
      } else {  
        return cartData;
      }    
    } else if (shopCartData instanceof Array){
      return this.toAddDifferData(cartData, shopCartData);
    } else if (shopCartData.name){
      return this.concatData(cartData, shopCartData,shopCartData.name == cartData.name);  
    }else{
      return cartData
    }   
  },
  concatData(newData,data,limit){
    if (limit) {
      data.selNum += newData.selNum
      return data;
    } else {
      let tempData = [data];
      tempData.push(newData)
      return tempData;
    }
  },
  toAddDifferData(newData, data){
    let canAdd = true;
    data.some((val, index) => {
      if (newData.color) {
        if (val.name == newData.name && val.color == newData.color && val.size == newData.size){
         val.selNum += newData.selNum;
         canAdd = false;
       }
      } else {
        if (val.name == newData.name) {
          val.selNum += newData.selNum;
          canAdd = false;
        }
      }
    })
    if (canAdd) {
      data.push(newData)
    }
    return data;
  },
  selColor(e){
    this.setData({
      selColor: e.currentTarget.dataset.color,
      type2: e.currentTarget.dataset.type,
      currentColorIndex: e.currentTarget.dataset.index
    })
  },
  selSize(e) {
    this.setData({
      selSize: e.currentTarget.dataset.size,
      type1: e.currentTarget.dataset.type,
      currentSizeIndex: e.currentTarget.dataset.index
    })
  },
  addCount(e){
    if (this.data.selNum>=10){
      this.setData({
        canAdd:false,
       
      })
      return
    }else{
      this.setData({
        canAdd: true,
        canReduce: true,
        selNum: ++this.data.selNum
      })
    }
    
  },
  reduceCount() {
    if (this.data.selNum<=1){
      this.setData({
        selNum: 1,
        canReduce: false
      })
      return
    }else{
      this.setData({
        canReduce: true,
        canAdd: true,
        selNum: --this.data.selNum
      })
    }
    
  },
  getData(e){
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/detail',
      data:{id:e.id},
      success:res=>{
        // console.log(res.data.data)
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
    wx.showLoading({
      title: '死命加载中......',
    })
    this.getData(e);
    wx.getStorage({
      key: 'cartData',
      success: res=> {
        this.setData({
          shopCartData: res.data
        })
      },
    })
    wx.getStorage({
      key: 'totalCount',
      success: res => {
        this.setData({
          totalCount: res.data
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    setTimeout(() => {
      this.setData({
        isBack: true
      })
      wx.hideLoading()
    }, 100)
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