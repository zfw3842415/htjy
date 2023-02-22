const App = getApp();

// 枚举类：发货方式
import DeliveryTypeEnum from '../../utils/enum/DeliveryType.js';

// 枚举类：支付方式
import PayTypeEnum from '../../utils/enum/order/PayType'
import func from '../../utils/func.js';

// 富文本插件
import wxParse from '../../wxParse/wxParse.js';


Page({

	/**
	 * 页面的初始数据
	 */
	data: {

		// 配送方式
		DeliveryTypeEnum,

		// 支付方式
		PayTypeEnum,

		order_id: null,
		order: {},
		// pingData:[{
		//   // "time":'4',
		//   pingTime: Math.round(new Date() / 100 + (2*60 * 60)),
		//   time: "55267",
		// }]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		let _this = this;
		_this.data.order_id = options.order_id;
	},

	onShow() {
		let _this = this;
		// 获取订单详情
		_this.getOrderDetail(_this.data.order_id);
	},

	// 获取支付时间倒计时2个小时
	setCountDown() {
		let _this = this
		var time = _this.data.order.add_time;
		var repTime = time.replace(/-/g, '/'); //用正则主要是把“2019-05-20 00:00:00”转换成“2019/05/0 00:00:00”兼容ios
		var timeTamp = Date.parse(repTime);
		var time = Date.parse(new Date())

		var cha = time - timeTamp
		// var dayTime = Date.parse(new Date()) + Date.parse(new Date()) / 1000
		var totalSecond = ( 2 * 60 * 60 * 1000 - cha) / 1000;
		var interval = setInterval(function () {
			var second = totalSecond ;

			var day = Math.floor(second / 3600 / 24);

			var hr = Math.floor((second - day * 3600 * 24) / 3600);
			var hrStr = hr.toString();
			if (hrStr.length == 1) hrStr = '0' + hrStr;
			// 分钟位
			var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
			var minStr = min.toString();
			if (minStr.length == 1) minStr = '0' + minStr;

			// 秒位
			var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
			var secStr = sec.toString();
			if (secStr.length == 1) secStr = '0' + secStr;

			this.setData({
				countDownHour: hrStr,
				countDownMinute: minStr,
				countDownSecond: secStr,
			});
			totalSecond--;
		}.bind(this), 1000);
	},
	onPullDownRefresh() {
		let _this = this;
		// 获取订单详情
		_this.getOrderDetail(_this.data.order_id);
		wx.stopPullDownRefresh();
	},
	// 复制订单号
	Copy(e){
		func.Copy(e)
	},
	/**
	 * 获取订单详情
	 */
	getOrderDetail(order_id) {
		let _this = this;
		App._requestApi(_this, App.globalData.config.shopOrderdetailUrl, {
			order_id
		}, result => {
			// 富文本转码
			let virtual_delivery = result.data.order.virtual_delivery;
			// 富文本转码
			if (virtual_delivery) {
				wxParse.wxParse('virtual_delivery', 'html', virtual_delivery, _this, 0);
			}
			_this.setData(result.data);
			_this.setCountDown();
		});
	},

	/**
	 * 跳转到商品详情
	 */
	onTargetGoods(e) {
		// let aid = e.currentTarget.dataset.id;
		// wx.navigateTo({
		//   // url: '../article/view?aid=' + aid
		// });
	},

	/**
	 * 取消订单
	 */
	cancelOrder(e) {
		let _this = this;
		let order_id = _this.data.order_id;
		wx.showModal({
			title: "提示",
			content: `确认取消订单？`,
			success(o) {
				if (o.confirm) {
					App._requestPost(_this, App.globalData.config.shopOrderCancelUrl, {
						order_id
					}, result => {
						wx.navigateBack();
					});
				}
			}
		});
	},

	/**
	 * 订单提醒
	 */
	remind(e) {
		let _this = this;
		let order_id = e.currentTarget.dataset.id;
		wx.showModal({
			title: "提示",
			content: "需要提醒管理员发货？",
			success(o) {
				if (o.confirm) {
					App._requestPost(_this,App.globalData.config.shopOrderRemindUrl, {
						order_id
					}, result => {
						App.showSuccess(result.msg);
						// _this.getOrderList(_this.data.dataType);
					});
				}
			}
		});
	},

	/**
	 * 确认收货
	 */
	receipt(e) {
		let _this = this;
		let order_id = _this.data.order_id;
		wx.showModal({
			title: "提示",
			content: `确认收到${_this.data.order.channel_ntitle}？`,
			success(o) {
				if (o.confirm) {
					App._requestPost(_this, App.globalData.config.shopOrderReceiptUrl, {
						order_id
					}, result => {
						_this.getOrderDetail(order_id);
					});
				}
			}
		});
	},

	// 申请售后服务
	serviceOrder(e) {
		let _this = this;
		let order_id = _this.data.order_id;
		let product_id = e.currentTarget.dataset.product_id;
		let details_id = e.currentTarget.dataset.details_id;
		App._requestPost(_this, App.globalData.config.apiHandleOrderServiceActionUrl, {
				use: 'service',
				order_id: order_id,
				action: 'goodsDetect',
				product_id: product_id,
				details_id: details_id,
			},
			function (result) {
				let goToUrl;
				if (result.data.apply_service == 1 && result.data.service_id > 0) {
					goToUrl = './service/detail?service_id=' + result.data.service_id;
				} else {
					goToUrl = './service/apply?order_id=' + _this.data.order_id + '&details_id=' + details_id + '&product_id=' + product_id
				}
				wx.navigateTo({url: goToUrl});
			}
		);
	},

	/**
	 * 点击付款按钮
	 */
	onPayOrder(e) {
		let _this = this;

		// 发起付款请求
		_this.OrderDirectPay();

		// 显示支付方式弹窗
		// _this.onTogglePayPopup();
	},

	OrderDirectPay: function () {
		let _this = this;
		let payOrderId = _this.data.order_id;
		let payOrderCode = _this.data.order.order_code;
		App._requestPost(_this,
			App.globalData.config.shopOrderPayUrl, {
				'action': 'DirectPay',
				order_id: payOrderId,
				order_code: payOrderCode
			},
			function (res) {
				if (res.data.WeChatPay.return_code == 'FAIL') {
					App.showError(res.data.WeChatPay.return_msg, () => {});
					return false;
				}
				App.wxPayment({
					order_id: payOrderId,
					payment: res.data.WeChatPay,
					success: res1 => {
						_this.OrderPayDealWith(payOrderId, payOrderCode);
					},
					fail: res1 => {
						if (!res.msg.error) {
							App.showError(res.msg.error, () => {
								// _this.redirectToOrderIndex();
							});
						}
					},
				});
			},
			function (res) {
				App.showError(res.msg);
			}
		);
	},

	OrderPayDealWith: function (payOrderId, payOrderCode) {
		if (payOrderId && payOrderCode) {
			let _this = this;
			App._requestPost(_this,
				App.globalData.config.shopOrderPayDealWithUrl, {
					order_id: payOrderId,
					order_code: payOrderCode
				},
				function (res) {
					App.showSuccess(res.msg, function () {
						wx.navigateTo({
							url: '../order/detail?order_id=' + payOrderId
						});
					});
				},
				function (res) {
					App.showError(res.msg);
				}
			);
		}
	},

	/**
	 * 选择支付方式
	 */
	onSelectPayType(e) {
		let _this = this;
		// 记录formId
		App.saveFormId(e.detail.formId);
		// 隐藏支付方式弹窗
		_this.onTogglePayPopup();
		if (!_this.data.showPayPopup) {
			// 发起付款请求
			_this.payment(e.currentTarget.dataset.value);
		}
	},

	/**
	 * 显示/隐藏支付方式弹窗
	 */
	onTogglePayPopup() {
		this.setData({
			showPayPopup: !this.data.showPayPopup
		});
	},

	/**
	 * 发起付款请求
	 */
	payment(payType) {
		let _this = this,
			orderId = _this.data.order_id;
		// 显示loading
		wx.showLoading({
			title: '正在处理...',
		});
		App._post_form('user.order/pay', {
			order_id: orderId,
			payType
		}, result => {
			if (result.code === -10) {
				App.showError(result.msg);
				return false;
			}

			// 发起微信支付
			if (result.data.pay_type == PayTypeEnum.WECHAT.value) {
				App.wxPayment({
					order_id: orderId,
					payment: result.data.payment,
					success() {
						_this.getOrderDetail(orderId);
					},
					fail() {
						App.showError(result.msg.success);
					},
				});
			}

			// 余额支付
			if (result.data.pay_type == PayTypeEnum.BALANCE.value) {
				App.showSuccess(result.msg.success, () => {
					_this.getOrderDetail(orderId);
				});
			}

		}, null, () => {
			wx.hideLoading();
		});
	},
});