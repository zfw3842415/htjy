const App = getApp();

const func = require('../../utils/func');

// 枚举类：发货方式
import DeliveryTypeEnum from '../../utils/enum/DeliveryType.js';

// 枚举类：支付方式
import PayTypeEnum from '../../utils/enum/order/PayType'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {

		dataType: 'all', // 列表类型
		list: [], // 订单列表
		scrollHeight: null, // 列表容器高度

		DeliveryTypeEnum, // 配送方式
		PayTypeEnum, // 支付方式

		no_more: false, // 没有更多数据
		isLoading: true, // 是否正在加载中

		page: 1, // 当前页码

		showQRCodePopup: false, // 核销码弹窗显示隐藏
		QRCodeImage: '', // 核销码图片

		// 底部导航菜单
		tabbar: App.globalData.tabbar,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		let _this = this;
		// 设置scroll-view高度
		_this.setListHeight();
		// 设置数据类型
		_this.setData({
			dataType: options.type || 'all'
		});
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
		// 获取订单列表
		this.getOrderList();
	},

	/**
	 * 获取订单列表
	 */
	getOrderList(isPage, page) {
		let _this = this;
		App._requestApi(_this, App.globalData.config.shopOrderlistsUrl, {
			page: page || 1,
			dataType: _this.data.dataType
		}, result => {
			let resList = result.data.list,
				dataList = _this.data.list;
			if (isPage == true) {
				_this.setData({
					'list.data': dataList.data.concat(resList.data),
					isLoading: false,
				});
			} else {
				_this.setData({
					list: resList,
					isLoading: false,
				});
			}
		});
	},

	/**
	 * 切换标签
	 */
	bindHeaderTap(e) {
		let _this = this;
		let dataType = !e ? _this.data.dataType : e.currentTarget.dataset.type;
		_this.setData({
			dataType: dataType,
			list: {},
			isLoading: true,
			page: 1,
			no_more: false,
		});
		// 获取订单列表
		_this.getOrderList(dataType);
	},

	/**
	 * 取消订单
	 */
	cancelOrder(e) {
		let _this = this;
		let order_id = e.currentTarget.dataset.id;
		wx.showModal({
			title: "友情提示",
			content: "确认要取消该订单吗？",
			success(o) {
				if (o.confirm) {
					App._requestPost(_this,App.globalData.config.shopOrderCancelUrl, {
						order_id
					}, result => {
						_this.getOrderList(_this.data.dataType);
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
		let order_id = e.currentTarget.dataset.id;
		wx.showModal({
			title: "提示",
			content: "确认收到" + _this.data.list.data[0]['channel_ntitle'] + "？",
			success(o) {
				if (o.confirm) {
					App._requestPost(_this,App.globalData.config.shopOrderReceiptUrl, {
						order_id
					}, result => {
						_this.getOrderList(_this.data.dataType);
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
	 * 点击付款按钮
	 */
	onPayOrder(e) {
		let _this = this;
		// 记录订单id
		// _this.setData({
		//   payOrderId: e.currentTarget.dataset.id
		// });
		let payOrderId = e.currentTarget.dataset.id;
		let payOrderCode = e.currentTarget.dataset.code;
		
		// 发起付款请求
		_this.OrderDirectPay(payOrderId, payOrderCode);

		// 显示支付方式弹窗
		// _this.onTogglePayPopup();
	},

	OrderDirectPay: function(payOrderId, payOrderCode) {
		let _this = this;
		App._requestPost(_this,
			App.globalData.config.shopOrderPayUrl,
			{'action': 'DirectPay', order_id: payOrderId, order_code: payOrderCode},
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

	OrderPayDealWith: function(payOrderId, payOrderCode) {
		if (payOrderId && payOrderCode) {
			let _this = this;
			App._requestPost(_this,
				App.globalData.config.shopOrderPayDealWithUrl,
				{order_id: payOrderId, order_code: payOrderCode},
				function (res) {
					App.showSuccess(res.msg, function() {
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
			_this.payment(_this.data.payOrderId, e.currentTarget.dataset.value);
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
	payment(orderId, payType) {
		// 显示loading
		wx.showLoading({
			title: '正在处理...',
		});
		App._requestPost(this,App.globalData.config.apiOrderpayUrl, {
			order_id: orderId,
			payType: payType
		}, result => {
			if (result.code == 0) {
				App.showError(result.msg);
				return false;
			}
			// 发起微信支付
			if (result.data.pay_type == PayTypeEnum.WECHAT.value) {
				App.wxPayment({
					order_id: orderId,
					payment: result.data.payment,
					success() {
						// 跳转到已付款订单
						wx.navigateTo({
							url: '../order/detail?order_id=' + orderId
						});
					},
					fail() {
						App.showError(result.msg.error);
					},
				});
			}
			// 余额支付
			if (result.data.pay_type == PayTypeEnum.BALANCE.value) {
				App.showSuccess(result.msg.success, () => {
					// 跳转到已付款订单
					wx.navigateTo({
						url: '../order/detail?order_id=' + orderId
					});
				});
			}
		}, null, () => {
			wx.hideLoading();
		});
	},

	/**
	 * 跳转订单详情页
	 */
	navigateToDetail(e) {
		let order_id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: '/pages/order/detail?order_id=' + order_id
		});
	},

	onPullDownRefresh() {
		// 获取订单列表
		this.bindHeaderTap();
		wx.stopPullDownRefresh();
	},

	/**
	 * 下拉到底加载数据
	 */
	bindDownLoad() {
		// 已经是最后一页
		if (this.data.page >= this.data.list.last_page) {
			this.setData({
				no_more: true
			});
			return false;
		}
		// 加载下一页列表
		this.getOrderList(true, ++this.data.page);
	},

	/**
	 * 设置商品列表高度
	 */
	setListHeight() {
		let systemInfo = wx.getSystemInfoSync(),
			rpx = systemInfo.windowWidth / 750, // 计算rpx
			tapHeight = Math.floor(rpx * 5), // tap高度
			scrollHeight = systemInfo.windowHeight - tapHeight; // swiper高度
		this.setData({
			scrollHeight
		});
	},

	switchTab: function (e) {
		func.switchTab(e);
	},

		/**
	 * 订单评价
	 */
	comment(e) {
		let _this = this;
		let order_id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: './comment/comment?order_id=' + order_id,
		})
	},
});