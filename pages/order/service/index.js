const App = getApp();
const func = require('../../../utils/func');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		// 分页数
		page: 1,
		// 贸易类型，国内贸易=1，跨境贸易=2，默认1
		serviceStatus: 0,
		// 商品信息
		serviceList: [],
		// 是否正在加载中
		isLoading: true,
		// 售后订单状态
		dataType: 0,
		// 列表容器高度
		scrollHeight: null,
		// 没有更多数据
		no_more: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let _this = this;
		// 设置scroll-view高度
		_this.setListHeight();
	},

	/**
	 * 设置商品列表高度
	 */
	setListHeight() {
		let systemInfo = wx.getSystemInfoSync(),
			rpx = systemInfo.windowWidth / 750, // 计算rpx
			tapHeight = Math.floor(rpx * 88), // tap高度
			scrollHeight = systemInfo.windowHeight - tapHeight; // swiper高度
		this.setData({scrollHeight});
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		let _this = this;
		// 查询服务订单列表
		_this.getServiceOrderList();
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		let _this = this;
		// 查询服务订单列表
		_this.getServiceOrderList();
		wx.stopPullDownRefresh();
	},

	// 查询服务订单列表
	getServiceOrderList() {
		let _this = this;
		App._requestPost(_this, App.globalData.config.apiHandleOrderServiceActionUrl, {
				action: 'getServiceList',
				serviceStatus: _this.data.serviceStatus,
			},
			function (result) {
				_this.setData({
					isLoading: false,
					serviceList: result.data.data ? result.data.data : []
				});
			},
			function (result) {
				App.showSuccess(result.msg, function() {
					wx.navigateBack({delta: 1});
				});
			}
		);
	},


	switchServiceStatus(e) {
		let _this = this;
		var type = e.currentTarget.dataset.type;
		let serviceStatus = !e ? _this.data.serviceStatus : e.currentTarget.dataset.type;
		if (_this.data.serviceStatus == type) {
			return false
		} else {
			_this.setData({
				page: 1,
				serviceList: [],
				isLoading: true,
				serviceStatus: serviceStatus,
			});
			// 获取订单列表
			_this.getServiceOrderList();
		}
	},

	// 跳转订单详情页
	navigateToDetail(e) {
		let _this = this;
		let service_id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: '../service/detail?service_id=' + service_id
		});
	},

	// 下拉到底加载数据
	bindDownLoad() {
		// 已经是最后一页
		if (this.data.page >= this.data.list.last_page) {
			this.setData({
				no_more: true
			});
			return false;
		}
		// 加载下一页列表
		this.getServiceOrderList(true, ++this.data.page);
	},

});