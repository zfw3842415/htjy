const App = getApp();

Page({
	data: {
		// 会员信息
		usersData: {},
		//默认选择微信支付
		curPayType: 1,
		// 充值信息记录
		moneyData: {},
		// 充值金额
		usersMoney: '',
		// 正在加载中
		isLoading: true,
		MoneyList:[
			{label:'300', value:'1'},
			{label:'500', value:'2'},
			{label:'1000', value:'3'}
		],  //三种价格数组
		choose:false
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
		_this.getUserMoneyData();
	},

	onPullDownRefresh: function () {
		let _this = this;
		// 查询会员信息及余额
		_this.getUserMoneyData();
		wx.stopPullDownRefresh()
	},

	// 查询会员信息及余额
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

	// 跳转链接
	link(e) {
		let url = e.currentTarget.dataset.url
		wx.navigateTo({url: url});
	},

	// 三种价格按钮切换
	radioChange: function (e) {
		let _this = this
		const items = _this.data.MoneyList;
		for (let i = 0, len = items.length; i < len; ++i) {
			items[i].checked = items[i].value === e.detail.value
		}
		this.setData({
			MoneyList: items,
			showPopup: false,
			usersMoney: items[e.detail.value-1].label
		});
	},

	// 其他金额弹窗展示
	showPopup() {
		let _this = this
		_this.data.MoneyList.forEach(item => {
			item['checked'] = false
		})
		_this.setData({
			MoneyList: _this.data.MoneyList,
			showPopup: !_this.data.showPopup
		})
	},

	// 充值金额
	InputMoney(e) {
		let _this = this;
		_this.setData({usersMoney: e.detail.value});
	},


	// 我已同意
	ChangeExplain(e) {
		let _this = this;
		_this.setData({choose:!_this.data.choose});
	},

	// 充值订单提交
	onSubmitOrder() {
		let _this = this;
		let postData = {
			action: 'recharge',
			usersMoney: _this.data.usersMoney
    };
		App._requestPost(_this, App.globalData.config.apiHandleUserMoneyActionUrl, postData,
			function (res) {
				_this.setData({
					moneyData: res.data.OrderData ? res.data.OrderData : {}
				});
				if (_this.data.curPayType == 1) {
					if (res.data.WeChatPay.return_code == 'FAIL') {
						App.showError(res.data.WeChatPay.return_msg, () => {});
						return false;
					}
					App.balancePayment({
						payment: res.data.WeChatPay,
						success(res1) {
							// 调用充值支付后续处理
							_this.rechargePayDealWith();
						},
						fail(res1) {
							if (!res.msg.error) App.showError(res.msg.error);
							_this.getUserMoneyData();
							return false;
						},
						complete(res1) {
							if (!res.msg.error) App.showError(res.msg.error);
							return false;
						}
					});
				}
			},
			function (res) {
				App.showError(res.msg);
			}
		);
	},

	// 调用充值支付后续处理
	rechargePayDealWith: function () {
		let _this = this;
		if (_this.data.moneyData.moneyid && _this.data.moneyData.order_number) {
			App._requestPost(_this, App.globalData.config.apiHandleUserMoneyActionUrl, {
					action: 'rechargePay',
					moneyid: _this.data.moneyData.moneyid,
					order_number: _this.data.moneyData.order_number,
				},
				function (res) {
					App.showSuccess(res.msg, function () {
						_this.getUserMoneyData();
					});
				},
				function (res) {
					App.showError(res.msg);
				}
			);
		}
	},

});
