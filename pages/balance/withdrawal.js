const App = getApp();

Page({
	data: {
		// 会员信息
		usersData: {},
		// 充值金额
		withdrawal: '',
		// 正在加载中
		isLoading: true,
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
		let _this = this;
		// 查询会员信息及余额
		// _this.getUserMoneyData();
	},

	onPullDownRefresh: function () {
		let _this = this;
		// 查询会员信息及余额
	// 	_this.getUserMoneyData();
	// 	_this.setData({isLoading: false, withdrawal: ''});
	// 	wx.stopPullDownRefresh()
	},

	// 查询会员信息及余额
	getUserMoneyData() {
		let _this = this;
		//App._requestApi(_this, App.globalData.config.userMoneyActionUrl, {
		// 		moneyAction: 'details',
		// 	},
		// 	function (result) {
		// 		_this.setData({
		// 			isLoading: false,
		// 			usersData: result.data ? result.data : {}
		// 		});
		// 	},
		// 	function (result) {
		// 		App.showSuccess(result.msg, function() {
		// 			wx.navigateBack({delta: 1});
		// 		});
		// 	}
		// );
	},

	// 充值金额
	inputNum(e) {
		let _this= this;
		// _this.setData({withdrawal: e.detail.value});
	},

	// 点击全部提现按钮
	Allbalance: function () {
		let _this = this;
		// let users_money = _this.data.usersData.users_money
		// _this.setData({withdrawal: users_money})
	},

	/**
	 * 订单提交
	 */
	onSubmitOrder() {
		let _this = this;
		// let postData = {
		// 	moneyAction: 'withdrawal',
		// 	withdrawal: _this.data.withdrawal
		// };
		// App._requestPost(App.globalData.config.userMoneyActionUrl, postData,
		// 	function (res) {
		// 		App.showSuccess(res.msg, function () {
		// 			wx.navigateBack(1);
		// 		});
		// 	},
		// 	function (res) {
		// 		App.showError(res.msg);
		// 		_this.Allbalance();
		// 	}
		// );
	},

});