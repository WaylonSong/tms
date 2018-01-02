const EnumOnDutyType = {
  OFF: 0,
  ON: 1,
}

const EnumRoleType = {
  ADMIN: 'admin',
  DEFAULT: 'admin',
  DEVELOPER: 'developer',
}

const EnumDeliveryStatus = {
  NOT_DISTRIBUTED : 0,
  NOT_RECEIVED : 1,
  ONBOARD : 2,
  RECEIVED : 3,
  SPLITTED : 4,
}
module.exports = {
  EnumRoleType, EnumDeliveryStatus, EnumOnDutyType
}
