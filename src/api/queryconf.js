import request from '@/utils/request'

/**
 * 获取通过的会议记录
 * @param {参数} params
 */
export function getpassedRecord(params) {
  return request({
    url: '/record/getpassedRecord',
    method: 'post',
    data: params
  })
}

