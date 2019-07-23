import request from '@/utils/request'
import md5 from 'js-md5'

export function login(account, password) {
  password = md5(password)
  return request({
    url: '/comm/login',
    method: 'post',
    data: {
      account,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
