// pages/category/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[],
    selectAll:true,
    totalPrice: 0,
    totalCount:0
  },
  //全选
  changeSelectAll(){
    let totalPrice = 0;
    this.data.goodsList.map(val => {
      val.isSelect = !this.data.selectAll;
      totalPrice += val.selNum*val.minPrice;
    })
    this.setData({
      selectAll: !this.data.selectAll,
      goodsList: this.data.goodsList
    })
    this.data.selectAll ? this.setData({
      totalPrice: totalPrice
    }) : this.setData({
        totalPrice: 0
    })
  },
  //单选
  changeSelect(e) {
    console.log(e.target.dataset)
    let isSelectAll = true;
    let tempPrice = 0;
    this.data.goodsList.map((val,index) => {
      if (e.target.dataset.index==index) {
        val.isSelect = !val.isSelect;
        if (val.isSelect == false) {
          isSelectAll = false;
          tempPrice = -val.selNum * val.minPrice;
        } else {
          tempPrice = val.selNum * val.minPrice;
        }
      }else if (val.isSelect == false){
          isSelectAll = false;
        }    
    })
    if (isSelectAll){
      console.log(isSelectAll)
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
      totalPrice: this.data.totalPrice + tempPrice
    })
  },
  turnToHome(){
   wx.switchTab({
     url: '/pages/index/index',
   })
  },
  //增加商品数量
  addCount(e) {
    let selnum = e.target.dataset.selnum;
    let color = e.target.dataset.color;
    let name = e.target.dataset.name;
    let tempPrice = 0;
    this.data.goodsList.map(val=>{
      if (val.selNum == selnum && name == val.name && val.colorOrSize == color){
        val.selNum +=1;
        tempPrice =  val.minPrice;
      }
    })
    this.setData({
      totalPrice: this.data.totalPrice + tempPrice,
      goodsList: this.data.goodsList,
      totalCount: ++this.data.totalCount
    })
    wx.setStorage({
      key: 'cartData', 
      data: this.data.goodsList
    })
    
    wx.setStorage({
      key: 'totalCount',
      data: this.data.totalCount
    })
   
  },
  //减少商品数量
  reduceCount(e) {
    let selnum = e.target.dataset.selnum;
    let color = e.target.dataset.color;
    let name = e.target.dataset.name;
    let tempPrice = 0;
    this.data.goodsList.map(val => {
      if (val.selNum == selnum && name == val.name && val.colorOrSize == color) {
        val.selNum -= 1;
        tempPrice = val.minPrice;
        if (val.selNum<1){
          val.selNum = 1;
          tempPrice = 0;
        }
      }
    })
    console.log(this.data.totalPrice-tempPrice)
    this.setData({
      totalPrice: this.data.totalPrice - tempPrice,
      goodsList: this.data.goodsList,
      totalCount: tempPrice ? --this.data.totalCount : this.data.totalCount
    })
    wx.setStorage({
      key: 'cartData',
      data: this.data.goodsList
    })
    wx.setStorage({
      key: 'totalCount',
      data: this.data.totalCount
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
        let totalPrice = 0;
        this.data.goodsList.map(val => {
          totalPrice += val.selNum * val.minPrice;
        })
        this.setData({
          selectAll: true,
          totalPrice
        })
      },
    })
    wx.getStorage({
      key: 'totalCount',
      success: res => {
        this.setData({
          totalCount:res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
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