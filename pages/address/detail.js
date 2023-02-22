let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,    //是否禁用    默认选择否
    region: '',        //之前选择的省市区
    regionNew: '',    //省市区
    error: '',
    detail: {},       //详细地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取当前地址信息
    this.getAddressDetail(options.address_id);
  },

  /**
   * 获取当前地址信息
   */
  getAddressDetail: function(address_id) {
    let _this = this;
    App._requestPost(_this,
      App.globalData.config.shopAddressActionUrl,
      {'action': 'find_detail', addr_id: address_id},
      function (res) {
        let detail = res.data.detail,
        region = res.data.region,
        regionNew = res.data.regionNew;
        _this.setData({
          detail,
          region,
          regionNew
        });
      },
      function (res) {
        App.showError(res.msg);
      }
    );
  },

  /**
   * 表单提交
   */
  saveData: function(e) {
    let _this = this,
    values = e.detail.value
    values.region = this.data.region
    values.action = 'find_edit'
    values.addr_id = _this.data.detail.addr_id;

    // 表单验证
    if (!_this.validation(values)) {
      App.showError(_this.data.error);
      return false;
    }

    // 按钮禁用
    // _this.setData({
    //   disabled: true
    // });

    // 提交到后端
    App._requestPost(_this,
      App.globalData.config.shopAddressActionUrl,
      values,
      function (res) {
        App.showSuccess(res.msg, function() {
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
  validation: function(values) {
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
  bindRegionChange: function(e) {
    let regionOld = e.detail.value;
    this.setData({
      region: regionOld
    });

    let regionNew = this.ProcessingProvince(regionOld);
    this.setData({
      regionNew: regionNew
    });
  },

  ProcessingProvince: function(addrData) {
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
  chooseAddress: function() {
    let _this = this,
    detail = _this.data.detail;
    wx.chooseAddress({
      success: function(res) {
        detail.consignee = res.userName;
        detail.mobile = res.telNumber;
        detail.address = res.detailInfo;
        detail.region = res.provinceName + ' ' + res.cityName + ' ' + res.countyName;
        detail.regionNew = _this.ProcessingProvince([res.provinceName]) + ' ' + res.cityName + ' ' + res.countyName;
        _this.setData({
          detail,
          region: [res.provinceName, res.cityName, res.countyName],
          regionNew: [_this.ProcessingProvince([res.provinceName]), res.cityName, res.countyName],
        });
      }
    })
  },
  
})