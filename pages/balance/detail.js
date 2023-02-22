const App = getApp();

Page({

	data: {
		isLoading: true,
		MoneyRecording: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var _this = this;
	},

	/**
	 * 生命周期回调—监听页面显示
	 */
	onShow() {
		var _this = this;
		// 加载页面数据
		_this.getUserMoneyRecording();
	},

	onPullDownRefresh: function () {
		let _this = this;
		_this.getUserMoneyRecording();
		wx.stopPullDownRefresh()
	},

	// 会员余额记录
	getUserMoneyRecording: function() {
		let _this = this;
		App._requestApi(_this, App.globalData.config.userMoneyActionUrl, {
				moneyAction: 'recordList',
			},
			function (result) {
				_this.setData({
					isLoading: false,
					MoneyRecording: result.data ? result.data : []
				});
				_this.setData(result.data);
			},
			function (result) {
				App.showSuccess(result.msg, function() {
					wx.navigateBack({delta: 1});
				});
			}
		);
	},
})