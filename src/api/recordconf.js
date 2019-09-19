import request from '@/utils/request'
import axios from 'axios'

const BASEURL = 'http://localhost:9999/conferencem/'

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
  const url = BASEURL + '/record/' + params.confrecid + '/uploadUsrVoice'
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

/**
 * 结束会议记录
 * @param {参数} param
 */
export function endRecordConf(param) {
  return request({
    url: '/order/' + param + '/endRecConf',
    method: 'post'
  })
}

/**
 * 查询待验证的会议材料
 * @param {参数} param
 */
export function getvaliRecord(param) {
  return request({
    url: '/record/getvaliRecord',
    method: 'post',
    data: param
  })
}

/**
 * 查询我的待审核的会议材料
 * @param {参数} param
 */
export function getmyvaliRecord(param) {
  return request({
    url: '/record/getmyvaliRecord',
    method: 'post',
    data: param
  })
}

/**
 * 查询验证通过的会议材料
 * @param {参数} param
 */
export function getpassedRecord(param) {
  return request({
    url: '/record/getpassedRecord',
    method: 'post',
    data: param
  })
}

/**
 * 通过会议
 * @param {会议编号} param
 */
export function passRecord(param) {
  return request({
    url: '/record/' + param + '/passRecord',
    method: 'post',
    data: param
  })
}

/**
 * 会议不归档
 * @param {参数} param
 */
export function unpassRecord(param) {
  return request({
    url: '/record/' + param + '/unpassRecord',
    method: 'post',
    data: param
  })
}

/**
 * 更新会议结论
 * @param {参数} param
 */
export function saveConfTitleConclusion(param) {
  return request({
    url: '/record/modifyConclusion',
    method: 'post',
    data: param
  })
}

/**
 * 查询所有会议议题
 * @param {参数} param
 */
export function queryConftitles(param) {
  return request({
    url: '/record/' + param + '/queryConftitles',
    method: 'post'
  })
}

/**
 * 直接开会录入
 * @param {提交的参数} param
 */
export function directRecord(param) {
  return request({
    url: '/record/directrecord',
    method: 'post',
    data: param
  })
}

/**
 * 获取直接开会的会议详情
 * @param {参数} param
 */
export function getDirectConfDetail(param) {
  return request({
    url: '/record/' + param + '/querydirectconf',
    method: 'post'
  })
}
