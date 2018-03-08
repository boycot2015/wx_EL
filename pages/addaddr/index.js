// pages/addaddr/index.js
var commonCityData = require('../../utils/city.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinces: [],
    citys: [],
    districts: [],
    selProvince: '请选择',
    selCity: '请选择',
    selDistrict: '请选择',
    selProvinceIndex: 0,
    selCityIndex: 0,
    selDistrictIndex: 0
  },
  goBack(){
    wx.navigateBack()
  },
  /**
   * 选择省
   */
  bindPickerProvinceChange(e){
    let selItem = commonCityData.cityData[e.detail.value];
    this.setData({
      selProvince: selItem.name,
      selProvinceIndex: e.detail.value,
      selCity: '请选择',
      selCityIndex: 0,
      selDistrict: '请选择',
      selDistrictIndex: 0
    })
    this.initCityData(2, selItem)
  },
   /**
   * 选择市
   */
  bindPickerCityChange(e) {
    let selItem = commonCityData.cityData[this.data.selProvinceIndex].cityList[e.detail.value];
    this.setData({
      selCity: selItem.name,
      selCityIndex: e.detail.value,
      selDistrict: '请选择',
      selDistrictIndex: 0
    })
    this.initCityData(3, selItem)
  },
  /**
   * 选择区（县）
   */
  bindPickerDistrictChange(e) {
    let selItem = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[e.detail.value];
    if (selItem && selItem.name && e.detail.value) {
      this.setData({
        selDistrict: selItem.name,
        selDistrictIndex: e.detail.value
      })
    }
  },
  /**
   * 初始化城市列表
   */
  initCityData(select,item){
    if(select==1){
      let arr = [];
      for (let i = 0; i < commonCityData.cityData.length; i++) {
        arr.push(commonCityData.cityData[i].name)
      }
      this.setData({
        provinces: arr
      })
    } 
    if(select==2){
      let arr = [];
      let dataArr = item.cityList;
      for (let i = 0; i < dataArr.length; i++) {
        arr.push(dataArr[i].name)
      }
      this.setData({
        citys: arr
      })
    }
    if (select == 3) {
      let arr = [];
      let dataArr = item.districtList;
      for (let i = 0; i < dataArr.length; i++) {
        arr.push(dataArr[i].name)
      }
      this.setData({
        districts: arr
      })
    } 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initCityData(1);
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