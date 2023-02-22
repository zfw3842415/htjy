// pages/user/subscribe/detail.js
const app = getApp();
	
const func = require('../../../utils/func');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    add_time:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      aid:options.aid
    })
    this.getPageData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  getPageData() {
      let _this = this;
      app._requestApi(
        _this,
        app.globalData.config.apigetbookdetail,
        {
          aid:_this.data.aid,   
        }, function(res) {
          _this.setData({
            list:res.data.list.list,
            add_time:res.data.list.data.add_time
          })
        }
      )
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
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})