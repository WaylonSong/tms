import queryString from 'query-string'
import { request, config } from 'utils'

const { api } = config
const { vehicles_candidate, assginTo, split} = api //`${APIV1}/vehicles/candidate`

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
    data: queryString.stringify(params),
  })
}

export async function postSplit (params) {
  return request({
    url: split,
    method: 'post',
    data: params,
  })
}