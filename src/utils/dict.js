var EnumOnDutyTypeDict = ["休息", "当班"];
var PayChannelDict = ["支付宝", "微信", "POS机", "现金"];
var PayStateDict = ["未支付", "已支付", "部分支付"];
var PayTypeDict = ["支付宝", "微信", "POS机", "现金"];
var OrderDetailStateDict = ["待支付", "待分配", "待接货", "配送中", "送货完成", "确认收货", "已取消"];
var EnumDeliveryStatusDict = ["待支付", "待分配", "待接货", "配送中", "送货完成", "确认收货", "已取消", "已拆分"];

var getIndex = function(array, value){
	for(var i in array){
		if(array[i] == value)
			return i;
	}
}

module.exports = {
  EnumOnDutyTypeDict,
  PayChannelDict,
  PayStateDict,
  PayTypeDict,
  OrderDetailStateDict,
  EnumDeliveryStatusDict,
  getIndex
}