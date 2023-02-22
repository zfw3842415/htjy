/**
 * 易优CMS
 * ============================================================================
 * 版权所有 2016-2028 海南赞赞网络科技有限公司，并保留所有权利。
 * 网站地址: http://www.eyoucms.com
 * ----------------------------------------------------------------------------
 * 如果商业用途务必到官方购买正版授权, 以免引起不必要的法律纠纷.
 * ============================================================================
 * Author: 小虎哥 <1105415366@qq.com>
 * Date: 2020-1-1
 */

let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    historySearch: [], // 历史搜索列表
    keywords: '', // 搜索关键词
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getHistorySearch(); // 历史搜索列表
  },
  /**
   * 搜索关键词
   */
  getSearchKeywords: function (e) {
    this.data.keywords = e.detail.value;
  },
  /**
   * 历史搜索列表
   */
  getHistorySearch: function () {
    let historySearch = wx.getStorageSync('historySearch');
    this.setData({
      historySearch
    });
  },
  /**
   * 清空历史搜索
   */
  clearSearch: function () {
    wx.removeStorageSync('historySearch');
    this.getHistorySearch();
  },
  /**
   * 搜索事件触发
   */
  searchSubmit: function () {
    let _this = this;
    if (_this.data.keywords) {
      let historySearch = wx.getStorageSync('historySearch') || []; // 获得搜索历史记录
      let index = historySearch.indexOf(_this.data.keywords);
      if (index > -1) {
        historySearch.splice(index, 1);
      }
      historySearch.unshift(_this.data.keywords);
      wx.setStorageSync('historySearch', historySearch)
      wx.navigateTo({
        url: '/pages/search/list?keywords=' + _this.data.keywords,
      })
    }
  },
  /**
   * 跳转到最近搜索
   */
  jumpSearch: function (e) {
    wx.navigateTo({
      url: '/pages/search/list?keywords=' + e.target.dataset.text,
    })
  },
})