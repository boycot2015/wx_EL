//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    swiperCurrent: 0,
    selectCurrent: 0,
    activeCategoryId: 0,
    searchInput:'',
    goods:[],
    isBack:false
  },
  toGoodsDetail(e){
    wx.navigateTo({
      url: '/pages/goodsdetail/index?id='+e.currentTarget.dataset.id,
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  onHide(){
    this.setData({
      autoplay:false
    })
  },
  onShareAppMessage: function (res) {
    wx.showShareMenu({
      withShareTicket: true
    })
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      success: function (res) {
        // 转发成功
        // wx.hideShareMenu()
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  swiperchange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  tapBanner(e){
    console.log(this.data.banners)
    wx.navigateTo({
      url: '/pages/goodsdetail/index?id=' + e.currentTarget.dataset.id,
    })
  },
  tabClick(e){
    this.setData({
      activeCategoryId: e.currentTarget.id
    });
    this.getGoodsList(e.currentTarget.id);
    // this.setData({
    //   searchInput:e.
    // })
  },
  onShow(){
    this.setData({
      autoplay: true
    })
  },
  onLoad: function () {
    var that = this;
    
    wx.setNavigationBarTitle({
      title:'EL商城' 
    })
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              // wx.startRecord()
            }
          })
        }
      }
    })
    /*
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    */
    wx.showLoading({
      title: '加载中......'
    })
    wx.startPullDownRefresh()
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/banner/list',
      data: {
        key: 'mallName'
      },
      success: function (res) {
        
        if (res.data.code == 404) {
          wx.showModal({
            title: '提示',
            content: '请在后台添加 banner 轮播图片',
            showCancel: false
          })
        } else {
          that.setData({
            banners: res.data.data
          });
        }
      }
    })


    //获取商品列表
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/category/all',
      success: function (res) {
        
        var categories = [{ id: 0, name: "全部" }];
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            categories.push(res.data.data[i]);
          }
        }
        that.setData({
          categories: categories,
          activeCategoryId: 0
        });
        that.getGoodsList(0);
        that.setData({
          isBack: true
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 100)
      }
    })
    
  },
  getGoodsList: function (categoryId) {
    if (categoryId == 0) {
      categoryId = "";
    }
    // console.log(categoryId)
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/list',
      data: {
        categoryId: categoryId,
        // nameLike: that.data.searchInput
      },
      success: function (res) {
        // console.log(res);
        that.setData({
          goods: [],
          loadingMoreHidden: true
        });
        var goods = [];
        if (res.data.code != 0 || res.data.data.length == 0) {
          that.setData({
            loadingMoreHidden: false,
          });
          return;
        }
        for (var i = 0; i < res.data.data.length; i++) {
          goods.push(res.data.data[i]);
        }
        that.setData({
          goods: goods,
        });
      }
    })
  }
})
