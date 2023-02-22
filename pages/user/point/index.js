// pages/user/point/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList:[
      {label:'全部', value:'all'},
      {label:'收入', value:'income'},
      {label:'支出', value:'pay'}
    ],
    List:[
      {label:'登录赠送积分', time:'2022.02.14 18:30', num:'+2'},
      {label:'购买赠送积分', time:'2022.02.14 18:30', num:'+2'},
      {label:'商品抵扣积分', time:'2022.02.14 18:30', num:'-2'},
    ],
    ChangeType:'all'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  //状态筛选
  changValue(e) {
    let _this = this
    _this.setData({
      ChangeType:e.currentTarget.dataset.value
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})