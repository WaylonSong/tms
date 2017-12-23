import { request, config } from 'utils'

const { api } = config
const { vehicles_candidate } = api //`${APIV1}/vehicles/candidate`
const { assginTo } = api

export async function queryCandidateVehicles (params) {
  return request({
    url: vehicles_candidate,
    method: 'get',
    data: params,
  })
}

export async function assignTo (params) {
  return request({
    url: assginTo,
    method: 'post',
    data: params,
  })
}

