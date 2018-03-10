// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderTabList: ['待付款', '待发货', '待收货', '待评价', '已完成'],
    orderList:[],
    currentIndex:0
  },
  changeTab(e){
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
    // console.log(this.data.currentIndex)
    
  },
  cancelOrder(e){
    let index = e.currentTarget.dataset.index;
    wx.getStorage({
      key: 'orderData',
      success: res=> {
        res.data.map((val,i)=>{
          if (index==i){
            res.data.splice(i,1)
          }
        })
        wx.setStorage({
          key: 'orderData',
          data: res.data,
        })
        wx.setStorage({
          key: 'SettlementData',
          data: res.data,
        })
        this.setData({
          orderList:res.data
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'orderData',
      success: res=> {
        this.setData({
          orderList:res.data
        })
      },
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