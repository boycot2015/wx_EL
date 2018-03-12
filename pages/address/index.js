// pages/address/index.js
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    addrData:[],
    isSelectPage:true
  },
  addAddr() {
    wx.removeStorage({
      key: 'editData',
      success: function(res) {
        wx.navigateTo({
          url: '/pages/addaddr/index',
        })
      }
    })  
  },
  editAddr(e){
    wx.getStorage({
      key: 'addrData',
      success: function(res) {
        res.data.map((val,i)=>{
          if(e.currentTarget.dataset.index==i){
            wx.setStorage({
              key: 'editData',
              data: val,
            })
          }
        })
        wx.navigateTo({
          url: '/pages/addaddr/index',
        })
      }
    })
  },
  goBack(e){
    wx.getStorage({
      key: 'addrData',
      success: res=>{
        res.data.map(val=>{
          if(e.currentTarget.dataset.id==val.id){
            val.isSelect = true;
          }else{
            val.isSelect = false;
          }
        })
        wx.setStorage({
          key: 'addrData',
          data: res.data
        })
        this.setData({
          addrData: res.data
        })
        // wx.redirectTo({
        //   url: '/pages/unpayed/index',
        // })
          wx.navigateTo({
            url: '/pages/unpayed/index',
          })  
      }
    })
  },
  getData(){
    let addrArr = wx.getStorageSync('addrData');
    this.setData({
      addrData: addrArr
    })
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getData();
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
    this.getData();
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