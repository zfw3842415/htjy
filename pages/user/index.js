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

const func = require('../../utils/func');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLogin: false, // 是否登录
		userInfo: {}, // 用户信息
		orderCount: {}, // 订单数量
		globalConf: App.globalData,
		// 底部导航菜单
		tabbar: App.globalData.tabbar,
		shop_open:'',  //1是商场版    0企业版 
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
	
	},
	
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		this.ztabbar = this.selectComponent('#ztabbar');
	},
/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		let _this = this;
		_this.setData({
			isLogin: App.checkIsLogin()
		});
		// 获取当前用户信息
		_this.getUserDetail();
	},
    inputValue(e) {
        let _this = this;
        _this.setData({
            nickname:e.detail.value
        })
    },

	/**
	 * 下拉刷新
	 */
	onPullDownRefresh: function () {
		let _this = this;
		// 获取当前用户信息
		wx.stopPullDownRefresh()
	},

	/**
	 * 获取当前用户信息
	 */
	getUserDetail() {
		let _this = this;
		App._requestApi(_this, App.globalData.config.apiUsersdetailUrl, {}, function (result) {
      console.log(result)
      let shop_open = 1
			if (!result.data.userInfo) {
				result.data.isLogin = false;
				// 移除token users_id
				wx.removeStorageSync('token');
				wx.removeStorageSync('users_id');
			}
			_this.setData(result.data);
			_this.setData({
				shop_open
			})
		});
	},
	onChooseAvatar(e) {
		console.log(e)
		let _this = this;
		const {avatarUrl} = e.detail;
		wx.uploadFile({
		  filePath: avatarUrl,
		  name: 'file',
		  url: App.globalData.config.shopUploadsUrl,
		  success:function(res) {
			  let result = typeof res.data === 'object' ? res.data : JSON.parse(res.data);
			  if(result.code === 1) {
				  _this.setData({
					  avatarUrl:App.globalData.config.domain + result.data.img_url
				  })
			  }
		  }
		})
	},
	// 跳转到登录界面
	navtoGoPage(e) {
		let _this = this
		if (!_this.onCheckLogin()) {
			return false;
		}

		let Url = e.currentTarget.dataset.url
		wx.navigateTo({
			url: Url,
		})
	},
	/**
	 * 订单导航跳转
	 */
	onTargetOrder(e) {
		let _this = this;
		if (!_this.onCheckLogin()) {
			return false;
		}
		// 记录formid
		App.saveFormId(e.detail.formId);
		let urls = {
			all: '/pages/order/index?type=all',
			payment: '/pages/order/index?type=payment',
			received: '/pages/order/index?type=received',
			complete: '/pages/order/index?type=complete',
		};
		// 转跳指定的页面
		wx.navigateTo({
			url: urls[e.currentTarget.dataset.type]
		})
	},
	navLink(e){
		let Url = e.currentTarget.dataset.url
		wx.showToast({
			title: '敬请期待哦~',
			duration: 2000,
			success: (res) => {
				// wx.navigateTo({
				//   url: Url,
				// })   //跳转路径
			},
			fail: (res) => {},
			complete: (res) => {},
		})
		// wx.navigateTo({
		//   url: Url,
		// })
	},
	/**
	 * 菜单列表导航跳转
	 */
	onTargetMenus(e) {
		let _this = this;
		if (!_this.onCheckLogin()) {
			return false;
		}
		// 记录formId
		// App.saveFormId(e.detail.formId);
		wx.navigateTo({
			url: '/' + e.currentTarget.dataset.url
		})
	},

	/**
	 * 跳转到登录页
	 */
	onLogin() {
		App.doLogin();
	},

	/**
	 * 验证是否已登录
	 */
	onCheckLogin() {
		let _this = this;
		if (!_this.data.isLogin) {
			App.showError('很抱歉，您还没有登录');
			return false;
		}
		return true;
	},

	/**
	 * 跳转收货地址页面
	 */
	onAddressList(e) {
		let _this = this;
		if (!_this.onCheckLogin()) {
			return false;
		}
		// 记录formId
		App.saveFormId(e.detail.formId);
		wx.navigateTo({
			url: '/pages/address/index'
		})
	},
	switchTab: function (e) {
		func.switchTab(e);
	},
	onLogout: function (e) {
		let _this =  this
		// 移除token users_id
		wx.removeStorageSync('token');
		wx.removeStorageSync('users_id');
		wx.reLaunch({
			url: e.currentTarget.dataset.url
		})
		_this.onPullDownRefresh()
	},

	jumpToView: function (e) {
		func.jumpToView(e);
	},
	
	//推荐商品添加购物车
	addCart: function (e) {
		func.addCart(e);
	},
	edit:function (e) {
		wx.navigateTo({
			url: '/pages/user/edit/index'
		})
	},


	// 判断是否登录 并 跳转到指定的URL页面
	jumpSpecifyUrl(e) {
		let _this = this;

		// 判断是否登录
		if (!_this.onCheckLogin()) {
			return false;
		}

		// 转跳指定的页面
		wx.navigateTo({url: e.currentTarget.dataset.url});
	},
	saveData(e){
        let _this = this;
        // 推荐人信息
        // 保存会员授权信息
        App._requestPost(_this, App.globalData.config.userSaveUserInfoUrl, {
            head_pic: _this.data.avatarUrl,
            nickname: e.detail.value.name,
        }, result => {
            _this.showLoginPopup()
            wx.reLaunch({
                url:'/pages/user/index'
            })
        })
	},
	// 跳转到登录页
	showLoginPopup() {
        let _this = this;
        _this.setData({
            Login:!_this.data.Login
        })
    },


})