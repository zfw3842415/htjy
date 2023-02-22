let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    nav_select: false, // 快捷导航

    name: '',         //收货人姓名
    region: '',       
    regionNew: '',    //地址省市区
    phone: '',        //收货人手机号码
    detail: '',       //具体地址

    error: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    App._requestApi(
      _this,
      App.globalData.config.shopAddressListUrl, {},
      function (res) {
        if (!res.data.list.length) {
          // _this.chooseAddress();   //没有地址默认获取微信地址
        }
      }
    );
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 表单提交
   */
  saveData: function (e) {
    let _this = this,
    values = e.detail.value
    values.region = this.data.region
    values.regionNew = this.data.region
    values.action = 'find_add';

    // 表单验证
    if (!_this.validation(values)) {
      App.showError(_this.data.error);
      return false;
    }

    // 按钮禁用
    _this.setData({
      disabled: true
    });

    App._requestPost(_this,
      App.globalData.config.shopAddressActionUrl,
      values,
      function (res) {
        App.showSuccess(res.msg, function () {
          wx.navigateBack();
        });
      },
      function (res) {
        App.showError(res.msg);
      }
    );
  },

  /**
   * 表单验证
   */
  validation: function (values) {
    if (values.name === '') {
      this.data.error = '收件人不能为空';
      return false;
    }
    if (values.phone.length < 1) {
      this.data.error = '手机号不能为空';
      return false;
    }
    let reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;
    if (!reg.test(values.phone)) {
      this.data.error = '手机号不符合要求';
      return false;
    }
    if (!this.data.region) {
      this.data.error = '省市区不能空';
      return false;
    }
    if (values.detail === '') {
      this.data.error = '详细地址不能为空';
      return false;
    }
    return true;
  },

  /**
   * 修改地区
   */
  bindRegionChange: function (e) {
    let addrData = this.ProcessingProvince(e.detail.value);
    this.setData({
      region: e.detail.value,
      regionNew: addrData
    });
  },

  ProcessingProvince: function (addrData) {
    if ('山西省' == addrData[0]) {
      addrData[0] = '山西省';
    } else if ('内蒙古自治区' == addrData[0]) {
      addrData[0] = '内蒙古';
    } else if ('广西壮族自治区' == addrData[0]) {
      addrData[0] = '广西';
    } else if ('西藏自治区' == addrData[0]) {
      addrData[0] = '西藏';
    } else if ('宁夏回族自治区' == addrData[0]) {
      addrData[0] = '宁夏';
    } else if ('新疆维吾尔族自治区' == addrData[0]) {
      addrData[0] = '新疆';
    } else if ('香港特别行政区' == addrData[0]) {
      addrData[0] = '香港';
    } else if ('澳门特别行政区' == addrData[0]) {
      addrData[0] = '澳门';
    } else if ('台湾省' == addrData[0]) {
      addrData[0] = '台湾省';
    }
    return addrData;
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
      }
    })
  },

})