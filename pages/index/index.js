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

const App = getApp();
const func = require('../../utils/func.js');
import wxParse from '../../wxParse/wxParse.js'; // 富文本插件

Page({

  data: {
      shop_open:'1',  //1是商城版    2 综合版
      teachers:[
        {img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202106%2F22%2F20210622140718_0b391.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1679552840&t=052f2a6644671ae178852946b27dc185',
        title:'高级导师',
        content:'数学能手，复旦大学数学系教授，擅长数学，物理，化学'
      },
      {img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202106%2F22%2F20210622140718_0b391.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1679552840&t=052f2a6644671ae178852946b27dc185',
        title:'高级导师',
        content:'数学能手，复旦大学数学系教授，擅长数学，物理，化学'
      }
      ,
      {img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202106%2F22%2F20210622140718_0b391.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1679552840&t=052f2a6644671ae178852946b27dc185',
        title:'高级导师',
        content:'数学能手，复旦大学数学系教授，擅长数学，物理，化学'
      },
      {img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202106%2F22%2F20210622140718_0b391.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1679552840&t=052f2a6644671ae178852946b27dc185',
        title:'高级导师',
        content:'数学能手，复旦大学数学系教授，擅长数学，物理，化学'
      },
      {img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202106%2F22%2F20210622140718_0b391.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1679552840&t=052f2a6644671ae178852946b27dc185',
        title:'高级导师',
        content:'数学能手，复旦大学数学系教授，擅长数学，物理，化学'
      }
    ],
    curriculum:[{
      img:'',
      curriculum_p:'13-15岁 少年英语，学习学科知识，初涉英语思维'
    },
    {
      img:'https://img.shida66.com/upload/special_cover_img/2017/08/30/83fecc4b71e33c4f4a1f6a9c7182bae2.jpg',
      curriculum_p:'13-15岁 少年英语，学习学科知识，初涉英语思维'
    },
    {
      img:'https://img.shida66.com/upload/special_cover_img/2017/08/30/83fecc4b71e33c4f4a1f6a9c7182bae2.jpg',
      curriculum_p:'13-15岁 少年英语，学习学科知识，初涉英语思维'
    }],
    environment:[{
      img:'https://img2.baidu.com/it/u=3911597467,3937154002&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500',
      text:'环境一'
    },{
      img:'https://img2.baidu.com/it/u=3911597467,3937154002&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500',
      text:'环境一'
    },{
      img:'https://img2.baidu.com/it/u=3911597467,3937154002&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500',
      text:'环境一'
    },{
      img:'https://img2.baidu.com/it/u=3911597467,3937154002&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500',
      text:'环境一'
    }],
    index:0,
    indexTwo:0,
    indexThree:0,
    indexFour:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let _this = this;
    _this.getPageData(); // 加载页面数据
  },
  /**
   * 生命周期回调—监听页面显示
   */
  onShow() {

  },
  /**
   * 加载页面数据
   */
  getPageData: function () {
    let _this = this;
    App._requestApi(_this, App.globalData.config.apiIndexUrl, {
      apiAdv_1: `ekey=1&pid=7`, // 广告位标签adv
      // apiArclist_1: `ekey=1&channel=1&limit=10`, // 第一个文档列表标签arclist
      apiArclist: `ekey=1&typeid=73&limit=3`, // 第二个文档列表标签arclist
      // apiArclist_3: `ekey=3&typeid=4&limit=4`, // 第三个文档列表标签arclist
      apiType_1: `ekey=1&typeid=69&addfields=content&infolen=100&suffix=false`, // 指定栏目标签type
      apiGlobal: `ekey=1`, // 全局配置变量标签global
      // 这里可以根据需求填写更多的api标签
      apiChannel:`ekey=1&type=top&currentstyle=active&showalltext=on`,
    }, function (res) {
      console.log(res)
      // 特别说明：中括号[1]的数字必须与api标签的参数ekey=1值对应，否则数据对不上。
        let adv_1 = res.data.apiAdv[1], // adv广告位数据
        arclist_1 = res.data.apiArclist[1], // 第一个arclist文档列表数据
        arclist_2 = res.data.apiArclist[2], // 第二个arclist文档列表数据
        arclist_3 = res.data.apiArclist[3], // 第三个arclist文档列表数据
        type_1 = res.data.apiType[1], // type指定栏目数据
        shop_open = res.data.usersConf.shop_open,
        global = res.data.apiGlobal[1], // global全局配置变量数据
        channel = res.data.apiChannel[1].data;
        channel = channel.filter((value)=>{
          if(value.id!=81){
                   return value;
          }
        });
      // html富文本转码
      if (undefined != type_1.data.content) {
        wxParse.wxParse('type_1_content', 'html', type_1.data.content, _this, 0);
      }
      // 设置导航标题
      wx.setNavigationBarTitle({
        title: global.data.web_name || '易优CMS小程序'
      })
      _this.setData({
        adv_1,
        arclist_1,
        arclist_2,
        arclist_3,
        type_1,
        shop_open,
        global,
        channel
      });
    });
    App._requestApi(_this, App.globalData.config.apiIndexUrl, {
      apiAdv_1: `ekey=1&pid=8`,
    },function(res){
      _this.setData({
        adv_2:res.data.apiAdv[1].data[0],
      })
      App._requestApi(_this, App.globalData.config.apiIndexUrl, {
        apiAdv_1: `ekey=1&pid=9`,
      },function(res){
        _this.setData({
          adv_3:res.data.apiAdv[1].data[0],
        })
      });
      App._requestApi(_this, App.globalData.config.apiIndexUrl, {
        apiAdv_1: `ekey=1&pid=10`,
      },function(res){
        _this.setData({
          adv_4:res.data.apiAdv[1].data[0],
        })
      });
    });
    App._requestApi(_this, App.globalData.config.apiListUrl, {
      typeid: 72,
      apiChannel: `ekey=1&type=sonself&currentstyle=active&showalltext=on`,
    },function(res){
      res.data.apiChannel[1].data  = res.data.apiChannel[1].data.filter(res=>{
        if(res.id!=72){
          return res;
        }
      })
      let typeid = res.data.apiChannel[1].data[0].typeid;
      App._requestApi(_this, App.globalData.config.apiListUrl, {
        typeid:typeid,
        apiList:'ekey=1&page=1'
      },function(Contentres){
        _this.setData({
          cotentList:Contentres.data.apiList[1].data,
          newChannel:res.data.apiChannel[1].data,
          typeid:res.data.apiChannel[1].data[_this.data.index].typeid
        })
      })
    });
    App._requestApi(_this, App.globalData.config.apiListUrl, {
      typeid: 80,
      apiChannel: `ekey=1&type=sonself&currentstyle=active&showalltext=on`,
    },function(res){
      res.data.apiChannel[1].data  = res.data.apiChannel[1].data.filter(res=>{
        if(res.id!=80){
          return res;
        }
      })
      let apiChannel = [];
      res.data.apiChannel[1].data.forEach((value,key)=>{
        if(key==0){
          apiChannel[1]=res.data.apiChannel[1].data[key]
        }    
        if(key==1){
           apiChannel[0] = res.data.apiChannel[1].data[key]
        }else{
          apiChannel[key]=res.data.apiChannel[1].data[key]
        }
      })
      let typeid =apiChannel[0].typeid;
      App._requestApi(_this, App.globalData.config.apiListUrl, {
        typeid:typeid,
        apiList:'ekey=1&page=1'
      },function(Contentres){
        _this.setData({
          cotentTwoList:Contentres.data.apiList[1].data,
          newTwoChannel:apiChannel,
          typeTwoid:apiChannel[_this.data.indexTwo].typeid
        })
      })
    });
    App._requestApi(_this, App.globalData.config.apiListUrl, {
      typeid: 82,
      apiChannel: `ekey=1&type=sonself&currentstyle=active&showalltext=on`,
    },function(res){
      
      res.data.apiChannel[1].data  = res.data.apiChannel[1].data.filter(res=>{
        if(res.id!=82){
          return res;
        }
      })
      let typeid = res.data.apiChannel[1].data[0].typeid;
      App._requestApi(_this, App.globalData.config.apiListUrl, {
        typeid:typeid,
        apiList:'ekey=1&page=1'
      },function(Contentres){
        _this.setData({
          cotentThreeList:Contentres.data.apiList[1].data,
          newThreeChannel:res.data.apiChannel[1].data,
          typeThreeid:res.data.apiChannel[1].data[_this.data.indexThree].typeid
        })
      })
    });
    App._requestApi(_this, App.globalData.config.apiListUrl, {
      typeid: 83,
      apiChannel: `ekey=1&type=sonself&currentstyle=active&showalltext=on`,
    },function(res){
      res.data.apiChannel[1].data  = res.data.apiChannel[1].data.filter(res=>{
        if(res.id!=83){
          return res;
        }
      })
      let typeid = res.data.apiChannel[1].data[0].typeid;
      App._requestApi(_this, App.globalData.config.apiListUrl, {
        typeid:typeid,
        apiList:'ekey=1&page=1'
      },function(Contentres){
        _this.setData({
          cotentFourList:Contentres.data.apiList[1].data,
          newFourChannel:res.data.apiChannel[1].data,
          typeFourid:res.data.apiChannel[1].data[_this.data.indexFour].typeid
        })
      })
      App._requestApi(_this, App.globalData.config.apiListUrl, {
        typeid:103,
        apiList:'ekey=1&page=1'
      },function(Contentres){
        console.log(Contentres)
        _this.setData({
          cotentFiveList:Contentres.data.apiList[1].data,
        })
      })
    });
  },
  
  navLink(e) {
    let _this = this 
    let typeid = e.currentTarget.dataset.item.typeid;
    let f_cur = e.currentTarget.dataset.item.f_cur;
    let tips = e.currentTarget.dataset.item.tips;
    let type = e.currentTarget.dataset.item.type;
    if (typeid == 1 ) {
        if (!_this.data.Discountactive || type == 'jifen') {
          wx.showToast({
            icon: 'none',
            title: e.currentTarget.dataset.item.tips,
            duration: 1000
          });
        } else{
          let active_id = _this.data.Discountactive.active_id
          wx.navigateTo({
            url:`/pages/discount/index?active_id=${active_id}`
          })
        }
    } else{
      wx.reLaunch({
        url:`/pages/category/index?typeid=${typeid}&f_cur=${f_cur}`
      })
    }
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    this.getPageData(); // 获取首页数据
    wx.stopPullDownRefresh(); // 停止下拉刷新
  },
  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this;
    return {
      title: _this.data.page.params.title,
      path: "/pages/index/index?" + App.getShareUrlParams()
    };
  },
  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    let _this = this;
    return {
      title: _this.data.page.params.title,
    }
  },
  /**
   * 跳转列表页
   */
  jumpList(e) {
    func.jumpList(e)
  },
  jumproductList(){
    wx.navigateTo({
      url: `/pages/archives/product/list?typeid=3`,
    })
  },
  /**
   * 跳转详情页
   */
  jumpView(e) {
    func.jumpView(e)
  },
  jumpToSearch() {
    wx.navigateTo({
        url: `/pages/search/index`
    });
  },
   /*
   * 跳转到指定页面
   */
  navigationTo:function(e){
    let url = e.currentTarget.dataset.url;
    if (url) {
      func.navigateTo(url)
    }
  },
  /**
   * 点击拨打电话
   */
  makePhoneCall: function (e) {
    let mobile = e.currentTarget.dataset.mobile
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  },
  /**
   * 地图导航
   */
  gomap: function (e) {
    let coordinate = e.currentTarget.dataset.coordinate || '19.992555,110.339932';
    if (coordinate) {
      let address = e.currentTarget.dataset.address || '';
      let map = coordinate.split(',');
      wx.openLocation({
        latitude: parseFloat(map[0]),
        longitude: parseFloat(map[1]),
        address: address
      })
    }
  },
  switchTab(e){
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let typeid = _this.data.newChannel[index].typeid;
    App._requestApi(_this, App.globalData.config.apiListUrl, {
      typeid:typeid,
      apiList:'ekey=1&page=1'
    },function(Contentres){
      console.log(Contentres)
      _this.setData({
        cotentList:Contentres.data.apiList[1].data,
        typeid:_this.data.newChannel[index].typeid
      })
      console.log(_this.data.cotentList)
    })
  },
  switchTabOne(e){
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let typeid = _this.data.newTwoChannel[index].typeid;
    App._requestApi(_this, App.globalData.config.apiListUrl, {
      typeid:typeid,
      apiList:'ekey=1&page=1'
    },function(Contentres){
      console.log(Contentres)
      _this.setData({
        cotentTwoList:Contentres.data.apiList[1].data,
        typeTwoid:_this.data.newTwoChannel[index].typeid
      })
    })
  },
  switchTabThree(e){
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let typeid = _this.data.newThreeChannel[index].typeid;
    App._requestApi(_this, App.globalData.config.apiListUrl, {
      typeid:typeid,
      apiList:'ekey=1&page=1'
    },function(Contentres){
      console.log(Contentres)
      _this.setData({
        cotentThreeList:Contentres.data.apiList[1].data,
        typeThreeid:_this.data.newThreeChannel[index].typeid
      })
    })
  },
  switchTabFour(e){
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let typeid = _this.data.newFourChannel[index].typeid;
    App._requestApi(_this, App.globalData.config.apiListUrl, {
      typeid:typeid,
      apiList:'ekey=1&page=1'
    },function(Contentres){
      console.log(Contentres)
      _this.setData({
        cotentFourList:Contentres.data.apiList[1].data,
        typeFourid:_this.data.newFourChannel[index].typeid
      })
    })
  }
});