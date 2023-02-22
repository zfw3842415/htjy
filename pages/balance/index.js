const App = getApp();
const func = require('../../utils/func.js');

Page({

	data: {
		// 会员信息
		usersData: {},
		// 正在加载中
		isLoading: true,
		// 页面元素
		List: [
			{label:'余额消费', value:'-22.00', type:'reduce'},
			{label:'退款', value:'+110.00', type:'add'},
			{label:'微信支付', value:'-30.00', type:'reduce'},
			{label:'余额消费', value:'-22.00', type:'reduce'},
			{label:'退款', value:'+110.00', type:'add'},
			{label:'微信支付', value:'-30.00' , type:'reduce'},
		],
		scrollTop: 0,
		// 底部导航菜单
		tabbar: App.globalData.tabbar,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		let _this = this;
	},

	/**
	 * 生命周期回调—监听页面显示
	 */
	onShow: function() {
		let _this = this
		_this.getUserMoneyData();
	},

	onPullDownRefresh: function () {
		let _this = this;
		_this.getUserMoneyData();
		wx.stopPullDownRefresh()
	},

	getUserMoneyData() {
		let _this = this;
		App._requestApi(_this, App.globalData.config.apiHandleUserMoneyActionUrl, {
				action: 'details',
			},
			function (result) {
				_this.setData({
					isLoading: false,
					usersData: result.data ? result.data : {}
				});
			},
			function (result) {
				App.showSuccess(result.msg, function() {
					wx.navigateBack({delta: 1});
				});
			}
		);
	},

	// 跳转到商品详情页
	jumpToView: function (e) {
		func.jumpToView(e);
	},

	//推荐商品添加购物车
	addCart: function (e) {
		func.addCart(e);
	},
	
	/**
	 * 分享当前页面
	 */
	onShareAppMessage() {
		let _this = this;
		return {
			title: _this.data.page.params.title,
			// path: "/pages/contact/index?" + App.getShareUrlParams()
		};
	},

	onShareTimeline() {
		let _this = this;
		return {
			title: _this.data.page.params.title,
		}
	},

	//管理弹窗
	onToggleTrade(e) {
		let _this = this;
		_this.setData({
			showBottomPopup: !_this.data.showBottomPopup
		});
	},
	
	switchTab: function(e) {
		func.switchTab(e);
	},
	
});
