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

const func = require('../../utils/func.js')
import setting from '../../setting.js';

Component({
  options: {

  },
  data: {
    tabbar: Object,
  },
  ready() {
    this._setTabBar(this, setting.tabbar);
  },
  methods: {
    _switchTab(e) {
      let url = '';
      if (typeof e === 'object') {
        let data = e.currentTarget.dataset;
        url = data.path;
      } else {
        url = e;
      }
      let firstchat = url.substr(0, 1);
      if (firstchat != '/') url = '/' + url;

      if ('/pages/index/index' == url) {
        wx.reLaunch({
          url
        });
      } else {
        wx.navigateTo({
          url
        });
      }
    },
    _setTabBar: function (that, tabbar) {
      let selected = -1;
      let blist = tabbar.list;
      let urlData = func.getRouteUrl();
      let currentPath = urlData.path;
      let typeid = urlData.typeid;
      for (let i in blist) {
        if (blist[i]) {
          let pagePath = blist[i].pagePath + `?`;
          pagePath = '/' + pagePath.replace(/(^\/*)/g, "");
          if (pagePath.indexOf(`/pages/archives/custom/list?`) > -1) {
            if (pagePath.indexOf(`?typeid=${typeid}?`) > -1 || pagePath.indexOf(`?typeid=${typeid}&`) > -1) {
              selected = parseInt(i);
              break;
            }
          } else if (pagePath.indexOf(`/pages/archives/custom/view?`) > -1) {
            if (pagePath.indexOf(`?typeid=${typeid}?`) > -1 || pagePath.indexOf(`?typeid=${typeid}&`) > -1) {
              selected = parseInt(i);
              break;
            }
          } else if (pagePath.indexOf(`/${currentPath}?`) > -1) {
            selected = parseInt(i);
            break;
          }
        }
      }
      tabbar.selected = selected;
      that.setData({
        tabbar: tabbar
      });
      try {
        wx.setStorageSync('tabbar', tabbar);
      } catch (e) {}
    },
  }
})