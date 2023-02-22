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

let apikey = 's6gTfcHSv8Cjs3KksFEhHKS7xGiiETeq'; // 开源小程序API接口密钥
let domain = 'https://www.sthtjy.com/'; // 网站域名，目前仅支持https
let root_dir = ''; // 子目录，比如：/sub

// 底部导航菜单
let tabbar = {
    selected: -1, // 默认选中位置
    color: "#666666", // 文字默认颜色
    selectedColor: "#108DEE", // 文字选中时的颜色
    backgroundColor: "#FFFFFF", // 背景色
    borderStyle: "#000000", // 边框的颜色
    list: [
		{
			"text": "首页",
			"pagePath": "pages/index/index",
			"iconPath": "/static/images/tabBar/shouye.png",
			"selectedIconPath": "/static/images/tabBar/shouye_active.png"
		},
		// {
		// 	"text": "分类",
		// 	"pagePath": "pages/category/index",
		// 	"iconPath": "/static/images/tabBar/fenlei.png",
		// 	"selectedIconPath": "/static/images/tabBar/fenlei_active.png"
		// },
		// 如果启用商城就把新闻和产品 在线预约这三块注释掉 如果要是关闭商城就把购物车注释掉
		// {
		// 	"text": "新闻",
		// 	"pagePath": "/pages/archives/article/list?typeid=2",
		// 	"iconPath": "/static/images/tabBar/xinwen.png",
		// 	"selectedIconPath": "/static/images/tabBar/xinwen_active.png"
		// },
		
    {
      text: '商城',
      pagePath: '/pages/archives/product/list?typeid=3',
      iconPath: '/static/images/tabBar/shangpin.png',
      selectedIconPath: '/static/images/tabBar/shangpin-active.png'
	 },
	//  {
	// 	"text": "预约",
	// 	"pagePath": "/pages/archives/guestbook/index",
	// 	"iconPath": "/static/images/tabBar/yuyue.png",
	// 	"selectedIconPath": "/static/images/tabBar/yuyue_active.png"
	// },
	
		{
			"text": "购物车",
			"pagePath": "pages/flow/index",
			"iconPath": "/static/images/tabBar/gouwuche.png",
			"selectedIconPath": "/static/images/tabBar/gouwuche_active.png"
		},
		{
			"text": "我的",
			"pagePath": "pages/user/index",
			"iconPath": "/static/images/tabBar/gerenzhongxin.png",
			"selectedIconPath": "/static/images/tabBar/gerenzhongxin_active.png"
		}
	]
};

let setting = {
  domain, // 网站域名
  root_dir, // 子目录
  apikey, // 子目录
  tabbar, // 底部导航菜单
  // cart_index:2,//tabbar导航栏的购物车下标,从0开始数
};

module.exports = setting