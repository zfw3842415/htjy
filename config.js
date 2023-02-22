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

import setting from './setting.js';

let tpl = 'ApiCms'; // 小程序模板ID
const accountInfo = wx.getAccountInfoSync();
let appId = accountInfo.miniProgram.appId; // 小程序appid
let domain = setting.domain; // 网站域名
let root_dir = setting.root_dir; // 子目录
let apikey = setting.apikey; // 开源小程序API接口密钥
let tabbar = setting.tabbar;

// http与https网站的接口处理
let getApiUrl = function(act, clt, mdu) {
	mdu = mdu || 'api';
	clt = clt || 'Api';
	let url = '';
	if (domain) {
		let domainArr = domain.split("/");
		if (domainArr[domainArr.length - 1].length == 0) {
			domain = domain.slice(0, -1);
		}
	}
	if (root_dir) {
		let rootDirArr = root_dir.split("/");
		if (rootDirArr[rootDirArr.length - 1].length == 0) {
			root_dir = root_dir.slice(0, -1);
		}
		if (rootDirArr[0].length != 0) {
			root_dir = root_dir = '/' + root_dir;
		}
	}
	url = `${domain}${root_dir}/index.php?m=${mdu}&c=v1.${clt}&a=${act}&_ajax=1`;
	
	return url;
}

