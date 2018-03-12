// pages/unpayed/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasAddr:false,
    addrData:'',
    goodsList:[],
    tips:''
  },
  getAddr(){
    wx.navigateTo({
      url: this.data.hasAddr ? '/pages/address/index' : '/pages/addaddr/index',
    })
  },
  getTips(e){
    console.log(e.detail.value)
    this.setData({
      tips:e.detail.value
    })
  },
  getTime(){
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    let hour = new Date().getHours();
    let min = new Date().getMinutes();
    let second = new Date().getSeconds();
    return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + second
  },

  submitOrder(e) {
    if (!this.data.totalPrice||!this.data.hasAddr){
      return;
    }
    let time = this.getTime();
    let orderData = [];
    let orderDataObj = {}
    let orderNum = 'DD1831008002' + Math.floor(Math.random() * 10);
    orderDataObj.orderData = this.data.goodsList;
    orderDataObj.time = time;
    orderDataObj.orderNum = orderNum;
    orderDataObj.totalPrice = this.data.totalPrice;
    if(this.data.tips){
      orderDataObj.tips = this.data.tips
    }
    orderData.push(orderDataObj);
    // console.log(e.currentTarget)
    let orderArr = wx.getStorageSync('orderData');
    if (orderArr){
      orderArr.push(orderDataObj);
    }else{
      orderArr = orderData;
    }
    wx.setStorage({
      key: 'orderData',
      data: orderArr,
    })
    wx.navigateTo({
      url:'/pages/order/index' 
    })
  },

  getData(){
    wx.getStorage({
      key: 'SettlementData',
      success: res => {
        // console.log(res.data)
        let totalPrice = 0;
        res.data.map(val => {
          totalPrice += val.selNum * val.minPrice
        })
        this.setData({
          totalPrice,
          goodsList: res.data
        })
      }
    })
    let addrArr = wx.getStorageSync('addrData');
    if(addrArr){
      let addrObj = {};
      addrArr.map(val => {
        if (val.isSelect) {
          this.setData({
            hasAddr: true,
            addrData: val
          })
          // console.log(this.data.addrData)          
        }
      })     
    }
    if(!this.data.hasAddr){
      wx.removeStorage({
        key: 'editData',
        success: function(res) {
          wx.showModal({
            title: '提示',
            content: '还没有收货地址，请填写收货地址！',
            success: res => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/addaddr/index'
                })
              }
            }
          })
        },
      })
      
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getData()
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
    this.getData()
    
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