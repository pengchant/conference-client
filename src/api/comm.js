import request from '@/utils/request'
import md5 from 'js-md5'

export function getallposition() {
  return request({
    url: '/comm/allpositon',
    method: 'post'
  })
}

export function getallDuty() {
  return request({
    url: '/comm/allduty',
    method: 'post'
  })
}

export function getalldep() {
  return request({
    url: '/comm/alldepartment',
    method: 'post'
  })
}

export function registinfo(registform) {
  registform.password = md5(registform.password)
  registform.confirmpass = md5(registform.confirmpass)
  return request({
    url: '/comm/registuser',
    method: 'post',
    data: registform
  })
}

export function getallconflevel() {
  return request({
    url: '/comm/allconflevel',
    method: 'post'
  })
}

export function getallconfattr() {
  return request({
    url: '/comm/allconfattr',
    method: 'post'
  })
}

export function getallsemesters() {
  return request({
    url: '/comm/allsemesters',
    method: 'post'
  })
}

/**
 * 用户签到
 * @param {参数} param
 */
export function usrAttend(param) {
  return request({
    url: '/comm/attendtag',
    method: 'post',
    data: param
  })
}

/**
 * 用户取消签到
 * @param {参数} param
 */
export function usrcancelattend(param) {
  return request({
    url: '/comm/cancelattendtag',
    method: 'post',
    data: param
  })
}
