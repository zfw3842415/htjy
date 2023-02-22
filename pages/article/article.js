// pages/article/article.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     let aid = options.aid;
    this.getArtContent(aid)
  },
  getArtContent(aid){
    let _this = this;
    App._requestApi(_this, App.globalData.config.apiViewUrl, {
			aid:aid, // 文档ID
			typeid: _this.data.typeid, // 文档所属的栏目ID
			apiCollect: `ekey=1&type=default`, // 文档是否收藏标签
      apiPrenext: `ekey=1&get=all`, // 文档上下篇标签prenext
			// 这里可以根据需求填写更多的api标签
		}, function (res) {
      console.log(res.data.detail.data)
      let content = res.data.detail.data.content.replace(/<section/g,"<section class='article'")
       content = content.replace(/<p/g,"<p  class='article_p'")
        content = content.replace(/<span/g,"<span class='sp'")
        content = content.replace(/<img/g,"<img class='image'")
        console.log(content)
      _this.setData({
         title:res.data.detail.data.title,
         content:content,
         click:res.data.detail.data.click,
         author:res.data.detail.data.author,
         add_time:res.data.detail.data.add_time
      })
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