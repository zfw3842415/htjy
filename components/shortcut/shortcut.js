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
const func = require('../../utils/func.js')
import setting from '../../setting.js';

Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },

    /**
     * 组件的属性列表
     * 用于组件自定义设置
     */
    properties: {
        shortcutType: String,
        isCollect: Number,
        aid: Number,
    },

    /**
     * 私有数据, 组件的初始数据
     * 可用于模版渲染
     */
    data: {
        // 弹窗显示控制
        isShow: false,
        transparent: true
    },

    /**
     * 组件的方法列表
     * 更新属性和数据的方法与更新页面数据的方法类似
     */
    methods: {

        /**
         * 导航菜单切换事件
         */
        _onToggleShow(e) {
            wx.pageScrollTo({
                scrollTop: 0
            })
            // this.setData({
            //   isShow: !this.data.isShow,
            //   transparent: false
            // })
        },

        /**
         * 导航页面跳转
         */
        _onTargetPage(e) {
            let url = e.currentTarget.dataset.url;
            func.switchTab(url, 'navigateTo');
        },

        _onMakePhone(e) {
            // 拨打电话
            wx.makePhoneCall({
                phoneNumber: setting.mobile
            })
        },

        _onCollect(e) {
            let _this = this;
              App._requestPost(_this,App.globalData.config.apiGetCollectUrl, {
                aid: _this.properties.aid
              }, result => {
                if (result.code === 1) {
            // _this.properties.isCollect = result.data.is_collect
            _this.setData({
              isCollect:result.data.is_collect
            })
                } else {
                  App.showError(result.msg);
                }
              },
              false,
              function() {
                wx.hideLoading();
              });
        }
    }
})
