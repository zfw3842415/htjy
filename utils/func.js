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

module.exports = {
  showError(msg, callback) {
    wx.showModal({
      title: '报错提示',
      content: msg,
      showCancel: false,
      success(res) {
        callback && callback();
      }
    });
  },
  // 保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面
  navigateTo: function (url) {
    wx.navigateTo({
      url: url
    })
  },
  // 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages()) 获取当前的页面栈，决定需要返回几层。
  navigateBack: function (delta) {
    wx.navigateBack({
      delta: delta
    })
  },
  //跳转到指定页
  jumpToUrl: function (e) {
    let url = e.currentTarget.dataset.path
    wx.redirectTo({
      url: url
    })
  },
  //跳转到详情页
  jumpView: function (e) {
    let url = e.currentTarget.dataset.url
    if (!url) {
      let field = e.currentTarget.dataset.field;
      if (!field) {
        this.showError('jumpView事件的同一元素上缺少属性 data-field')
        return false;
      }
      let aid = field.aid,
        typeid = field.typeid,
        channel = field.channel;
      if (!url && aid > 0) {
        if (1 == channel) {
          url = `/pages/archives/article/view?aid=${aid}&typeid=${typeid}`
        } else if (2 == channel) {
          url = `/pages/archives/product/view?aid=${aid}&typeid=${typeid}`
        } else if (3 == channel) {
          url = `/pages/archives/images/view?aid=${aid}&typeid=${typeid}`
        } else if (4 == channel) {
          url = `/pages/archives/download/view?aid=${aid}&typeid=${typeid}`
        } else if (5 == channel) {
          url = `/pages/archives/media/view?aid=${aid}&typeid=${typeid}`
        } else if (6 == channel) {
          url = `/pages/archives/single/view?typeid=${typeid}`
        } else if (7 == channel) {
          url = `/pages/archives/special/view?aid=${aid}&typeid=${typeid}`
        } else {
          url = `/pages/archives/custom/view?aid=${aid}&typeid=${typeid}`
        }
      }
    }
    wx.navigateTo({
      url: url
    })
  },
  // 跳转到列表页
  jumpList: function (e) {
    let url = e.currentTarget.dataset.url
    if (!url) {
      let typeid = e.currentTarget.dataset.typeid;
      let channel = e.currentTarget.dataset.channel;

      if (typeid || channel) {
          if (!typeid) {
            this.showError('jumpList事件的同一元素上缺少属性 data-typeid')
            return false;
          }
          if (!channel) {
            this.showError('jumpList事件的同一元素上缺少属性 data-channel')
            return false;
          }
      } else {
          let field = e.currentTarget.dataset.field;
          if (!field) {
            this.showError('jumpList事件的同一元素上缺少属性 data-field')
            return false;
          }
          typeid = field.typeid || field.id;
          channel = field.current_channel;
      }
      if (!url && typeid > 0) {
        if (1 == channel) {
          url = `/pages/archives/article/list?typeid=${typeid}`
        } else if (2 == channel) {
          url = `/pages/archives/product/list?typeid=${typeid}`
        } else if (3 == channel) {
          url = `/pages/archives/images/list?typeid=${typeid}`
        } else if (4 == channel) {
          url = `/pages/archives/download/list?typeid=${typeid}`
        } else if (5 == channel) {
          url = `/pages/archives/media/list?typeid=${typeid}`
        } else if (6 == channel) {
          url = `/pages/archives/single/view?typeid=${typeid}`
        } else if (7 == channel) {
          url = `/pages/archives/special/list?typeid=${typeid}`
        } else if (8 == channel) {
          url = `/pages/archives/guestbook/index?typeid=${typeid}`
        } else {
          url = `/pages/archives/custom/list?typeid=${typeid}`
        }
      }
    }
    if (!url) {
      console.log(field,typeid,channel);
    }
    wx.navigateTo({
      url: url
    })
  },
  // 通过路由获取当前访问路径url
  getRouteUrl: function () {
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var typeid = currentPage.options.typeid || 0;
    var urlData = {
      path: currentPage.route,
      typeid: typeid,
    };
    return urlData;
  },
  // 通过路由获取当前访问的完整路径url
  getCurrentPages: function () {
    var pages = getCurrentPages(); //获取加载的页面
    var currentPage = pages[pages.length - 1]; //获取当前页面的对象
    var url = currentPage.route; //当前页面url
    var options = currentPage.options; //获取url中所带的参数
    //拼接url的参数
    var currentPage = '/' + url + '?';
    for (var key in options) {
      var value = options[key]
      currentPage += key + '=' + value + '&';
    }
    currentPage = currentPage.substring(0, currentPage.length - 1);
    return currentPage;
  },
  	// 复制订单号
	Copy(e) {
		wx.setClipboardData({
			data: e.currentTarget.dataset.text,
			success: function (res) {
				wx.getClipboardData({
					success: function (res) {
						wx.showToast({
							title: '复制成功',
						})
					},
				})
			}
		})
	},
  // 底部菜单选中状态切换
  setTabBar: function (that, tabbar) {
    let selected = -1;
    let blist = tabbar.list;
    let urlData = this.getRouteUrl();
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
  switchTab: function (e, jumpType) {
    let url = '';
    jumpType = jumpType || 'redirectTo';
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
      if ('navigateTo' == jumpType) {
        wx.navigateTo({
          url
        });
      } else if ('redirectTo' == jumpType) {
        wx.redirectTo({
          url
        });
      } else if ('reLaunch' == jumpType) {
        wx.reLaunch({
          url
        });
      }
    }
  },
  /**
   * 获取URL参数的某个值
   * @param {string} variable 
   * @param {string} query 
   */
  getQueryVariable: function (variable, query) {
    if (-1 < query.indexOf('?')) {
      var arr = query.split("?");
      query = arr[1];
    }
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  },
}