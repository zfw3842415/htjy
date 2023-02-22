const App = getApp();

const func = require('../../utils/func');
// 工具类
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品列表
    cart_list: [],
    // 推荐商品列表
    product: [],
    // 当前动作
    action: 'complete',
    // 是否全选
    checkedAll: false,
    // 商品总价格
    cartTotalPrice: 0,
    // 是否全选
    delCheckedAll: false,
    // 选择的商品
    delCheckedData: [],
    // 底部导航菜单
    tabbar: App.globalData.tabbar,
    disable:false,   //失效商品
	Time:Date.parse(new Date()), // 获取当前时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
    // 获取购物车列表
    _this.getCartList();
  },

  // 监听用户下拉动作
  onPullDownRefresh: function () {
    let _this = this;
    // 获取购物车列表
    _this.getCartList();
    wx.stopPullDownRefresh();
  },

  /**
   * 获取购物车列表
   */
  getCartList() {
    let _this = this;
    App._requestApi(_this, App.globalData.config.shopCartListUrl, {}, function (result) {
		if(result.data.cart_list) {
      var List = result.data.cart_list
      List.forEach((item,value) => {
				let started = '';
				let startTime = '';
				started = item.discount_end_date - Date.parse(new Date())  / 1000
				if(started > 0) {
					startTime = started
					_this.setData({
						started : startTime
					})
				}
				if(item.discount_active_id > 0 && (item.discount_end_date < ( _this.Time / 1000))){
          List[value]['disable'] = true;
          List[value]['selected'] = 0
        } else{
          List[value]['disable'] = false;
          List[value]['selected'] = 1
        }
			})
    }
		_this.updateTotalPrice(result.data.cart_list);
		_this.getTime();
		_this.setData({
		    product:result.data.product
		});
	  
    });
  },
  // 获取限时秒杀时间
  getTime() {
	  let _this = this
	  if (_this.data.started > 0) {
		let started = _this.data.started  
		  var interval = setInterval(function () {
		  var second = started ;
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
		  _this.setData({
			countDownDay: day,
			countDownHour: hrStr,
			countDownMinute: minStr,
			countDownSecond: secStr,
		  });
		  started--;
		}.bind(this), 1000);
	   }
  },
  /**
   * 更新购物车已选商品总价格
   */
  updateTotalPrice(cart_list) {
    let _this = this;
    let cart_list_length = 0;
    let cartTotalPrice = 0;
    if (cart_list.length > 0) {
      cart_list.forEach(item => {
        if (1 == item.selected) {
          cart_list_length++;
          cartTotalPrice += (Number(item.users_price) * Number(item.product_num));
        }
      });
    } else {
      let cart_list = [];
    }

    _this.setData({
      cart_list,
      cartTotalPrice: cartTotalPrice.toFixed(2),
      checkedAll: cart_list_length == cart_list.length
    });
  },

  /**
   * 切换编辑/完成
   */
  switchAction(e) {
    let _this = this;
    _this.setData({
      action: e.currentTarget.dataset.action
    });
  },

  /* 结算面板 -- Start */
  /**
   * 选择框选中
   */
  onChecked(e) {
    let _this = this,
      index = e.currentTarget.dataset.index,
      cart_list = _this.data.cart_list,
      cartListData = _this.data.cart_list[index];
    let postData = {
      action: 'selected',
      selected: cartListData.selected,
      product_id: cartListData.product_id,
      spec_value_id: cartListData.spec_value_id
    };
    // 后端同步更新
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    App._requestApi(
      _this,
      App.globalData.config.shopCartActionUrl,
      postData,
      function (result) {
        cartListData['selected'] = cartListData['selected'] == 1 ? 0 : 1;
        cart_list[index] = cartListData;
        _this.updateTotalPrice(cart_list);
        wx.hideLoading();
      }
    );
  },

  /**
   * 选择框全选
   */
  onCheckedAll(e) {
    let _this = this,
      cart_list = _this.data.cart_list,
      postData = {
        action: 'all_selected',
        all_selected: !_this.data.checkedAll ? 1 : 0
      };

    // 后端同步更新
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    App._requestApi(
      _this,
      App.globalData.config.shopCartActionUrl,
      postData,
      function (result) {
        cart_list.forEach(item => {
          item.selected = !_this.data.checkedAll ? 1 : 0
        });
        _this.setData({
          cart_list,
          checkedAll: !_this.data.checkedAll ? 1 : 0
        });
        _this.updateTotalPrice(cart_list);
        wx.hideLoading();
      }
    );
  },

  /**
   * 递增指定的商品数量
   */
  onAddCount(e) {
    let _this = this,
      index = e.currentTarget.dataset.index,
      cart_list = _this.data.cart_list,
      cartListData = _this.data.cart_list[index];

    cartListData['product_num']++;
    cart_list[index] = cartListData;
    // 后端同步更新
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    App._requestApi(
      _this,
      App.globalData.config.shopCartActionUrl, {
        action: 'add',
        product_id: cartListData.product_id,
        spec_value_id: cartListData.spec_value_id
      },
      function (result) {
        _this.updateTotalPrice(cart_list);
        wx.hideLoading();
      }
    );
  },

  /**
   * 递减指定的商品数量
   */
  onSubCount(e) {
    let _this = this,
      index = e.currentTarget.dataset.index,
      cart_list = _this.data.cart_list,
      cartListData = _this.data.cart_list[index];

    if (1 >= cartListData['product_num']) return false;

    cartListData['product_num']--;
    cart_list[index] = cartListData;
    // 后端同步更新
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    App._requestApi(
      _this,
      App.globalData.config.shopCartActionUrl, {
        action: 'less',
        product_id: cartListData.product_id,
        spec_value_id: cartListData.spec_value_id
      },
      function (result) {
        _this.updateTotalPrice(cart_list);
        wx.hideLoading();
      }
    );
  },

  /**
   * 购物车结算
   */
  submit() {
    let _this = this
    console.log(_this.data)
    if(_this.data.cartTotalPrice != '0.00' && _this.data.cartTotalPrice != '0'){
      wx.navigateTo({
        url: '/pages/product_buy/index'
      });
    }else{
      App.showError("请选择购买商品");
    }
    
  },
  /* 结算面板 -- END */

  /* 删除面板 -- Start */
  /**
   * 单选
   */
  onDelChecked(e) {
    let _this = this,
      index = e.currentTarget.dataset.index,
      cart_list = _this.data.cart_list,
      cartListData = _this.data.cart_list[index],
      delCheckedData = _this.data.delCheckedData;

    cartListData['delChecked'] = cartListData['delChecked'] == 1 ? 0 : 1;
    cart_list[index] = cartListData;

    if (1 == cartListData['delChecked']) {
      delCheckedData[index] = cartListData;
    } else if (0 == cartListData['delChecked']) {
      delCheckedData.splice(index, 1);
    }

    let delCheckedDataLength = 0;
    cart_list.forEach(item => {
      if (1 == item.delChecked) {
        delCheckedDataLength++;
      }
    });

    _this.setData({
      cart_list,
      delCheckedData,
      delCheckedAll: delCheckedDataLength == cart_list.length
    });
  },

  /**
   * 全选/反选
   */
  onDelCheckedAll(e) {
    let _this = this,
      delCheckedDataLength = 0,
      cart_list = _this.data.cart_list,
      delCheckedData = _this.data.delCheckedData;
    cart_list.forEach(item => {
      item.delChecked = !_this.data.delCheckedAll ? 1 : 0;
      if (1 == item.delChecked) {
        delCheckedDataLength++;
      }
    });

    if (!_this.data.delCheckedAll) {
      delCheckedData = cart_list;
    } else {
      delCheckedData = [];
    }

    _this.setData({
      cart_list,
      delCheckedData,
      delCheckedAll: !_this.data.delCheckedAll ? 1 : 0
    });
  },

  /**
   * 删除商品
   */
  onDelete(e) {
    let _this = this;
    // let cart_ids = [];
    // let delCheckedData = _this.data.delCheckedData;
    // delCheckedData.forEach((item, index) => {
    //   cart_ids.push(item.cart_id);
    // });
	let cart_ids = [e.currentTarget.dataset.aid];
	
    // 后端同步更新
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    App._requestPost(_this,
      App.globalData.config.shopCartActionUrl, {
        action: 'del',
        cart_id: cart_ids
      },
      function (result) {
        _this.setData({
          action: 'edit'
        });
        _this.getCartList();
		App.showSuccess('删除成功');
        wx.hideLoading();
      },
      function (result) {
        App.showError(result.msg);
      }
    );
  },

  /**
   * 获取已选中的商品
   */
  getCheckedIds() {
    let _this = this;
    let arrIds = [];
    _this.data.goods_list.forEach(item => {
      if (item.checked === true) {
        arrIds.push(`${item.goods_id}_${item.goods_sku_id}`);
      }
    });
    return arrIds;
  },

  /**
   * 加法
   */
  mathadd(arg1, arg2) {
    return (Number(arg1) + Number(arg2)).toFixed(2);
  },

  /**
   * 减法
   */
  mathsub(arg1, arg2) {
    return (Number(arg1) - Number(arg2)).toFixed(2);
  },

  /**
   * 去购物
   */
  goShopping() {
    wx.navigateTo({
      url: '/pages/archives/product/list?typeid=3',
    })
  },
  jumpToView: function (e) {
    let  _this = this;
    let filed = e.currentTarget.dataset.aid
    if(filed.discount_active_id >= 0 && ((filed.discount_end_date == (null || 0)) || (filed.discount_end_date < ( _this.data.Time / 1000)))) {
      let url = `/pages/archives/product/view?aid=${filed.product_id}`
      wx.navigateTo({
        url: url
      })
    } else{
      let url = `/pages/archives/product/discount_detail?aid=${filed.product_id}&active_id=${filed.discount_active_id}`
      wx.navigateTo({
        url: url
      })
    }
    // func.jumpToView(e);

  },

  //推荐商品添加购物车
  addCart: function(e){
    func.addCart(e,'reload');
  }

})