import request from '@/utils/request'

export function getallOrder(param) {
  return request({
    url: '/order/' + param + '/allmyorder',
    method: 'post'
  })
}

export function getallCommingOrder(param) {
  return request({
    url: '/order/' + param + '/commingConf',
    method: 'post'
  })
}
