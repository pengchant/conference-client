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

/**
 * 导出会议记录内容
 */
export function downloadRecord(param) {
  return request({
    url: '/record/' + param + '/exportconfrecord',
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

/**
 * 查询已经预约过的会议
 * @param {参数} param
 */
export function queryOrderedConf(param) {
  return request({
    url: '/order/queryorderedconf',
    method: 'post',
    data: param
  })
}

export function queryorderDetail(param) {
  return request({
    url: '/order/' + param + '/queryorderdetail',
    method: 'post'
  })
}

/**
 * 查询待验证的会议内容
 * @param {参数} param
 */
export function queryValitingConf(param) {
  return request({
    url: '/order/queryvaliconf',
    method: 'post',
    data: param
  })
}

/**
 *
 * @param {通过} param
 */
export function passOrderConf(param) {
  return request({
    url: '/order/' + param + '/passOrderConf',
    method: 'post'
  })
}

/**
 *
 * @param {不通过} param
 */
export function unpassOrderConf(param) {
  return request({
    url: '/order/' + param + '/unpassOrderConf',
    method: 'post'
  })
}

/**
 * 加载当前用户部门下的所有的用户
 * @param {当前用户的编号} param
 */
export function loadDepUsers(param) {
  return request({
    url: '/comm/getcurdepusr/' + param,
    method: 'post'
  })
}

/**
 * 删除用户提交的额会议预约
 */
export function removeOrderConf(param) {
  return request({
    url: '/order/' + param + '/removeOrderConf',
    method: 'post'
  })
}
