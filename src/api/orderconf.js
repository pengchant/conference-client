import request from '@/utils/request'

export function getRoomList(params) {
  return request({
    url: '/order/queryrooms',
    method: 'post',
    data: params
  })
}

export function getRoomArange(roomid) {
  return request({
    url: '/order/queryconfroom/' + roomid,
    method: 'post'
  })
}

export function getPeopleSelect(param) {
  return request({
    url: '/order/querypeoples',
    method: 'post',
    data: param
  })
}

export function getAllPeopleSelect(param) {
  return request({
    url: '/order/queryattends',
    method: 'post',
    data: param
  })
}

export function sureSubmitOrder(param) {
  return request({
    url: '/order/sureSubOrder',
    method: 'post',
    data: param
  })
}

/**
 * 加载会议预约的所有的信息
 */
export function loadConfDetail(param) {
  return request({
    url: '/record/' + param + '/loadconf',
    method: 'post'
  })
}

export function downloadCollect(param) {
  return request({
    url: '/record/' + param + '/exportconfcoll',
    method: 'post',
    responseType: 'blob'
  })
}

export function loadAttenders(param) {
  return request({
    url: '/record/' + param + '/getAttendursts',
    method: 'post'
  })
}

/**
 * 录入新的会议室
 * @param {参数} param
 */
export function addNewRoom(param) {
  return request({
    url: '/order/addNewRoom',
    method: 'post',
    data: param
  })
}
