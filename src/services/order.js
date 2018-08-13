import { request, config } from 'utils'

const { api } = config
const { order_state_transfer} = api //`${APIV1}/vehicles/candidate`

export async function stateTransfer (params) {
  return request({
    url: order_state_transfer,
    method: 'post',
    data: params,
  })
}

