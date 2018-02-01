const EnumOnDutyType = {
  OFF: 0,
  ON: 1,
}

const EnumRoleType = {
  ADMIN: 'admin',
  DEFAULT: 'admin',
  DEVELOPER: 'developer',
}


const PayChannel = {
  ALIPAY : 0,
  WECHATPAY : 1,
  POS : 2,
  CASH : 3,
}

const OrderDetailState = {
  NOT_PAID : 0,
  NOT_DISTRIBUTED : 1,
  NOT_RECEIVED : 2,
  ONBOARD : 3,
  COMPLETED : 4,
  INVALID : 5,
  CONFIRMED : 6
}

const EnumDeliveryStatus = {
  NOT_DISTRIBUTED : 0,
  NOT_RECEIVED : 1,
  ONBOARD : 2,
  COMPLETED : 3,
  INVALID : 4,
  SPLITTED : 5,
}

const PayState = {
  UNPAY : 0,
  COMPLETE : 1,
  PARTPAY : 2,
}

const PayType = {
  SENDER_PAY : 0,
  RECEIVER_PAY : 1,
  SENDER_ORDER_PAY : 2,
}

module.exports = {
  EnumRoleType, EnumDeliveryStatus, EnumOnDutyType, PayState, PayType, OrderDetailState, PayChannel
}
