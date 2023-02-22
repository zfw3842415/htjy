// pages/course/course.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    page:1,
    id:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.typeid;
    this.data.id =id
    this.pageContentInfo(id);
  },
  pageContentInfo(id) {
    this.data.id = id;
    let _this = this;
    App._requestApi(_this, App.globalData.config.apiListUrl, {
      typeid: id,
      apiChannel: `ekey=1&type=sonself&currentstyle=active&showalltext=on`,
    }, function (res) {
      res.data.apiChannel[1].data = res.data.apiChannel[1].data.filter(res => {
        if (res.id != id) {
          return res;
        }
      })
      let typeid = res.data.apiChannel[1].data[0].typeid;
      let current_channel = res.data.apiChannel[1].data[0].current_channel;
      console.log(current_channel)
      if (current_channel == 6) {
        App._requestApi(_this, App.globalData.config.apiIndexUrl, {
          apiType_1: `ekey=1&typeid=${typeid}&addfields=content&suffix=false`
        }, function (Contentres) {
          let content = Contentres.data.apiType[1].data.content.replace(/<p/g,"<p class='article'")
           content = content.replace(/<span/g,"<span class='sp'")
          _this.setData({
           content:content,
           Channel: res.data.apiChannel[1].data,
            typeid: res.data.apiChannel[1].data[_this.data.index].typeid
          })
          
        })
      } else {
        App._requestApi(_this, App.globalData.config.apiListUrl, {
          typeid: typeid,
          apiList: `ekey=1&page=${_this.data.page}`
        }, function (Contentres) {
          console.log(Contentres)
          _this.setData({
            cotentList: Contentres.data.apiList[1].data,
            Channel: res.data.apiChannel[1].data,
            typeid: res.data.apiChannel[1].data[_this.data.index].typeid,
            last_page:Contentres.data.apiList[1].last_page
          })
          console.log(_this.data)
        })
      }
    });
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
  setListHeight() {
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      tapHeight = Math.floor(rpx * 98), // tap高度
      scrollHeight = systemInfo.windowHeight - tapHeight; // swiper高度
    this.setData({
      scrollHeight
    });
  },
  // onPullDownRefresh: function () {
  //   let _this = this;
  //   _this.data.page = 1
  //   _this.setData({
  //     page: _this.data.page
  //   })
  //   _this.setListHeight(); // 设置文档列表高度
  //   _this.pageContentInfo(_this.data.id); // 获取页面数据
  //   wx.stopPullDownRefresh(); // 停止下拉刷新
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let _this = this;
    // 已经是最后一页
    if (_this.data.page >= _this.data.last_page) {
      _this.setData({
        no_more: true
      });
      return false;
    }
    // 加载下一页列表
    App._requestApi(_this, App.globalData.config.apiListUrl, {
      typeid: _this.data.id,
      apiList: `ekey=1&page=${_this.data.page}`
    }, function (Contentres) {
      console.log(Contentres)
      _this.setData({
        cotentList: [_this.data.contentList,...Contentres.data.apiList[1].data],
        Channel: res.data.apiChannel[1].data,
        typeid: res.data.apiChannel[1].data[_this.data.index].typeid
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  switchTab(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let typeid = _this.data.Channel[index].typeid;
    let current_channel = _this.data.Channel[index].current_channel
    this.data.id = typeid;
    if (current_channel == 6) {
      App._requestApi(_this, App.globalData.config.apiIndexUrl, {
        apiType_1: `ekey=1&typeid=${typeid}&addfields=content&suffix=false`
      }, function (Contentres) {
        let content = Contentres.data.apiType[1].data.content.replace(/<p/g,"<p class='article'")
        content = content.replace(/<span/g,"<span class='sp'")
        content = content.replace(/<img/g,"<img class='image'")
         console.log(content)
        _this.setData({
         content:content,
          typeid: _this.data.Channel[index].typeid
        })
        
      })
    }else{
      App._requestApi(_this, App.globalData.config.apiListUrl, {
        typeid: typeid,
        apiList: 'ekey=1&page=1'
      }, function (Contentres) {
        
        _this.setData({
          cotentList: Contentres.data.apiList[1].data,
          typeid: _this.data.Channel[index].typeid
        })
        console.log(_this.data.cotentList)
      })
    }
  },
})