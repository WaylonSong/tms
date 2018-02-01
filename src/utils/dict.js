var EnumOnDutyTypeDict = ["休息", "当班"];
var PayChannelDict = ["支付宝", "微信", "POS机", "现金"];
var PayStateDict = ["未支付", "已支付", "部分支付"];
var PayTypeDict = ["支付宝", "微信", "POS机", "现金"];
var OrderDetailStateDict = ["待支付", "待分配", "待接货", "已接货", "送货完成", "已取消", "确认收货"];
var EnumDeliveryStatusDict = ["待分配", "待接货", "已接货", "送货完成", "已取消", "已拆分"];

module.exports = {
  EnumOnDutyTypeDict,
  PayChannelDict,
  PayStateDict,
  PayTypeDict,
  OrderDetailStateDict,
  EnumDeliveryStatusDict,
}