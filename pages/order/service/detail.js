const App = getApp();
const func = require('../../../utils/func');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// 售后订单ID
		service_id: 0,
		// 售后订单信息
		serviceData: {},
		// 贸易类型，国内贸易=1，跨境贸易=2，默认1
		tradeType: 1,
		// 是否正在加载中，默认是
		isLoading: true,
		// 选中的物流信息
		usersDelivery: {
			'name': '',
			'code': '',
			'order': ''
		},
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let _this = this;
		// 设置数据类型
		_this.setData({
			service_id: options.service_id > 0 ? options.service_id : 0,
		});

		// 查询订单商品是否可申请售后
		_this.getOrderGoodsService();
	},

	// 下拉刷新，重载数据
	onPullDownRefresh() {
		let _this = this;
		// 查询订单商品是否可申请售后
		_this.getOrderGoodsService();
		wx.stopPullDownRefresh();
	},

	// 查询订单商品是否可申请售后
	getOrderGoodsService: function() {
		let _this = this;
		App._requestPost(_this, App.globalData.config.apiHandleOrderServiceActionUrl, {
				action: 'getService',
				service_id: _this.data.service_id,
			},
			function (result) {
				_this.setData({
					isLoading: false,
					serviceData: result.data ? result.data : {}
				});
			},
			function (result) {
				wx.navigateBack({delta: 1});
			}
		);
	},

	// 设置选中的物流信息
	bindRegionChange(e) {
		// 获取数据
		let _this = this;
		let index = e.detail.value;
		let express = _this.data.serviceData.express[index];
		let usersDelivery = _this.data.usersDelivery;
		// 处理数据
		usersDelivery['name'] = express['express_name'];
		// 重载数据
		_this.setData({usersDelivery: usersDelivery});
	},

	// 物流单号
	contentInput(e) {
		// 获取数据
		let _this = this;
		let code = e.detail.value;
		let usersDelivery = _this.data.usersDelivery;
		// 处理数据
		if (1 == _this.data.tradeType) {
			usersDelivery['code'] = code;
		} else {
			usersDelivery['order'] = code;
		}
		// 重载数据
		_this.setData({usersDelivery: usersDelivery});
	},

	// 提交物流信息
	submitExpress() {
		// 获取数据
		let _this = this;
		let usersDelivery = _this.data.usersDelivery;
		let order_id = _this.data.serviceData.order_id;
		App._requestPost(_this, App.globalData.config.apiHandleOrderServiceActionUrl, {
				order_id: order_id,
				action: 'addUsersDelivery',
				service_id: _this.data.service_id,
				usersDelivery: JSON.stringify(usersDelivery),
			},
			function (res) {
				App.showSuccess(res.msg, function() {
					// 查询订单商品是否可申请售后
					_this.getOrderGoodsService();
				});
			},
			function (res) {
				App.showError(res.msg);
			}
		);
	},

	// 取消售后服务订单
	cancelService() {
		let _this = this;
		wx.showModal({
			title: "友情提示",
			content: "确认要取消该售后服务吗？",
			success(o) {
				if (o.confirm) {
					var order_id = _this.data.serviceData.order_id;
					var details_id = _this.data.serviceData.details_id;
					App._requestPost(_this, App.globalData.config.apiHandleOrderServiceActionUrl, {
						order_id: order_id,
						details_id: details_id,
						action: 'cancelService',
						service_id: _this.data.service_id
					}, result => {
						App.showSuccess(result.msg, function() {
							_this.getOrderGoodsService();
						});
					});
				}
			}
		});
	},

	// 复制单号
	copytext:function(e) {
		wx.setClipboardData({
			data: e.currentTarget.dataset.text,
			success:function (res) {
				wx.showToast({
					title: '复制成功',
				})
			}
		})
	},

	// 查询图片
	priviewImg: function (e) {
		let _this = this
		// 获取当前图片的下标
		let index = e.currentTarget.dataset.index;
		// 所有图片
		if (1 == _this.data.tradeType) {
			var serviceImg = _this.data.serviceData.service.upload_img;
		} else {
			var serviceImg = _this.data.serviceData.service.serviceImg;
		}
		wx.previewImage({
			// 当前显示图片
			current: serviceImg[index],
			// 所有图片
			urls: serviceImg
		});
	},

})