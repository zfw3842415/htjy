const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 选项卡标示
    dataType: '0',

    // 列表高度
    swiperHeight: 0,
 
    // 优惠券列表
    list: [],
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中

    page: 1, // 当前页码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 获取优惠券列表
    this.getCouponList();
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
   * 获取优惠券列表
   */
  getCouponList(isPage, page) {
    let _this = this;
    App._requestApi(_this, App.globalData.config.apiGetMyCouponUrl, {
      page: page || 1,
      dataType: _this.data.dataType
    }, result => {
      let resList = result.data.list
      resList.data.forEach((value, index) => {
        value["show"] = false,
        value["coupon_price"] = parseInt(value["coupon_price"])
      });
      let  dataList = _this.data.list;
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
      dataType: e.currentTarget.dataset.current
    }, function() {
      // 获取优惠券列表
      _this.getCouponList();
    });
  },
  /**
   * 菜单列表导航跳转
   */
  onTargetMenus(e) {
    wx.navigateTo({
      url: '/' + e.currentTarget.dataset.url
    })
  },
});