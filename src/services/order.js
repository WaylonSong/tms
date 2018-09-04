import { request, config } from 'utils'
import queryString from 'query-string'

const { api } = config
const { order_state_transfer, order_paid, order_cancel, order_payment, order_payment_paymentId} = api //`${APIV1}/vehicles/candidate`

export async function stateTransfer (params) {
  return request({
    url: order_state_transfer,
    method: 'post',
    data: queryString.stringify(params),
  })
}

export async function cancel (params) {
  return request({
    url: order_cancel,
    method: 'post',
    data: queryString.stringify(params),
  })
}

export async function paid (params) {
  return request({
    url: order_paid,
    method: 'post',
    data: queryString.stringify(params),
  })
}


export async function paymentByPaymentId (params) {
  return request({
    url: order_payment_paymentId,
    method: 'get',
    data: params,
  })
}
