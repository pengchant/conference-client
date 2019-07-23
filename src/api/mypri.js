import request from '@/utils/request'

/**
 * 抓取当前用户所有的权限
 */
export function getmenu() {
  return request({
    url: '/environment/getmenu', // 请求所有的权限
    method: 'post'
  })
}
