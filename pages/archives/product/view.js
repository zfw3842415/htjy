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
const func = require('../../../utils/func');
const util = require('../../../utils/util.js'); // 工具类
import wxParse from '../../../wxParse/wxParse.js'; // 富文本插件

// 记录规格的数组
let productSpecValueID = [];
// 会员折扣
let usersDiscount = 1;

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    shop_open:'0',  //1是商城版    0 综合版 
		indicatorDots: false, // 是否显示面板指示点
		autoplay: true, // 是否自动切换
		interval: 3000, // 自动切换时间间隔
		duration: 800, // 滑动动画时长
		currentIndex: 1, // 轮播图指针
		floorstatus: false, // 返回顶部
		aid: 0, // 文档ID
		typeid: 0, // 栏目ID
		detail: {}, // 文档详情 
    preDetail: {}, // 上一篇
    nextDetail: {}, // 下一篇
		tabScroll: 0,
		shortcutType: 'shopping', // 快捷入口
		spec_name_List:[],
		Spec_value_List:[],
		// 分享按钮组件
		share: {
			show: false,
			cancelWithMask: true,
			cancelText: '关闭',
			actions: [{
				name: '发送给朋友',
				openType: 'share'
			}]
		},
		// 滚动导航
		tabConfig: [
			{ scrollInto: 'scroll0', text: '商品' },
			{ scrollInto: 'scroll1', text: '评价' },
			{ scrollInto: 'scroll2', text: '详情' },
			{ scrollInto: 'scroll3', text: '推荐' },
		],
		scrollTop: 0,
		scrollInto: 'scrollInto0', // 回到顶部scroll-into-view层级高过scroll-top
		// height:0,   界面高度
		tabContentScrollTop: 0,     
		isClick: false,
		listHeight: [],
		currentTabIndex:0,
		slideTabHeight: 84,
		itemHeightList: [],   
		coupon_list:[],    //优惠券数组
		currentTab: 0,   
		isCollect: 0, //收藏状态 0-未收藏 1-已收藏
		product_num: 1, // 商品数量
		productMultiSpec: {}, // 多规格信息
		cart_total_num:0,//购物车商品数量
		product:[],    //推荐商品数组

		posters: {},  //分享二维码数据
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		let _this = this;
		if (options.scene) { //这里为线上操作
			// scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
			let scene = decodeURIComponent(options.scene);
			let aid = func.getQueryVariable('aid', scene);
			_this.data.aid = !aid ? _this.data.aid : aid;
			let typeid = func.getQueryVariable('typeid', scene);
			_this.data.typeid = !typeid ? _this.data.typeid : typeid;
		} else { //这里为开发环境
			if (options.aid !== 'undefined') {
				_this.data.aid = !options.aid ? 0 : options.aid;
			}
			if (options.typeid !== 'undefined') {
				_this.data.typeid = !options.typeid ? 0 : options.typeid;
			}
		}
		_this.setData({
			aid: _this.data.aid,
			typeid: _this.data.typeid
		});
		setTimeout(() => {
			_this.getItemHeight()
		}, 1000)
    _this.getPageData(); // 获取页面数据
	
	},
	/**
	 * 生命周期回调—监听页面显示
	 */
	onShow() {

	},
	/**
	 * 下拉刷新
	 */
	onPullDownRefresh: function () {
		let _this = this;
		_this.getPageData(); // 获取页面数据
		_this.getItemHeight()
		wx.stopPullDownRefresh() // 停止下拉刷新
	},
	/**
	 * 获取页面数据
	 */
	getPageData() {
		this.getArchivesView(); // 获取文档详情
	},
	/**
	 * 获取文档详情
	 */
	getArchivesView() {
		let _this = this;
		App._requestApi(_this, App.globalData.config.apiViewUrl, {
			aid: _this.data.aid, // 文档ID
			typeid: _this.data.typeid, // 文档所属的栏目ID
			apiCollect: `ekey=1&type=default`, // 文档是否收藏标签
      apiPrenext: `ekey=1&get=all`, // 文档上下篇标签prenext
			// 这里可以根据需求填写更多的api标签
		}, function (res) {
      console.log(res)
			let detail = res.data.detail.data, // 文档详情页数据
				product = res.data.product,
				coupon_list = res.data.coupon_list,
				isCollect = res.data.apiCollect[1].is_collect, // 文档是否被收藏，1：已收藏，0：未收藏
				preDetail = res.data.apiPrenext[1].preDetail , // 上一篇文档的数据
				nextDetail = res.data.apiPrenext[1].nextDetail; // 下一篇文档的数据
				 let shop_open = 1;
				if(coupon_list) {
					coupon_list.forEach((value, index) => {
						value["coupon_price"] = parseInt(value["coupon_price"])
					});
        		}
				if (detail) {
					if (detail.arcrank <= -1) {
						App.showError('产品待审核中，无权查看！');
						return false;
					}

				/*存在规格则更新规格价*/
				let productMultiSpec = {};
				if (detail.channel == 2) {
					_this.setData({
						cart_total_num: detail.cart_total_num
					});
					productMultiSpec = detail.spec_attr;
					if (detail.spec_attr.select_spec_data.spec_value_id) {
						productSpecValueID = detail.spec_attr.select_spec_data.spec_value_id;
						detail.spec_value_id = detail.spec_attr.select_spec_data.spec_value_id.join('_');
					}
					if (detail.spec_attr.select_spec_data.users_discount) {
						usersDiscount = detail.spec_attr.select_spec_data.users_discount;
						detail.old_price = detail.users_price;
						detail.users_price = (detail.users_price * usersDiscount).toFixed(2);
					}
					if (detail.spec_attr.select_spec_data.users_price) {
						detail.users_price = detail.spec_attr.select_spec_data.users_price;
					}
					if (detail.spec_attr.select_spec_data.old_price) {
						detail.old_price = detail.spec_attr.select_spec_data.old_price;
					}
					if (typeof detail.spec_attr.select_spec_data.stock_count != 'undefined') { 
						detail.stock_count = detail.spec_attr.select_spec_data.stock_count;
					}
					// if(0 == detail.comment_data_count.length){
					// 	let  tabConfig = _this.data.tabConfig;
					// 	tabConfig.splice(1,1);
					// 	_this.setData({
					// 		tabConfig: tabConfig
					// 	});
					// }
				}
				/* END */

				// 富文本转码
				if (detail.content.length > 0) {
					wxParse.wxParse('content', 'html', detail.content, _this, 0);
				}
				// 设置导航标题
				wx.setNavigationBarTitle({
					title: detail.title || '产品详情'
				})
				_this.setData({
          shop_open,
					detail,
					isCollect,
					productMultiSpec,
					product,
					coupon_list,
          preDetail,
          nextDetail,
        });
        if(_this.data.shop_open == 0){
          let tabConfig = [
            { scrollInto: 'scroll0', text: '商品' },
            { scrollInto: 'scroll2', text: '详情' },
            { scrollInto: 'scroll3', text: '推荐' },
          ];
          _this.setData({
            tabConfig: tabConfig
          });
        }
				let SpecList = _this.data.productMultiSpec.spec_data
				let spec_name_List = []
				let Spec_value_List = []
				for (let i in SpecList){
					spec_name_List.push(SpecList[i].spec_name)
					SpecList[i].spec_data_new.forEach((item,index) => {
						if (item.checked ==  true) {
							Spec_value_List.push(item.spec_value)
						} 
					})
				}
				_this.setData({
					Spec_value_List: Spec_value_List,
					spec_name_List:spec_name_List
				})
			} else {
				App.showError('产品不存在！');
				return false;
			}
		});
	},
	 /**
	 * 设置轮播图当前指针 数字
	 */
	setCurrent(e) {
		let _this = this;
		_this.setData({
			currentIndex: e.detail.current + 1
		});
	},
	// 获取class名为tabItem每个元素的高度
	getItemHeight() {
		let _this = this
		wx.createSelectorQuery().selectAll('.tabItem').boundingClientRect(data => {
			_this.setData({
				listHeight: data.map(item => item.top),
				itemHeightList: data.map(item => item.height + item.top)
			})
		}).exec()
	},
	// 滚动界面是出发的函数
	onTabContentScroll (e) {
		let _this  = this
		_this.setData({
			scrollTop: e.detail.scrollTop
		})
		if (_this.data.isClick) {
			_this.setData({
				isClick: false
			})
			return
		}
		_this.data.listHeight.map((item, index) => {
			if (_this.data.scrollTop + _this.data.slideTabHeight >= item  && _this.data.scrollTop <= _this.data.itemHeightList[index] - _this.data.slideTabHeight) {
				_this.setData({
					currentTabIndex: index
				})
			}
		})
	},
	// 滚动导航条点击切换
	tabChange(e) {
		let _this = this
		let index = e.currentTarget.dataset.index
		let Id = e.currentTarget.dataset.opt
		console.log(index,Id,_this.data.listHeight);
		// if (!_this.data.listHeight[index]) return
			_this.setData({
				isClick: true,
				currentTabIndex : index,
				// tabContentScrollTop:  _this.data.listHeight[index] - _this.data.slideTabHeight,
				scrollInto:Id
			})

	},
	// 使用规则展示隐藏
	showList(e){
		let _this = this
		let  index= e.currentTarget.dataset.index
		let  show= _this.data.coupon_list[index].show
		_this.setData({
			['coupon_list.[' + index + '].show']:!show,
		})
	},
	/**
	 * 浏览幻灯图片
	 */
	onPreviewImages(e) {
		let _this = this;
		let index = e.currentTarget.dataset.index,
			imageUrls = [];
		_this.data.detail.image_list.forEach(item => {
			imageUrls.push(item.image_url);
		});
		wx.previewImage({
			current: imageUrls[index],
			urls: imageUrls
		})
	},

	/**
	 * 分享当前页面
	 */
	onShareAppMessage() {
    console.log(54567878)
		let _this = this;
		// 构建页面参数
		let params = App.getShareUrlParams({
			'aid': _this.data.detail.aid
		});
		return {
			title: _this.data.detail.title,
			path: "/pages/archives/product/view?" + params
		};
	},
	/**
	 * 分享到朋友圈
	 */
	onShareTimeline() {
		let _this = this;
		return {
			title: _this.data.detail.title,
		}
	},
	/**
	 * 显示分享选项
	//  */
	onClickShare(e) {
		let _this = this;
		_this.setData({
			SharePopup:!_this.data.SharePopup
			// 'share.show': true
		});
	},

	/**
	 * 关闭分享选项
	 */
	onCloseShare() {
		let _this = this;
		_this.setData({
			'share.show': false
		});
	},

	/*2020-05-06添加 --- chen */
	/**
	 * 确认购买弹窗
	 */
	onToggleTrade(e) {
		let _this = this;
		_this.setData({
			showBottomPopup: !_this.data.showBottomPopup,
			buttonType:e.currentTarget.dataset.type
		});
	},
	/**
	 * 领取优惠券弹窗
	 */
	showCouponPopup(e) {
		let _this = this;
		_this.setData({
			showCouponPopup: !_this.data.showCouponPopup,
		});
	},
	 /**
	 * 服务说明弹窗
	 */
	showservicePopup(e) {
		let _this = this;
		_this.setData({
			showservicePopup: !_this.data.showservicePopup,
		});
	},
	/**
	 * 增加商品数量
	 */
	onIncGoodsNumber(e) {
		let _this = this;
		if (_this.data.product_num >= _this.data.detail.stock_count){
			App.showError("最多只能购买"+_this.data.detail.stock_count+"件");
		}else{
			_this.setData({
				product_num: ++_this.data.product_num
			})
		}
		
	},

	/**
	 * 减少商品数量
	 */
	onDecGoodsNumber(e) {
		let _this = this;
		if (_this.data.product_num > 1) {
			_this.setData({
				product_num: --_this.data.product_num
			});
		}
	},

	/**
	 * 自定义输入商品数量
	 */
	onInputGoodsNum(e) {
		let _this = this,
			iptValue = e.detail.value;
		if (!util.isPositiveInteger(iptValue) && iptValue !== '') {
			iptValue = 1;
		}
		_this.setData({
			product_num: iptValue
		});
	},

	/**
	 * 点击切换不同规格
	 */
	onSwitchSpec(e) {
		let _this = this,
		attrIdx = e.currentTarget.dataset.attrIdx,
		itemIdx = e.currentTarget.dataset.itemIdx,
		productMultiSpec = _this.data.productMultiSpec;
		let Spec_value_List2 = _this.data.Spec_value_List
		for (let i in productMultiSpec.spec_data) {
			for (let j in productMultiSpec.spec_data[i].spec_data_new) {
				if (attrIdx == i) {
					productMultiSpec.spec_data[i].spec_data_new[j].checked = false;
					if (itemIdx == j) {
					productMultiSpec.spec_data[i].spec_data_new[itemIdx].checked = true;
					let Value = productMultiSpec.spec_data[i].spec_data_new[itemIdx].spec_value
					Spec_value_List2[attrIdx]  =   Value
					 
					}
				}
				if (true === productMultiSpec.spec_data[i].spec_data_new[j].checked) {
					productSpecValueID[i] = productMultiSpec.spec_data[i].spec_data_new[j].spec_value_id;
				}
			}
		}
		_this.setData({
			Spec_value_List:Spec_value_List2,
			productMultiSpec,productMultiSpec
		});
		// 更新商品规格信息
		_this._updateSpecGoods();
	},

	/**
	 * 更新商品规格信息
	 */
	_updateSpecGoods() {
		// 匹配选中的规格，读取出数组
		let SpecValueID = productSpecValueID;
		SpecValueID = SpecValueID.sort(function(a,b){return a-b;}).join('_');
		let _this = this;
		let productMultiSpec = _this.data.productMultiSpec.spec_value,
			specValueData = productMultiSpec.find((val) => {
				return val.spec_value_id == SpecValueID;
			});
		// 更新商品价格、划线价、库存、规格信息
		if (typeof specValueData === 'object') {
			// 获取详情数据
			let detail = _this.data.detail;
			// 更新价格
			let spec_price = specValueData.spec_price;
			spec_price = spec_price * usersDiscount;
			detail.users_price = spec_price.toFixed(2);
			// 更新划线价
			detail.old_price = specValueData.spec_price;
			// 更新库存
			detail.stock_count = specValueData.spec_stock;
			// 更新所选规格值ID
			detail.spec_value_id = SpecValueID;
			// 更新购买数量
			detail.product_num = _this.data.product_num;
			// 更新详情数据
			_this.setData({
				detail
			});
		}
	},

	/**
	 * 加入购物车and立即购买
	 */
	onConfirmSubmit(e) {
		let _this = this;
		let detail = _this.data.detail;
		let product_num = _this.data.product_num;

		// 提交类型
		let submitType = _this.data.buttonType;
		// 提交数据
		let PostData = {
			product_id: detail.aid,
			product_num: product_num,
			spec_value_id: detail.spec_value_id ? detail.spec_value_id : 0
		};
		// 发起提交
		if ('addCart' == submitType) {
			App._requestPost(_this,
				App.globalData.config.shopAddCartUrl,
				PostData,
				function(res) {
						_this.setData({
						showBottomPopup: !_this.data.showBottomPopup,
						cart_total_num:res.data.cart_total_num
					});
					App.showSuccess('已添加至购物车');
				},
				function(res) {
					App.showError(res.msg);
					// App.doLogin();
				}
			);
		} else if ('buyNow' == submitType) {
			App._requestPost(_this,
				App.globalData.config.shopBuyNowUrl,
				PostData,
				function(res) {
					wx.redirectTo({
						url: res.url
					})
				},
				function(res) {
					App.showError(res.msg);
					// App.doLogin();
				}
			);
		} else if ('specType' == submitType) {
			_this.setData({
				showBottomPopup: !_this.data.showBottomPopup
			})
		}
	},
	//跳转到首页
	jumpIndex() {
		wx.navigateTo({
			url: "/pages/index/index"
		});
	},
	navback() {
		wx.navigateBack({
			 delta:1 //返回上一级页面
		})
	},
	/**
	 * 跳转购物车页面
	 */
	onTriggerCart() {
		wx.navigateTo({
			url: "/pages/flow/index"
		});
	},
	
	/**
	 * 点击拨打电话
	 */
	onServiceEvent(e) {
		// 拨打电话
		wx.makePhoneCall({
			phoneNumber: this.data.pageData.items[0].params.phone_num
		})
	},
	/**
	 * 跳转列表页
	 */
	jumpList(e) {
		func.jumpList(e)
	},
	/**
	 * 跳转详情页
	 */
	jumpView(e) {
		func.jumpView(e)
	},
	// 跳转界面
	jumpToUrl(e) {
		func.jumpToUrl(e)
	},
	navigateToUrl(e){
		let url = e.currentTarget.dataset.path
		func.navigateTo(url)
	},
	//推荐商品添加购物车
	addCart: function(e) {
		func.addCart(e);
	},
	/**
	 * 跳转到评论
	 */
	onTargetToComment() {
		let _this = this;
		wx.navigateTo({
			url: '/pages/archives/comment/comment?aid=' + _this.data.aid
		})
	},
	/**
	 * 收藏/取消
	 */
	collect(e) {
		let _this = this;
		App._requestPost(_this, App.globalData.config.apiGetCollectUrl, {
			aid: _this.data.aid // 文档ID
		}, function (res) {
			if (res.code === 1) {
				_this.setData({
					isCollect: res.data.is_collect
				})
			} else {
				App.showError(res.msg);
			}
		});
	},
	goHome(e) {
		wx.navigateTo({
			url: '/pages/index/index',
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
				let dataList = _this.data.coupon_list
				dataList[e.currentTarget.dataset.index].geted = 1
				_this.setData({
					coupon_list:dataList
				})
				wx.showToast({
					title: result.msg,
					icon: 'success',
					duration: 1000
				})
			}
		});
	},

  SharePopupmianban() {
    let _this = this
    _this.setData({
      SharePopup:!_this.data.SharePopup
		});
  },
	// 生成商品二维码海报
	createGoodsShareQrcodePoster: function() {
    let _this = this;
		_this.setData({
      showPopup: !_this.data.showPopup,
      SharePopup:!_this.data.SharePopup
		});
		wx.showLoading({title: '加载中'});
		// 提交数据
		App._requestPost(_this, App.globalData.config.apiCreateGoodsShareQrcodePosterUrl, {aid: _this.data.aid, typeid: _this.data.typeid},
			function(res) {
        console.log(res)
				let posters = res.data;
				_this.setData({
          posters: posters,
        });
			},
			function(res) {
				App.showError(res.msg);
			}
		);
  },
  // 关闭海报图片
  closeImg(e) {
    let _this = this
    _this.setData({
      showPopup: !_this.data.showPopup,
		});
  },
  	// 长按保存二维码
	saveImage(e) {
    // let url = e.currentTarget.dataset.url;
    wx.showToast({
      icon: 'loading',
      title: '正在保存图片',
      duration: 1000
      })
		wx.getSetting({
			success: (res) => {
				if (!res.authSetting['scope.writePhotoAlbum']) {
					wx.authorize({
						scope: 'scope.writePhotosAlbum',
						success: () => {
							this.saveImg1();
						},
						fail: () => {

						}
					})
				} else {
					this.saveImage();
				}
			},
			fail: (res) => {

			}
		})
	},
	saveImg1() {
    let _this = this
    wx.downloadFile({
      // 图片下载地址
      url: _this.data.posters.poster,
      // url: app.apiUrl.url + 'Userequity/poster',
      success: function(res) {
        wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
            title: '保存成功',
            icon: "success",
            duration: 1000
            })
          }
        })
    	},
    })
  }
})
