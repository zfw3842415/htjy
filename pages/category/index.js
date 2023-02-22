// pages/category/index.js
let clicknum = 0;//点击次数默认

const App = getApp();
const func = require('../../utils/func.js');
Page({
      data: {
            channelid: 2,
            // 文档模型ID
            typeid: 20,
            shop_open:1,    //0是企业   1是商城
            // 当前的分类id (0则代表全部)    要选择第一个商品的id
            channelList: [],
            List:[
              {label:'产品展示'},
              {label:'新闻动态'},
              {label:'关于我们'},
              {label:'解决方案'},
              {label:'公司简介'}
            ],
            // 顶部分类列表
            channelList2: [],
            channelListMall:[],
            // 右侧分类列表
            arctypeInfo: [],
  
            // 当前分类信息
            archivesList: [],
  
            // 文档列表
            show: '',
  
            //下拉导航展示   默认隐藏   false
            scrollHeight: null,

            no_more: false,

            // 没有更多数据
            isLoading: true,
  
            // 是否正在加载中
            page: 1,

            // 当前页码
            //分类导航下拉初始值
            uhide: 0,

            // 是否隐藏子栏目导航
            tabScroll: 0,

            currentNav: 0,

            // 展开栏目导航的焦点选中
            beforeCurrentNav: 0,

            // 点击展开栏目导航之前tag的index值
            clickCurrentNav: 0,

            // 点击展开栏目导航tag的index值
            isClickSub: 0,

            // 是否点击子栏目
            subCurrentNav: 0,

            // 子栏目焦点选中
            f_cur: 0,

            orderby: 'add_time',
            //筛选  sale-销量 price-价格
            //筛选排序方式 asc/desc
            orderway: 'desc',
            
            windowHeight: '',
            windowWidth: '',
            isRuleTrue: false,
            notcont: '',
      },
      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
          let that = this;
          if (options.scene) {
              //这里为线上操作
              // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
              let scene = decodeURIComponent(options.scene);
              let typeid = func.getQueryVariable('typeid', scene);
  
              if (!typeid) {
                  that.typeid = that.data.typeid;
              } else {
                  that.typeid = typeid;
              }
  
              let channelid = func.getQueryVariable('channelid', scene);
        
              if (!channelid) {
                  that.channelid = that.data.channelid;
              } else {
                  that.channelid = channelid;
              }
          } else {
              //这里为开发环境
              if (options.typeid !== 'undefined') {
                  if (!options.typeid) {
                      that.typeid = that.data.typeid;
                  } else {
                      that.typeid = options.typeid;
                      that.f_cur = options.f_cur;
                      that.getArchivesList();
                  }
              } 
        if (options.channelid !== 'undefined') {
          if (!options.channelid) {
          
            that.channelid = that.data.channelid;
          } else {
            that.channelid = options.channelid;
          }
        }
          }
  
          that.setData({
              typeid: that.typeid,
              channelid: that.channelid,
              currentNav: that.typeid,
              // 展开栏目导航的焦点选中
              beforeCurrentNav: that.typeid,
              // 点击展开栏目导航之前tag的index值
              clickCurrentNav: that.typeid,
              // 点击展开栏目导航tag的index值
              subCurrentNav: that.typeid // 子栏目焦点选中
          });
        
          that.getPageData(); // 获取页面数据
          //分类下拉导航
  
          wx.getSystemInfo({
              // 获取当前设备的宽高，文档有
              success: (res) => {
                  this.setData({
                      windowHeight: res.windowHeight,
                      windowWidth: res.windowWidth
                  });
              }
          });
      },
      /**
       * 生命周期回调—监听页面显示
       */
      onShow() {},
      /**
       * 下拉刷新
       */
      onPullDownRefresh: function () {
          let that = this;
          that.data.page = 1;
          that.setData({
              page: that.data.page
          });
          that.getPageData(); // 获取页面数据
  
          wx.stopPullDownRefresh(); // 停止下拉刷新
      },
      // 页面上拉触底事件的处理函数
      onReachBottom: function () {
          let that = this; // 已经是最后一页
          console.log(that)
          console.log(that.data.last_page)
          if (that.data.page >= that.data.last_page) {
              that.setData({
                  no_more: true
              });
              return false;
          } // 加载下一页列表
  
          that.getArchivesList2(true, ++that.data.page);
      },
      /**
       * 分享当前页面
       */
      onShareAppMessage() {
          let _this = this; // 构建页面参数
  
          let params = App.globalData.getShareUrlParams({
              typeid: _this.typeid
          });
          return {
              title: _this.arctypeInfo.typename,
              path: '/pages/archives/product/list?' + params
          };
      },
      /**
       * 分享到朋友圈
       */
      onShareTimeline() {
          let _this = this;
  
          return {
              title: _this.arctypeInfo.typename
          };
      },
      /**
       * 
       * 获取页面数据
       */
      getPageData() {
          let _this = this;
          App._requestApi(_this, App.globalData.config.apiIndexUrl, {
            apiType: `ekey=1&type=self`,
          },
          function (res) {
            let shop_open = res.data.usersConf.shop_open;
            _this.setData({
                shop_open: shop_open
            });
            if (shop_open == 1) {
              _this.getArchivesList_mall(); // 获取商城文档列表
            } else {
                _this.getArchivesList(); // 获取网站文档列表
            }
            // _this.getArchivesList(); // 获取网站文档列表
          }
        );
      },
      getArchivesList_mall() {
        let _this = this;
        // page = page || 1;
        App._requestApi(_this, App.globalData.config.apiListUrl,
          {
            apiChannel:	`ekey=1&type=sonself&typeid=81`
          },
          function (res) {
            let channel_1 = res.data.apiChannel[1];
            let channelList = channel_1.data; // 设置导航标题
            wx.setNavigationBarTitle({
                title:'全部列表'
            });
            _this.setData({
                channelListMall: channelList,
                typeid:res.data.apiChannel[1].data[0].typeid
            });
            _this.getArchivesList2();
          }
        );
        
      },
      getArchivesList() {
        let _this = this;
        let page = 1;
        App._requestApi(_this, App.globalData.config.apiListUrl,
          {
            apiType: `ekey=1&type=self`,
            apiChannel: `ekey=1&limit=100&type=tree` // 栏目列表标签channel
          },
          function (res) {
            let channel_1 = res.data.apiChannel[1];
            let // channel栏目列表数
                type_1 = res.data.apiType[1]; // type指定栏目数据
            // 特别说明：中括号[1]的数字必须与api标签的参数ekey=1值对应，否则数据对不上。
            let arctypeInfo = type_1.data;
            let channelList = channel_1.data; // 设置导航标题
            wx.setNavigationBarTitle({
                title: arctypeInfo.typename || '全部列表'
            });
            _this.setData({
                arctypeInfo: arctypeInfo,
                channelList: channelList
            });
          }
        );
      },
      getArchivesList2(isPage, page) {
        let _this = this;
        let orderby = _this.data.orderby;
        let orderway = _this.data.orderway;
        page = page || 1;
        App._requestApi(_this, App.globalData.config.apiListUrl,
        {
          channelid: _this.data.channelid,
          // 模型ID
          typeid: _this.data.typeid,
          // 栏目ID
          apiList: `ekey=1&page=${page}&orderby=${orderby}&orderway=${orderway}`,
          apiChannel: `ekey=1&type=son&channelid=2&showalltext=on` ,// 栏目列表标签channel
        },
        function (res) {
          console.log(res)
          let resList = res.data.apiList[1];
          let  channel_2 = res.data.apiChannel[1];
          let   dataList = _this.data.archivesList; // 每次下拉分页之后的所有文档列表
          if (isPage == true) {
              _this.setData({
                  archivesList: dataList.concat(resList.data),
                  isLoading: false
              });
          } else {
            let channelList2 = [];
            if(channel_2.data.length > 1){
                channelList2 = channel_2.data;
            }else{
                channelList2 = _this.data.channelList2;
            }
            let ResList = resList.data; //商品详情列表
            _this.setData({
                channelList2: channelList2,
                archivesList: ResList,
                isLoading: false,
                last_page:resList.last_page
            });
          }
        });
      },
      /**
       * 切换导航栏
       */
      onSwitchTab: function (e) {
          let that = this; // 第一步：切换当前的分类id

          that.setData({
              typeid: e.currentTarget.dataset.id,
              f_cur: e.currentTarget.dataset.index,
              archivesList: {},
              page: 1,
              no_more: false,
              isLoading: true
          }); // 第二步：更新当前的文档列表
    
          that.getArchivesList_mall();
      },

      onSwitchTwo(e) {
          let _this = this; // 第一步：切换当前的分类id
          _this.setData({
              typeid: e.currentTarget.dataset.id,
              typeindex:e.currentTarget.dataset.index,
              archivesList: {},
              page: 1,
              no_more: false,
              isLoading: true
          }); // 第二步：更新当前的文档列表
          wx.setNavigationBarTitle({
            title:_this.data.channelList2[_this.data.typeindex].typename
         });
          _this.getArchivesList2();
      },
      // 筛选
      orderbyClick(e) {
        let _this = this;
        let orderby = e.currentTarget.dataset.orderby;
        if('users_price' == orderby){
          let price_order = _this.data.orderway;
          console.log(price_order)
          if('' == price_order){
            _this.setData({
              orderway:'asc'
            })
          }else if('asc' == price_order){
            _this.setData({
              orderway:'desc'
            })
          }else if('desc' == price_order){
            _this.setData({
              orderway:'asc'
            })
          }
        }
//  return false;
        // let orderby = e.currentTarget.dataset.orderby;
        // let orderway = e.currentTarget.dataset.orderway;
        // if (orderby == _this.orderby && orderway == _this.orderway) {
        //     orderby = '';
        //     orderway = '';
        // }
        // clicknum = clicknum + 1;
        // console.log(clicknum)
        // console.log(orderway)
        // console.log(clicknum % 2 == 0)
        // if (clicknum % 2 == 0) {
        //   orderway = 'desc'
        // } else {
        //   orderway = 'asc'
        // }
        // console.log(orderway)
        _this.setData({
          orderby: orderby,
          // orderway: orderway,
          page: 1
      });
       
        _this.getArchivesList2();
      },
      // 二级导航下拉隐藏
      Slideshow() {
          let _this = this;

          _this.setData({
              show: !_this.data.show
          });
      },
      /**
       * 读取列表数据
       */
      onTargetList: function (e) {
          let channel = e.target.dataset.channel;
          let typeid = e.target.dataset.typeid;
          let parent_id = e.target.dataset.parent_id;
          let is_all = e.target.dataset.is_all;
          let that = this;

          if (6 == channel || 8 == channel) {
              // 单页模型和留言模型另外跳转到各自的落地页
              func.jumpList(e);
          } else {
              let currentNav = parent_id;

              if (1 == is_all) {
                  currentNav = typeid;
              }

              let subCurrent = e.currentTarget.dataset.current; //获取当前tab的index

              that.typeid = typeid;
              that.setData({
                  typeid: typeid,
                  currentNav: currentNav,
                  isRuleTrue: false,
                  uhide: 0,
                  isClickSub: 1,
                  subCurrentNav: subCurrent
              });
              that.getPageData(); // 获取页面数据
          }
      },
      /**
       * 跳转列表页
       */
      jumpList(e) {
          func.jumpList(e);
      },
      jumpView(e) {
          func.jumpView(e);
      }

    })
