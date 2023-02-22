
const app = getApp();

const func = require('../../../utils/func');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    no_more: false,
    isLoading: true // 是否正在加载中
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
		this.getList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
		let that = this; // 已经是最后一页
		
		if (that.page >= that.list.last_page) {
		    that.setData({
		        no_more: true
		    });
		    return false;
		} // 加载下一页列表
		
		that.getPageData(true, ++that.page);
    },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  getList(isPage, page) {
    let _this = this;
    page = page || 1
     app._requestApi(
      _this,
      app.globalData.config.apiget_book_list,
      {
        typeid:129 ,    //后台留言表单id
        page,
        pagesize:10
      }, function(res) {
        if (res.code == 1) {
            if (isPage == true) {
                let dataList = _this.list;
            
                _this.setData({
                    'list.data': dataList.data.concat(res.data.list.data),
                    isLoading: false
                });
            } else {
                let list = res.data.list;
            
                _this.setData({
                    list,
                    isLoading: false
                });
            }
        } else {
            app.showError(res.data.msg, function () {
               wx.navigateTo({
                 url: "/pages/user/subscribe/index",
               })
            });
        }
      }
    )
  },
  cancelsubscribe(e) {
    let _this = this;
    app._requestApi(
    _this,
    app.globalData.config.apicancelbook,
    {
      aid:e.currentTarget.dataset.aid
    }, 
      function (res) {
        _this.getList()
        wx.showToast({
          title: '取消成功',
          icon: 'success',
          duration: 1000
        })
      },
      function (res) {
          app.showError(res.msg);
      }
  )		
  },
  jumpView(e) {
    wx.navigateTo({
      url:`./detail?aid=${e.currentTarget.dataset.aid}`
    })
  },
})