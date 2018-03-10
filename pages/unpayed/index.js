// pages/unpayed/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasAddr:false,
    addrData:{},
    goodsList:[]
  },
  getAddr(){
    wx.navigateTo({
      url: this.data.hasAddr ? '/pages/address/index' : '/pages/addaddr/index',
    })
  },
  getTime(){
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let day = new Date().getDay();
    let hour = new Date().getHours();
    let min = new Date().getMinutes();
    let second = new Date().getSeconds();
    return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + second
  },
  submitOrder(e) {
    let time = this.getTime();
    let orderData = [];
    let orderDataObj = {}
    let orderNum = 'dd1831008002' + Math.floor(Math.random() * 10);
    orderDataObj.orderData = this.data.goodsList;
    orderDataObj.time = time;
    orderDataObj.orderNum = orderNum;
    orderDataObj.totalPrice = this.data.totalPrice;
    orderData.push(orderDataObj);
    console.log(orderData)
    
    // orderDataObj.time = 
    wx.setStorage({
      key: 'orderData',
      data: orderData,
    })
    wx.navigateTo({
      url:'/pages/order/index' 
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.getStorage({
        key: 'addrData',
        success: res=> {
          this.setData({
            hasAddr:true,
            addrData:res.data
          })
        },
      })
      wx.getStorage({
        key: 'cartData',
        success: res => {
         let totalPrice = 0;
          res.data.map(val => {
            totalPrice += val.selNum * val.minPrice
           })
          this.setData({
            hasAddr: true,
            totalPrice,
            goodsList: res.data
          })
        } 
      })
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