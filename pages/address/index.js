let App = getApp();

Page({
  data: {
    list: [],            //地址列表
    default_id: null,    //默认地址选择
  },

  onLoad: function(options) {
    let _this = this
    // 当前页面参数
    _this.data.options = options;

  },

  onShow: function() {
    // 获取收货地址列表
    this.getAddressList();

  },

  // 监听用户下拉动作
  onPullDownRefresh: function () {
    // 获取收货地址列表
    this.getAddressList();
    wx.stopPullDownRefresh()
  },

  /**
   * 获取收货地址列表
   */
  getAddressList: function() {
    let _this = this;
    App._requestApi(
      _this,
      App.globalData.config.shopAddressListUrl,
      {},
      function (res) {
        let list = res.data.list;
        let default_id = res.data.default_id;
        _this.setData({
          list,
          default_id
        });
      },
      function (res) {
        App.showError(res.msg);
      }
    );
   
  },

  /**
   * 添加新地址
   */
  createAddress: function() {
    wx.navigateTo({
      url: '/pages/address/create'
    });
  },

  /**
   * 编辑地址
   */
  editAddress: function(e) {
    wx.navigateTo({
      url: "./detail?address_id=" + e.currentTarget.dataset.id
    });
  },

  /**
   * 移除收货地址
   */
  removeAddress: function(e) {
    let _this = this,
    address_id = e.currentTarget.dataset.id;
    if (address_id) {
      wx.showModal({
        title: "提示",
        content: "您确定要移除当前收货地址吗?",
        success: function(o) {
          if(o.confirm){
            App._requestPost(_this,
              App.globalData.config.shopAddressActionUrl,
              {'action': 'find_del', addr_id: address_id},
              function (res) {
                _this.getAddressList();
              },
              function (res) {
                App.showError(res.msg);
              }
            );
          }
        }
      });
    }
  },
  
  /**
   * 获取微信地址
   */
  chooseAddress: function () {
    let _this = this;
    wx.chooseAddress({
      success: function (res) {
        _this.setData({
          name: res.userName,
          phone: res.telNumber,
          region: [res.provinceName, res.cityName, res.countyName],
          regionNew: [res.provinceName, res.cityName, res.countyName],
          detail: res.detailInfo
        });
        setTimeout(() => {
          _this.saveData()
        })
      }
    })
  },
  
  /**
   * 表单提交
   */
  saveData(e) {
    let _this = this
    let value= {action:'find_add', name:_this.data.name, phone:_this.data.phone, detail:_this.data.detail, region:_this.data.region, regionNew:_this.data.regionNew}
    App._requestPost(_this,
      App.globalData.config.shopAddressActionUrl,
      value,
      function (res) {
        App.showSuccess(res.msg, function () {
          _this.getAddressList();
        });
      },
      function (res) {
        App.showError(res.msg);
      }
    );
    _this.onPullDownRefresh()
  },
  /**
   * 设置为默认地址
   */
  setDefault: function(e) {
    let _this = this,
    address_id = e.detail.value;
    if (address_id) {
      _this.setData({
        default_id: parseInt(address_id)
      });
      App._requestPost(_this,
        App.globalData.config.shopAddressActionUrl,
        {'action': 'default', addr_id: address_id},
        function (res) {
          if (_this.data.options.from === 'product_buy') wx.navigateBack();
        },
        function (res) {
          App.showError(res.msg);
        }
      );

      return false;  
    }
  },

});