let config = {
	// 底部导航菜单
	tabbar,
	// 小程序appid
	appId,
	// 开源小程序API接口密钥
	apikey,
	//域名
	domain,
	// 首页api地址
	apiIndexUrl: getApiUrl('index'),
	// 文档列表api地址
	apiListUrl: getApiUrl('archivesList'),
	// 文档详情页api地址
	apiViewUrl: getApiUrl('archivesView'),
	// 会员中心
	apiUsersdetailUrl: getApiUrl('users_detail'),
	// 用户登录
	apiUsersloginUrl: getApiUrl('users_login'),
	// 收藏/取消收藏
	apiGetCollectUrl: getApiUrl('get_collect', 'Users'),
	// 我的收藏列表
	apiGetCollectListUrl: getApiUrl('get_collect_list', 'Users'),
	// 上传头像
	userUploadHeadPicUrl: getApiUrl('upload_head_pic'),
	// 保存用户信息
	userSaveUserInfoUrl: getApiUrl('save_user_info', 'Users'),
	// 订单支付
	apiOrderpayUrl: getApiUrl('order_pay', 'Users'),
	// 订单列表
	shopOrderlistsUrl: getApiUrl('order_lists', 'Users'),
	// 取消订单
	shopOrderCancelUrl: getApiUrl('order_cancel', 'Users'),
	// 订单提醒发货
	shopOrderRemindUrl: getApiUrl('order_remind', 'Users'),
	// 确认收货
	shopOrderReceiptUrl: getApiUrl('order_receipt', 'Users'),
	// 订单详情
	shopOrderdetailUrl: getApiUrl('order_detail', 'Users'),
	// 查看物流
	shopOrderexpressUrl: getApiUrl('order_express', 'Users'),
	// 商品添加购物车
	shopAddCartUrl: getApiUrl('shop_add_cart', 'Users'),
	// 页面直接添加商品到购物车
	shopPageAddCartUrl: getApiUrl('shop_page_add_cart', 'Users'),
	// 商品立即购买
	shopBuyNowUrl: getApiUrl('shop_buy_now', 'Users'),
	// 商品立即购买
	shopProductBuyUrl: getApiUrl('shop_product_buy', 'Users'),
	// 商品订单结算
	shopOrderPayUrl: getApiUrl('shop_order_pay', 'Users'),
	// 商城购物车列表
	shopCartListUrl: getApiUrl('shop_cart_list'),
	// 购物车数量操作
	shopCartActionUrl: getApiUrl('shop_cart_action', 'Users'),
	// 收货地址列表
	shopAddressListUrl: getApiUrl('shop_address_list', 'Users'),
	// 收货地址操作
	shopAddressActionUrl: getApiUrl('shop_address_action', 'Users'),
	// 订单支付后续操作
	shopOrderPayDealWithUrl: getApiUrl('shop_order_pay_deal_with', 'Users'),
	// 查询商品信息
	apiGetProductUrl: getApiUrl('get_product_data'),
	// 直播列表页面api地址
	apiDiyLivepageUrl: getApiUrl('diy_live_page'),
	// 评价页面
	shopOrderCommentUrl: getApiUrl('order_comment', 'Users'),
	// 保存评价
	shopSaveCommentUrl: getApiUrl('save_comment', 'Users'),
	// 上传图片
	shopUploadsUrl: getApiUrl('uploads'),
	// 商品评价列表
	shopCommentListUrl: getApiUrl('get_goods_comment_list'),
	//秒杀列表
	SharpIndexUrl: getApiUrl('get_sharp_index'),
	//秒杀商品列表
	SharpGoodsIndexUrl: getApiUrl('get_sharp_goods_index'),
	//秒杀商品
	SharpGoodsUrl: getApiUrl('get_sharp_goods'),
	// 领取优惠券
	apiGetCouponUrl: getApiUrl('get_coupon', 'Users'),
	// 用户中心获取我的优惠券列表
	apiGetMyCouponUrl: getApiUrl('get_my_coupon', 'Users'),
	// 领券中心
	apiGetCouponCenterUrl: getApiUrl('get_coupon_center', 'Users'),
	// 获取购物车数量
	apiGetCartTotalNumUrl: getApiUrl('get_cart_total_num'),
	// 获取手机号
  apiGetPhoneUrl: getApiUrl('get_phone', 'Users'),
	//提交表单数据
	apiGuestbookUrl: getApiUrl('guestbook'),
	//获取栏目表单字段列表
	apiGuestbookFormUrl: getApiUrl('guestbook_form'),
	//获取下级区域列表
	apiGetRegionUrl: getApiUrl('get_region'),
 //发送邮箱api地址
 apiSendemailUrl:getApiUrl('sendemail'),
	//秒杀列表
	apiDiscountIndexUrl: getApiUrl('get_discount_index'),
	//秒杀商品
	apiDiscountGoodsUrl: getApiUrl('get_discount_goods'),
	// 生成商品二维码海报
	apiCreateGoodsShareQrcodePosterUrl: getApiUrl('createGoodsShareQrcodePoster'),
	// 处理订单服务方法(集合方法)
	apiHandleOrderServiceActionUrl: getApiUrl('handleOrderServiceAction', 'Users'),
	// 处理会员余额方法(集合方法)
	apiHandleUserMoneyActionUrl: getApiUrl('HandleUserMoneyAction', 'Users'),
	apiUsersdetailUrl: getApiUrl('users_detail'),
	// 我的预约列表
	apiget_book_list: getApiUrl('guestbook_list', 'Users'),
	//增加我的足迹
	apiSetfoot: getApiUrl('set_footprint'),
	// 我的足迹列表
  apiGetfootList: getApiUrl('get_footprint_list', 'Users'),
  // 查看预约详情
	apigetbookdetail: getApiUrl('get_book_detail', 'Users'),
	// 取消预约
	apicancelbook: getApiUrl('cancel_book', 'Users'),
  //获取问题列表
	apiGetAskListUrl:getApiUrl('get_ask_list'),
	//获取问题详情
	apiGetAskDetailUrl:getApiUrl('get_ask_details'),
	//发布问题
	apiAddAskUrl:getApiUrl('add_ask', 'Users'),
	//添加回答
	apiAddAnswerUrl:getApiUrl('add_answer', 'Users'),
	//问答点赞
	apiAskLikeUrl:getApiUrl('ask_like', 'Users'),
 
};

module.exports = config