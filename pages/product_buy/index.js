/**
 * 易优CMS
 * ============================================================================
 * 版权所有 2016-2028 海南赞赞网络科技有限公司，并保留所有权利。
 * 网站地址: http://www.eyoucms.com
 * ----------------------------------------------------------------------------
 * 如果商业用途务必到官方购买正版授权, 以免引起不必要的法律纠纷.
 * ============================================================================
 * Author: 陈风任 <491085389@qq.com>
 * Date: 2020-05-07
 */

const App = getApp();

const func = require('../../utils/func');
// 工具类
const util = require('../../utils/util.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {

		// 当前页面参数
		options: {},

		// 默认地址信息
		address: {},

		// 产品列表信息
		product_data: {},

		// 全局信息
		global_info: {},

		// 支付方式
		curPayType: 1,

		// 订单总金额
		TotalNumber: 0,

		// 订单总数量
		TotalAmount: 0,

		// 禁用提交按钮
		disabled: false,

		// 会员留言
		remark: '',

		// 收货地址，默认无
		exist_address: false,

		// 订单ID
		order_id: null,

		// 订单编号
		order_code: null,

		// 购物车是否付款完成，默认 false ，未付款
		is_cart_pay: false,
		// 立即购买是否付款完成，默认 false ，未付款
		is_buy_pay: false,

		// 默认可使用优惠券列表
		coupon_list: [],
		// 默认不可使用优惠券列表
		unuse_coupon_list: [],

		//选中的优惠金额
		coupon_price:0,
		//选中的优惠券id
		selectCouponId:0,
		//订单类型 prom_type 0-普通,1-虚拟
		prom_type:1,
		show:false,   //可用积分抵扣   false默认不选中   true默认选中
		CouponType:'Used'   // 可用优惠券Used默认选择   不可用优惠券unUse
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		let _this = this;
		// 当前页面参数
		_this.setData({
			options
		});
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
		let _this = this;

		// 获取当前订单信息
		_this.getOrderData();
	},

	onPullDownRefresh() {
		// 获取当前订单信息
		this.getOrderData();
		wx.stopPullDownRefresh();
	},

	/**
	 * 获取当前订单信息
	 */
	getOrderData() {
		let _this = this;
		if (_this.data.is_buy_pay && _this.data.options.querystr) {
			return false;
		} else if (_this.data.is_cart_pay && !_this.data.options.querystr) {
			return false;
		} else {
			let PostData = {
				querystr: _this.data.options.querystr
			};

			App._requestPost(_this,
				App.globalData.config.shopProductBuyUrl,
				PostData,
				function (res) {
					let address = res.data.address,
					product_data = res.data.product_data,
					global_info = res.data.global_info,
					coupon_list = res.data.coupon_data,
					UserInfo = res.data.users,
					unuse_coupon_list = res.data.unuse_coupon_data;
					let exist_address = address.addr_id ? true : false;
					if (coupon_list) {
						// 优惠券价格变为整数
						coupon_list.forEach((value, index) => {
							value["coupon_price"] = parseInt(value["coupon_price"])
						});
					}
					if (unuse_coupon_list) {
						unuse_coupon_list.forEach((value, index) => {
							value["coupon_price"] = parseInt(value["coupon_price"])
						});
					}
					let prom_type = _this.data.prom_type;
					if (product_data) {
						product_data.forEach(item => {
							let Spec = item.product_spec.split('；')
							_this.setData({
								Spec:Spec
							})
							if(1 == prom_type && 0 == item.prom_type){
								prom_type = 0;
							}
						});
					}
					_this.setData({
						product_data,
						global_info,
						address,
						exist_address,
						coupon_list,
						unuse_coupon_list,
            prom_type,
            UserInfo
					});
				},
				function (res) {
					App.showError(res.msg);
				}
			);
		}
	},

	/**
	 * 跳转到未付款订单
	 */
	redirectToOrderIndex() {
		wx.redirectTo({
			url: '../order/index',
		});
	},
	// 优惠券可用不可用切换
	change_coupon(e){
		let _this = this
		_this.setData({
			CouponType: e.currentTarget.dataset.type
		})
	},

	/**
	 * 选择支付方式
	 */
	onSelectPayType(e) {
		let _this = this;
		// 设置当前支付方式
		_this.setData({
			curPayType: e.currentTarget.dataset.value,
			showPayPopup:!_this.data.showPayPopup
		});

	},


	/**
	 * 买家留言
	 */
	bindRemark(e) {
		let _this = this;
		_this.setData({
			remark: e.detail.value
		})
	},

	/**
	 * 快递配送：选择收货地址
	 */
	onSelectAddress() {
		wx.navigateTo({
			url: '/pages/address/' + (this.data.exist_address ? 'index?from=product_buy' : 'create')
		});
	},

	/**
	 * 订单提交
	 */
	onSubmitOrder() {
		let _this = this;
		if (_this.data.disabled) {
			return false;
		}
		
		let prom_type = _this.data.prom_type;
		let addr_id = _this.data.address.addr_id || 0;
		if (addr_id == 0 && 0 == prom_type) {
			App.showError('请添加收货地址', function(){
				_this.onSelectAddress();
			});
			return false;
		}

		let postData = {
			prom_type: prom_type,
			addr_id: addr_id,
			pay_type: _this.data.curPayType,
			querystr: _this.data.options.querystr,
			remark: _this.data.remark || '',
			coupon_id: _this.data.selectCouponId,
		};
		if(_this.data.product_data[0].active_time_id){
			postData.order_source = '20';
			postData.order_source_id = _this.data.product_data[0].active_time_id;
		}
		
		App._requestPost(_this,
			App.globalData.config.shopOrderPayUrl,
			postData,
			function (res) {
				let order_id = res.data.OrderData.order_id;
				let order_code = res.data.OrderData.order_code;
				_this.setData({
					order_id,
					order_code
				});
				if (_this.data.curPayType == 1) {
					if (res.data.WeChatPay.return_code == 'FAIL') {
						App.showError(res.data.WeChatPay.return_msg, () => {});
						return false;
					}
					App.wxPayment({
						order_id:order_id,
						payment: res.data.WeChatPay,
						success: res1 => {
							_this.setData({
								is_cart_pay: _this.data.options.querystr ? false : true,
								is_buy_pay: _this.data.options.querystr ? true : false
							});
							_this.OrderPayDealWith();
						},
						fail: res1 => {
							if (!res.msg.error) {
								App.showError(res.msg.error, () => {
									// _this.redirectToOrderIndex();
								});
							}
						},
					});
				} else if (_this.data.curPayType == 2) {
					App.showSuccess(res.msg, () => {
						_this.redirectToOrderIndex();
					});
				}
			},
			function (res) {
				App.showError(res.msg);
			}
		);
	},

	OrderPayDealWith: function () {
		let _this = this;
		let order_id = this.data.order_id;
		let order_code = this.data.order_code;
		if (order_id && order_code) {
			App._requestPost(_this,
				App.globalData.config.shopOrderPayDealWithUrl, {
					order_id: order_id,
					order_code: order_code
				},
				function (res) {
					App.showSuccess(res.msg, function () {
						wx.redirectTo({
							url: res.url
						});
					});
				},
				function (res) {
					App.showError(res.msg);
				}
			);
		}
	},
	// 积分是否选择
	changeBg(e){
		let _this = this
		if (this.data.show) {
			_this.setData({
				show:false
			})
		} else {
			_this.setData({
				show:true
			})
		}
	},
	// 选择支付方式
	onTogglePopupPay(e) {
		let _this = this
		_this.setData({
			showPayPopup: !_this.data.showPayPopup
		})
	},
	 /**
	 * 选择优惠券(弹出/隐藏)
	 */
	onTogglePopupCoupon() {
		let _this = this;
			_this.setData({
				showBottomPopup: !_this.data.showBottomPopup
			});
	},
	/**
	 * 选择优惠券
	 */
	onSelectCoupon(e) {
		let _this = this;
		// 记录选中的优惠券id
		_this.setData({
			selectCouponId: e.currentTarget.dataset.id,
			coupon_price: _this.data.coupon_list[e.currentTarget.dataset.index].coupon_price
		});
		_this.onTogglePopupCoupon();
	},
		/**
	 * 不使用优惠券
	 */
	onNotUseCoupon() {
		let _this = this;
		_this.setData({
			selectCouponId: 0,
			coupon_price:0
		});
		// 重新获取订单信息
		// _this.getOrderData();
		// 隐藏优惠券弹层
		_this.onTogglePopupCoupon();
	},
});