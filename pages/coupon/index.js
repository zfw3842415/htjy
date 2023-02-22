const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 优惠券列表
    list: [],
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    coupon_type:'1',
    page: 1, // 当前页码
    imgList:[
      {img:'https://img.hainanmyw.cn/uploads/allimg/20220217/7-22021G12325217.jpg', price:'15'},
      {img:'https://img.hainanmyw.cn/uploads/allimg/20220107/9-22010F95A3619.jpg',  price:23.9},
      {img:'https://img.hainanmyw.cn/uploads/allimg/20220107/9-22010F95A3619.jpg',  price:'20'},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 获取领券中心列表
    this.getCouponList();
  },
  
  /** 
   * 点击tab切换 
   */
  swichNav: function(e) {
    let _this = this;
    _this.setData({
      list: {},
      isLoading: true,
      page: 1,
      no_more: false,
      coupon_type: e.currentTarget.dataset.current
    }, function() {
      // 获取优惠券列表
      _this.getCouponList();
    });
  },
  /**
   * 获取领券中心列表
   */
  getCouponList(isPage, page) {
    let _this = this;
    App._requestApi(_this, App.globalData.config.apiGetCouponCenterUrl, {
      page: page || 1,
	  coupon_type:_this.data.coupon_type
    }, result => {
      let resList = result.data.list,
      dataList = _this.data.list;
      resList.data.forEach((value, index) => {
        value["coupon_price"] = parseInt(value["coupon_price"])
        value["show"] = false
      });
      if (isPage == true) {
        _this.setData({
          'list.data': dataList.data.concat(resList.data),
          isLoading: false,
        });
      } else {
        _this.setData({
          list: resList,
          isLoading: false,
        });
      }
      if (resList.data.length > 0 && resList.last_page*resList.per_page >= resList.total && resList.current_page == resList.last_page) {
        this.setData({
          no_more: true
        });
      }
    });
  },
      /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    let _this = this;
    _this.getCouponList();
  },
  onReachBottom: function () {
    // 已经是最后一页
    if (this.data.page >= this.data.list.last_page) {
      this.setData({
        no_more: true
      });
      return false;
    }
    // 加载下一页列表
    this.getCouponList(true, ++this.data.page);
  },
  // 使用规则展示更多
  showList(e) {
    let _this = this
    let  index= e.currentTarget.dataset.index
    let  show= _this.data.list.data[index].show
    _this.setData({
      ['list.data.[' + index + '].show']:!show,
  })
  },
  /**
   * 领取优惠券
   */
  receiveTap: function(e) {
    let _this = this;
    App._requestApi(_this, App.globalData.config.apiGetCouponUrl, {
      coupon_id: e.currentTarget.dataset.couponid
    }, function(result) {
      if(1 == result.code){
        let dataList = _this.data.list.data
        dataList[e.currentTarget.dataset.index].geted = 1
        _this.setData({
          'list.data':dataList
        })
        wx.showToast({
          title: result.msg,
          icon: 'success',
          duration: 1000
        })
      }
    });
  }



});