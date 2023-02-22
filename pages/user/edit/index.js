/**
 * 易优CMS
 * ============================================================================
 * 版权所有 2016-2028 海南赞赞网络科技有限公司，并保留所有权利。
 * 网站地址: http://www.eyoucms.com
 * ----------------------------------------------------------------------------
 * 如果商业用途务必到官方购买正版授权, 以免引起不必要的法律纠纷.
 * ============================================================================
 * Author: 小虎哥 <1105415366@qq.com>
 * Date: 2020-1-1
 */

const App = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {}, // 用户信息
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		let _this = this;
		_this.getUserDetail()
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},
	
	/**
	 * 获取当前用户信息
	 */
	getUserDetail() {
		let _this = this;
		App._requestApi(_this, App.globalData.config.apiUsersdetailUrl, {}, function(result) {
			if (!result.data.userInfo) {
				result.data.isLogin = false;
				// 移除token users_id
				wx.removeStorageSync('token');
				wx.removeStorageSync('users_id');
			}
			_this.setData({
				userInfo: result.data.userInfo
			})
		});
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

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
		this.getUserDetail();
		wx.stopPullDownRefresh()
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	},

	//选择图片
	chooseImage: function(e) {
		let _this = this;
		_this.getUserDetail()
		// .log(userInfo)
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'], // 默认原图和压缩图
			sourceType: ['album', 'camera'], // 默认指定来源是相册和相机
			success: function(res) {
				//上传
				wx.uploadFile({
					url: App.globalData.config.userUploadHeadPicUrl,
					filePath: res.tempFilePaths[0],
					name: 'file',
					success: function(res) {
						let result = typeof res.data === "object" ? res.data : JSON
							.parse(res.data);
						if (result.code === 1) {
							_this.setData({
								'userInfo.head_pic': result.data.img_url
							})
						}
					}
				});
			}
		});
	},

	// 保存
	submitUpNickname() {
		let _this = this;
		let userInfo = _this.data.userInfo;
		App._requestPost(_this, App.globalData.config.userSaveUserInfoUrl, {
			head_pic: userInfo.head_pic,
			mobile: userInfo.mobile,
		}, result => {
			App.showSuccess('修改成功!', function() {
			  wx.navigateTo({
			    url: "/pages/user/index"
			  });
			});
			
		})
	},
	
	//获取手机号
	getPhoneNumber (e){
		let _this = this;
		App._requestPost(_this,
			App.globalData.config.apiGetPhoneUrl,
			{code: e.detail.code},
			function (res) {
				_this.setData({
					'userInfo.mobile':res.data.phoneNumber
				})
			},
			function (res) {
				App.showError(res.msg);
			}
		);
	}

})
