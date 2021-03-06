// pages/addaddr/index.js
const app = getApp()
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
    selDistrictIndex: 0,
    addrData:''
  },
  goBack(){
    wx.navigateBack()
  },
  getAddrFromWx(){
    wx.chooseAddress({
      success: res=> {
        // console.log(res);
        this.setData({
          addrData:res,
          selProvince: res.provinceName,
          selCity: res.cityName,
          selDistrict: res.countyName
        })
        this.setIndex();
      }
    })
  },
  deletAddr(e){
    wx.getStorage({
      key: 'addrData',
      success: function(res) {
        res.data.map((val,i)=>{
          if(e.currentTarget.dataset.id==val.id){
            res.data.splice(i,1);
            wx.setStorage({
              key: 'addrData',
              data: res.data
            })
          }
        })
        wx.showLoading({
          title: '加载中',
          success:res=>{
            wx.navigateBack({})
            wx.hideLoading()          
          }
        })
      }
    })
  },
  setIndex(){
    let provinceName = this.data.selProvince, cityName = this.data.selCity,countyName = this.data.selDistrict;
    commonCityData.cityData.map((val,i)=>{
      if (val.name == provinceName){
        this.setData({
          selProvinceIndex: i
        })
        val.cityList.map((val,i)=>{
          if(val.name == cityName){
            this.setData({
              selCityIndex: i
            })
            val.districtList.map((val,i)=>{
              if (val.name == countyName){
                this.setData({
                  selDistrictIndex: i
                })
              }
            })
          }
        })
      }
    })
  },
  saveAddr(e){
    let addrData = e.detail.value;
    addrData.selProvince = this.data.selProvince;
    addrData.selCity = this.data.selCity;
    addrData.selDistrict = this.data.selDistrict;
    if (!addrData.userName){
      wx.showModal({
        title: '提示',
        content: '请填写姓名!',
        showCancel: false
      })
      return
    }
    // console.log(/^0\d{2,3}-?\d{7,8}$/.test(addrData.telNumber))
    if (!addrData.telNumber || !(/^[1][3,4,5,7,8][0-9]{9}$/.test(addrData.telNumber) || /^0\d{2,3}-?\d{7,8}$/.test(addrData.telNumber))){
      wx.showModal({
        title: '提示',
        content: '请填写正确的手机号!',
        showCancel: false
      })
      return
    }
    if (this.data.selProvince == '请选择' || this.data.selCity == '请选择' || this.data.selDistrict == '请选择') {
      wx.showModal({
        title: '提示',
        content: '请选择地区!',
        showCancel: false
      })
      return
    }
    if (!addrData.detailInfo) {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址!',
        showCancel: false
      })
      return
    }
    
    if (!addrData.postalCode) {
      wx.showModal({
        title: '提示',
        content: '请填写邮政编码!',
        showCancel: false
      })
      return
    }
    this.setIndex();
    let cityId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].id;
    let districtId = '';
    if (this.data.selDistrict == "请选择" || !this.data.selDistrict || this.data.selDistrict=="直辖区") {
      districtId = '';
    } else {
      districtId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[this.data.selDistrictIndex].id;
    }
    let apiAddWay = "add";    
    var apiAddid = 0;
    if (apiAddid) {
      apiAddWay = "update";
    } else {
      apiAddid = 0;
    }
    // console.log(apiAddid);

  wx.request({
    url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/shipping-address/' + apiAddWay,
    data: {
      token: app.globalData.token,
      id: 0,
      provinceId: commonCityData.cityData[this.data.selProvinceIndex].id,
      cityId,
      districtId,
      linkMan: addrData.userName,
      address: addrData.detailInfo,
      mobile: addrData.telNumber,
      code: addrData.postalCode,
      isDefault: 'true'
    },
    success:res=>{
        // console.log(res)
        if(res.data.code!=0){
          // wx.showModal({
          //   title: '提示',
          //   content: '网络错误，请稍后重试!',
          //   showCancel: false
          // })       
        }  
        let addrArr = wx.getStorageSync('addrData');
        if (addrArr){
          // console.log(addrData);   
          let editData = wx.getStorageSync('editData');       
          if (editData){
            addrData.id = editData.id;
            addrArr.map((val, i) => {
                if (addrData.id == val.id) {
                  addrArr[i] = addrData;
                  if (editData.isSelect){
                    addrArr[i].isSelect = true;
                  }else{
                    addrArr[i].isSelect = false;                                
                  }
              }else{
                val.isSelect = false;
              }
            })
            // console.log(addrArr);
          }else{
            addrData.id = addrArr.length;
            addrData.isSelect = false;
            addrArr.push(addrData);
          }
          wx.setStorage({
            key: 'addrData',
            data: addrArr
          })
        }else{
          addrData.id = 0;
          addrData.isSelect = false;
          wx.setStorage({
            key: 'addrData',
            data: [addrData]
          })
        }
        // console.log(addrArr);
        wx.navigateTo({
          url: '/pages/address/index',
        })
    }
  })
  },
  //省级联动-----------------------------
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
      } else {
        this.setData({
          selDistrict: '直辖区',
          selDistrictIndex: 0
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
        if (!dataArr.length) {
          arr.push('直辖区')
        }else {
        for (let i = 0; i < dataArr.length; i++) {        
            arr.push(dataArr[i].name)
          }
        }
        this.setData({
          districts: arr
        })
      } 
    },
  //--------------------------------------

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.initCityData(1); 
    if(e.id){
      this.setData({
        id: e.id
      })
    }else{
      this.setData({
        id: 0
      })
    }
    wx.getStorage({
      key: 'editData',
      success: res=> {
        this.setData({
          addrData:res.data,
          selProvince: res.data.selProvince,
          selCity: res.data.selCity,
          selDistrict: res.data.selDistrict
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
    wx.removeStorageSync('editData')
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