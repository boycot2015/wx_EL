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
    totalCount:0,


    startX: 0, //开始坐标
    startY: 0,
    isTouchMove:false
  },
  //点击购物车商品查看商品详情
  toDetail(e){
    wx.navigateTo({
      url: '/pages/goodsdetail/index?id='+e.currentTarget.dataset.id,
    })
  },
  //结算
  toUnPayed(){
    if (!this.data.totalPrice){
      return;
    }
    let SettlementData = [];
    this.data.goodsList.map(val => {
      if (val.isSelect) {
        SettlementData.push(val);
      }
    })
    wx.setStorage({
      key: 'SettlementData',
      data: SettlementData,
    })
    wx.navigateTo({
      url: '/pages/unpayed/index',
    })
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
    // console.log(e.target.dataset)
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
      // console.log(isSelectAll)
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
    wx.setStorage({
      key: 'cartData',
      data: this.data.goodsList
    })
  },
  turnToHome(){
   wx.switchTab({
     url: '/pages/index/index',
   })
  },
  //改变商品数量
  changeCount(option){
    let selnum = option.selnum;
    let color = option.color;
    let name = option.name;
    let tempPrice = 0;
    let canSum = true;
    option.data.map(val => {
      if (val.selNum == selnum && name == val.name && val.colorOrSize == color) {
        if(option.way=='add'){
          val.selNum += 1;
          tempPrice = val.minPrice;
          if (!val.isSelect) {
            canSum = false
          }
        }else{
          val.selNum -= 1;
          tempPrice = -val.minPrice;
          if (!val.isSelect) {
            canSum = false
          }
        }
      }
    })

      this.setData({
        totalPrice: canSum ? this.data.totalPrice + tempPrice : this.data.totalPrice,
        goodsList: this.data.goodsList,
        totalCount: option.way ? ++this.data.totalCount : --this.data.totalCount
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
  //增加商品数量
  addCount(e) {
    if (e.target.dataset.selnum>=10){
      return
    }
    this.changeCount({
      selnum: e.target.dataset.selnum,
      color: e.target.dataset.color,
      name:e.target.dataset.name,
      data: this.data.goodsList,
      way:'add'
    })
   
  },
  //减少商品数量
  reduceCount(e) {
    if (e.target.dataset.selnum <=1) {
      return
    }
    this.changeCount({
      selnum: e.target.dataset.selnum,
      color: e.target.dataset.color,
      name: e.target.dataset.name,
      data: this.data.goodsList
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
          val.isSelect = true;
        })
        this.setData({
          selectAll: true,
          totalPrice,
          goodsList:this.data.goodsList
        })
        wx.setStorage({
          key: 'cartData',
          data: this.data.goodsList
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
    this.getData()
    this.data.goodsList.forEach((v,i)=>{
      v.isTouchMove = false
    })
    this.setData({
      goodsList: this.data.goodsList
    })
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      isTouchMove:false
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
      
    that.data.goodsList.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    this.setData({
      goodsList: this.data.goodsList
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除该商品？',
      success:res=>{
        if(res.confirm){
          
          let newTotalPrice = 0;
          let delCount = 0;
          // console.log(this.data.goodsList)
          this.data.goodsList.map((val,i)=>{
            if (e.currentTarget.dataset.index==i){
              delCount = val.selNum;             
            }else if(val.isSelect){
              newTotalPrice += val.selNum * val.minPrice;
            }
          })          
          this.setData({
            totalCount: this.data.totalCount - delCount,
            totalPrice: newTotalPrice
          })     
          this.data.goodsList.splice(e.currentTarget.dataset.index, 1)
          this.setData({
            goodsList: this.data.goodsList
          })
          wx.setStorage({
            key: 'cartData',
            data: this.data.goodsList
          })
          wx.setStorage({
            key: 'totalCount',
            data: this.data.totalCount
          })
        }else if(res.cancel){
          this.data.goodsList.map((val, i) => {
            val.isTouchMove = false;
          }) 
          this.setData({
            goodsList: this.data.goodsList
          }) 
        }
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