const EnumOnDutyType = {
  OFF: "休息",
  ON: "当班"
}

const EnumRoleType = {
  ADMIN: 'admin',
  DEFAULT: 'admin',
  DEVELOPER: 'developer',
}


const PayChannel = {
  ALIPAY : "支付宝",   
  WECHATPAY : "微信",
  POS : "POS机",
  CASH : "现金"
}

const OrderDetailState = {
  NOT_PAID : "待支付",
  NOT_DISTRIBUTED : "待分配",
  NOT_RECEIVED : "待接货",
  ONBOARD : "配送中",
  COMPLETED : "送货完成",
  CONFIRMED : "确认收货",
  INVALID : "已取消",
}

const EnumDeliveryStatus = {
  NOT_PAID : "待支付",
  NOT_DISTRIBUTED : "待分配",
  NOT_RECEIVED : "待接货", 
  ONBOARD : "配送中", 
  COMPLETED : "送货完成", 
  CONFIRMED : "确认收货",
  INVALID : "已取消",
  SPLITTED : "已拆分"
}

const PayState = {
  UNPAY : "未支付",  
  COMPLETE : "已支付",
  PARTPAY : "部分支付"
}

const PayType = {
  SENDER_PAY : "发货付款",
  RECEIVER_PAY : "货到付款",
  SENDER_ORDER_PAY : "回单付款",
}

var getIndexByTitle = function(enums, title){
  var index = 0;
  for(var i in enums){
    if(i == title)
      return index;
    else
      index++;
  }
  return 9999;
}

module.exports = {
  EnumRoleType, EnumDeliveryStatus, EnumOnDutyType, PayState, PayType, OrderDetailState, PayChannel, getIndexByTitle
}
