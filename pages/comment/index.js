const App = getApp();

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		aid: 0, //产品id
		total_score: 0, //评分，1：好评，2中评，3差评
		list: [], // 评论列表
		page: 1, // 当前页码
		// show
		notcont: false,
		//更多
		more: false,
		have_img_count:0,//有图数量
		type: 'all' //all 全部 img有图
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		let _this = this;

		// 记录页面参数
		_this.setData({
			aid: options.aid
		}, function() {
			// 获取评论列表
			_this.getCommentList();
		});
	},
	/**
	 * 获取评论列表
	 */
	getCommentList: function(page) {
		let _this = this;
		App._requestApi(_this, App.globalData.config.shopCommentListUrl, {
			page: page || 1,
			type: _this.data.type, //类型  all-全部 img-有图/视频
			// total_score: _this.data.total_score,
			aid: _this.data.aid
		}, function(result) {
			let resultList = result.data.data,
				have_img_count = result.data.have_img_count,
				dataList = _this.data.list;
				resultList.forEach((value, index) => {
					_this.setData({
						add_time:value.add_time.split(' ')[0]
					})
				})
			if (result.data.total == 0) {
				_this.setData({
					list: resultList,
					total: result.data.count,
					notcont: !resultList.length
				});
			} else {
				_this.setData({
					list: dataList.concat(resultList),
					total: result.data.count,
					have_img_count:have_img_count
				});
				if (result.data.last_page == result.data.current_page) {
					_this.setData({
						more: true
					});
				}
			}
		});
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},
	// 筛选状态改变
	change(e) {
		let _this = this
		_this.setData({
			list: [],
			page: 1,
			type: e.target.dataset.type
		})
		_this.getCommentList();
	},
	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		// 不是最后一页
		if (this.data.more == false) {
			this.getCommentList(++this.data.page);
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	},

	/**
	 * 图片预览
	 */
	previewImages: function(e) {
		let commentIndex = e.target.dataset.commentIndex,
			imgIndex = e.target.dataset.imgIndex,
			images = this.data.list[commentIndex].upload_img,
			imageUrls = [];
		images.forEach(function(item) {
			imageUrls.push(item);
		});
		wx.previewImage({
			current: imageUrls[imgIndex],
			urls: imageUrls
		})
	},
})
