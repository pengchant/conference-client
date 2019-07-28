import request from '@/utils/request'
import axios from 'axios'

const BASEURL = 'http://localhost:9999'

/**
 *  新增会议议题
 */
export function newConftitle(params) {
  return request({
    url: '/record/addSpeechItem',
    method: 'post',
    data: params
  })
}

/**
 * 录入会议记录
 */
export function newSpeachItem(params) {
  return request({
    url: '/record/addUsrSepach',
    method: 'post',
    data: params
  })
}

/**
 * 删除会议人员会话
 */
export function removeSpeachItem(params) {
  return request({
    url: '/record/' + params.recorid + '/removeUsrSpeach',
    method: 'post'
  })
}

/**
 * 上传文件
 * @param {参数} params
 */
export function uploadSpeachItem(params, afterfunc) {
  const formData = new FormData()
  formData.append('voice', params.voice)
  const url = 'http://localhost:9999/record/' + params.confrecid + '/uploadUsrVoice'
  const config = {
    headers: { 'Content-Type': 'multipart/form-data' }
  }
  axios.post(url, formData, config).then(function(response) {
    console.log(response.data)
    afterfunc(response.data)
  })
}

/**
 * 删除录音
 */
export function removeVoiceRecord(params) {
  return request({
    url: '/record/' + params.voiceid + '/deleteUsrRecords',
    method: 'post'
  })
}

/**
 * 修改用户发言内容
 */
export function modifySpeachContent(params) {
  return request({
    url: '/record/modifyUsrSpeach',
    method: 'post',
    data: params
  })
}

/**
 * 临时添加新议题
 * @param {参数} params
 */
export function newcurcitlte(params) {
  return request({
    url: '/record/addNewCurContTitle',
    method: 'post',
    data: params
  })
}

/**
 * 查询当前会议需要解决的问题
 */
export function queryCurISSUE(params) {
  return request({
    url: '/record/' + params.workerid + '/loadCurIssue',
    method: 'post'
  })
}

/**
 * 保存会议的结论
 * @param {参数} params
 */
export function saveConclusion(params) {
  return request({
    url: '/record/saveConfConclusion',
    method: 'post',
    data: params
  })
}

/**
 * 获取用户voice的blog文件
 */
export function generateVoiceUrl(openid) {
  return {
    url: BASEURL + '/record/getUsrVoice?file_id=' + openid,
    mblob: null
  }
}

/**
 * 修改会议主持人
 */
export function modifyHolder(params) {
  return request({
    url: '/record/modifyHolder',
    data: params,
    method: 'post'
  })
}