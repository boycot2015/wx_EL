// pages/category/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[],
    selectAll:true,
    totalCount: 0
  },
  changeSelectAll(){
    let totalCount = 0;
    this.data.goodsList.map(val => {
      val.isSelect = !this.data.selectAll;
      totalCount += val.selNum*val.minPrice;
    })
    this.setData({
      selectAll: !this.data.selectAll,
      goodsList: this.data.goodsList
    })
    this.data.selectAll ? this.setData({
      totalCount: totalCount
    }) : this.setData({
        totalCount: 0
    })
  },
  changeSelect(e) {
    console.log(e.target.dataset)
    let isSelectAll = true;
    let tempCount = 0;
    this.data.goodsList.map((val,index) => {
      if (e.target.dataset.index==index) {
        val.isSelect = !val.isSelect;
        if (val.isSelect == false) {
          isSelectAll = false;
          tempCount = -val.selNum * val.minPrice;
        } else {
          tempCount = val.selNum * val.minPrice;
        }
      }
      
    })
    if (isSelectAll){
      this.setData({
        selectAll: true
      })
    }else{
      this.setData({
        selectAll: false
      })
    }
    this.setData({
      goodsList: this.data.goodsList,
      totalCount: this.data.totalCount + tempCount
    })
  },
  turnToHome(){
   wx.switchTab({
     url: '/pages/index/index',
   })
  },

  addCount(e) {
    let selnum = e.target.dataset.selnum;
    let color = e.target.dataset.color;
    let name = e.target.dataset.name;
    this.data.goodsList.map(val=>{
      if (val.selNum == selnum && name == val.name && val.colorOrSize == color){
        val.selNum +=1;
      }
    })
    wx.setStorage({
      key: 'cartData',
      data: this.data.goodsList
    })
    this.setData({
      goodsList: this.data.goodsList
    })
  },
  reduceCount(e) {
    let selnum = e.target.dataset.selnum;
    let color = e.target.dataset.color;
    let name = e.target.dataset.name;
    this.data.goodsList.map(val => {
      if (val.selNum == selnum && name == val.name && val.colorOrSize == color) {
        val.selNum -= 1;
        if (val.selNum<=1){
          val.selNum = 1;
        }
      }
    })
    wx.setStorage({
      key: 'cartData',
      data: this.data.goodsList
    })
    this.setData({
      goodsList: this.data.goodsList
    })
  },

  getData(){
    wx.getStorage({
      key: 'cartData',
      success: res => {
        // console.log(res.data)
        if (res.data instanceof Array) {
          this.setData({
            goodsList: res.data
          })
        } else {
          this.setData({
            goodsList: [res.data]
          })
        }
        this.data.goodsList.map(val=>{
          this.setData({
            totalCount:this.data.totalCount+=val.selNum * val.minPrice
          })
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getData()
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
    wx.getStorage({
      key: 'cartData',
      success: res => {
        // console.log(res.data)
        if (res.data instanceof Array) {
          this.setData({
            goodsList: res.data
          })
        } else {
          this.setData({
            goodsList: [res.data]
          })
        }
      },
    })
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