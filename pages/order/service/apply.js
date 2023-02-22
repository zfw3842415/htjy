const App = getApp();
const func = require('../../../utils/func');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// 订单主ID
		order_id: 0,
		// 商品ID
		product_id: 0,
		// 商品副ID
		details_id: 0,
		// 商品信息
		goodsData: {},
		// 表单数据
		formData: [],
		// 售后类型
		serviceType: [
			{name: '我要换货', id: 1},
			{name: '我要退货', id: 2}
		],
		// 售后内容字数限制
		contentLength: 300,
		// 是否正在加载中，默认是
		isLoading: true,
	},

	submitDisable: false,

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		let _this = this;
		// 设置数据类型
		_this.setData({
			order_id: options.order_id > 0 ? options.order_id : 0,
			details_id: options.details_id > 0 ? options.details_id : 0,
			product_id: options.product_id > 0 ? options.product_id : 0,
		});

		// 查询订单商品是否可申请售后
		_this.getOrderGoodsService();
	},

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
				order_id: _this.data.order_id,
				details_id: _this.data.details_id,
				product_id: _this.data.product_id
			},
			function (result) {
				if (result.url && !result.data) {
					wx.navigateTo({url: result.url});
				} else {
					_this.setData({
						isLoading: false,
						goodsData: result.data ? result.data : {}
					});
					_this.initFormData(result.data);
				}
			},
			function (result) {
				wx.navigateBack({delta: 1});
			}
		);
	},

	// 初始化form数据
	initFormData: function(goodsData) {
		let _this = this;
		let formData = {};
		if (goodsData) {
			formData = {
				content: '',
				uploaded: [],
				upload_img: [],
				service_type: 1,
				litpic: goodsData.litpic,
				mobile: goodsData.mobile,
				address: goodsData.address,
				consignee: goodsData.consignee,
				order_id: goodsData.order_id,
				order_code: goodsData.order_code,
				details_id: goodsData.details_id,
				product_id: goodsData.product_id,
				product_num: goodsData.product_num,
				product_name: goodsData.product_name,
				product_price: goodsData.product_price
			};
		}
		_this.setData({formData: formData});
	},

	// 服务类型
	switchServiceType(e) {
		// 获取数据
		let _this = this;
		let service_type = e.detail.value;
		let formData = _this.data.formData;
		// 处理数据
		formData['service_type'] = service_type;
		// 重载数据
		_this.setData({formData: formData});
	},

	// 问题描述
	contentInput: function(e) {
		// 获取数据
		let _this = this;
		let content = e.detail.value;
		let formData = _this.data.formData;
		// 处理数据
		let contentLength = 300 - content.length
		formData['content'] = content;
		// 重载数据
		_this.setData({
			formData: formData,
			contentLength: contentLength
		});
	},

	// 选择图片
	chooseImage: function(e) {
		// 获取图片数据
		let _this = this;
		let formData = _this.data.formData;
		let uploadImg = formData.upload_img;

		// 上传图片数据
		wx.chooseImage({
			count: 6 - uploadImg.length,
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function(res) {
				res.tempFilePaths.forEach(function(item, formIndex) {
					uploadImg.push(item);
				});
				formData['upload_img'] = uploadImg;
				// 重载图片数据
				_this.setData({formData: formData});
			}
		});
	},

	// 查看图片
	priviewImg: function (e) {
		// 获取数据
		var _this = this;
		var index = e.currentTarget.dataset.index;
		let formData = _this.data.formData;
		let uploadImg = formData.upload_img;
		// 重载数据
		wx.previewImage({
			//当前显示图片
			current: uploadImg[index],
			//所有图片
			urls: uploadImg
		});
	},

	// 删除图片
	delImg: function(e) {
		// 获取数据
		var _this = this;
		var index = e.currentTarget.dataset.index;
		let formData = _this.data.formData;
		let uploadImg = formData.upload_img;
		// 处理数据
		uploadImg.splice(index, 1);
		formData['upload_img'] = uploadImg;
		// 重载数据
		_this.setData({formData: formData});
	},

	submitService: function() {
		// 获取数据
		let _this = this;
		let formData = _this.data.formData;
		
		// 判断是否重复提交
		if (_this.submitDisable === true) return false;
		// 表单提交按钮设为禁用 (防止重复提交)
		_this.submitDisable = true;

		// 动画提示
		wx.showLoading({title: '正在处理...', mask: true});

		// 评论内容不允许为空
		if (formData.content === '') {
			wx.hideLoading();
			_this.submitDisable = false;
			App.showError('请输入问题描述...');
			return false;
		}

		// form提交执行函数
		let fromPostCall = function(formData) {
			App._requestPost(_this, App.globalData.config.apiHandleOrderServiceActionUrl, {
				action: 'addService',
				formData: JSON.stringify(formData)
			}, result => {
				if (result.code === 1) {
					App.showSuccess(result.msg, function() {
						wx.navigateBack();
					});
				} else {
					App.showError(result.msg);
				}
			},
			false,
			function() {
				wx.hideLoading();
				_this.submitDisable = false;
			});
		};

		// 申请售后图片数
		let uploadImgLength = formData.upload_img.length;

		// 判断是否需要上传图片
		uploadImgLength > 0 ? _this.uploadFile(uploadImgLength, formData, fromPostCall) : fromPostCall(formData);
	},
	
	// 上传图片
	uploadFile: function(uploadImgLength, formData, callBack) {
		// 文件上传
		if (formData.content !== '') {
			let i = 0;
			formData.upload_img.forEach(function(filePath, fileKey) {
				wx.uploadFile({
					url: App.globalData.config.shopUploadsUrl,
					filePath: filePath,
					name: 'file',
					success: function(res) {
						let result = typeof res.data === "object" ? res.data : JSON.parse(res.data);
						if (result.code === 1) formData.uploaded[fileKey] = result.data.img_url;
					},
					complete: function() {
						i++;
						if (uploadImgLength === i) {
							// 所有文件上传完成
							// 执行回调函数
							callBack && callBack(formData);
						}
					}
				});
			});
		} else {
			wx.hideLoading();
			_this.submitDisable = false;
			App.showError('请输入问题描述...');
		}
	},
})