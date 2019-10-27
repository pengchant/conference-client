import request from '@/utils/request'

/**
 * 查询所有的学期
 * @param {参数} params
 */
export function getList(params) {
  return request({
    url: '/sys/querySemesters',
    method: 'post',
    data: params
  })
}

/**
 * 修改学期
 * @param {参数} params
 */
export function modifySemester(params) {
  return request({
    url: '/sys/mdsemester',
    method: 'post',
    data: params
  })
}

/**
 * 移除学期
 * @param {编号} id
 */
export function removeSemester(id) {
  return request({
    url: '/sys/rmSemester/' + id,
    method: 'post'

  })
}

/**
 * 批量删除所有的学期
 * @param {id列表} ids
 */
export function batchrmSemester(params) {
  return request({
    url: '/sys/bhrmsemester/', // 移除学期
    method: 'post', // 方法
    data: params
  })
}

/**
 * 新增学期
 */
export function newSemester(params) {
  return request({
    url: '/sys/addSemester', // 新增学期
    method: 'post', // 方法
    data: params
  })
}

// ///////////////////////
export function getConfattrList(params) {
  return request({
    url: '/sys/queryConfattr',
    method: 'post',
    data: params
  })
}

export function modifyConfattr(params) {
  return request({
    url: '/sys/mdconfattr',
    method: 'post',
    data: params
  })
}

export function removeConfattr(id) {
  return request({
    url: '/sys/rmConfattr/' + id,
    method: 'post'
  })
}

export function batchrmConfattr(params) {
  return request({
    url: '/sys/bhrmconfattr/',
    method: 'post',
    data: params
  })
}

export function newConfattr(params) {
  return request({
    url: '/sys/addConfattr',
    method: 'post',
    data: params
  })
}

// //////////////////////////////////////

export function getConflevelList(params) {
  return request({
    url: '/sys/queryConflevel',
    method: 'post',
    data: params
  })
}

export function modifyConflevel(params) {
  return request({
    url: '/sys/mdconflevel',
    method: 'post',
    data: params
  })
}

export function removeConflevel(id) {
  return request({
    url: '/sys/rmConflevel/' + id,
    method: 'post'
  })
}

export function batchrmConflevel(params) {
  return request({
    url: '/sys/bhrmconflevel/',
    method: 'post',
    data: params
  })
}

export function newConfalevel(params) {
  return request({
    url: '/sys/addConflevel',
    method: 'post',
    data: params
  })
}

// /////////////////////////////
export function getConfstsList(params) {
  return request({
    url: '/sys/queryConfsts',
    method: 'post',
    data: params
  })
}

export function modifyConfsts(params) {
  return request({
    url: '/sys/mdconfsts',
    method: 'post',
    data: params
  })
}

export function removeConfsts(id) {
  return request({
    url: '/sys/rmConfsts/' + id,
    method: 'post'
  })
}

export function batchrmConfsts(params) {
  return request({
    url: '/sys/bhrmconfsts/',
    method: 'post',
    data: params
  })
}

export function newConfsts(params) {
  return request({
    url: '/sys/addConfsts',
    method: 'post',
    data: params
  })
}

// //////////////////////////////

export function getDepartmentList(params) {
  return request({
    url: '/sys/queryDepartments',
    method: 'post',
    data: params
  })
}

export function modifyDepartment(params) {
  return request({
    url: '/sys/mddepartment',
    method: 'post',
    data: params
  })
}

export function removeDepartment(id) {
  return request({
    url: '/sys/rmDepartment/' + id,
    method: 'post'
  })
}

export function batchrmDepartments(params) {
  return request({
    url: '/sys/bhrmdepartment/',
    method: 'post',
    data: params
  })
}

export function newDepartments(params) {
  return request({
    url: '/sys/addDepartment',
    method: 'post',
    data: params
  })
}

// //////////////////////////////

export function getPositionList(params) {
  return request({
    url: '/sys/queryPositions',
    method: 'post',
    data: params
  })
}

export function modifyPosition(params) {
  return request({
    url: '/sys/mdposition',
    method: 'post',
    data: params
  })
}

export function removePosition(id) {
  return request({
    url: '/sys/rmPosition/' + id,
    method: 'post'
  })
}

export function batchrmPositions(params) {
  return request({
    url: '/sys/bhrmposition/',
    method: 'post',
    data: params
  })
}

export function newPosition(params) {
  return request({
    url: '/sys/addPosition',
    method: 'post',
    data: params
  })
}

// //////////////////////////////

export function getDutyList(params) {
  return request({
    url: '/sys/queryDutys',
    method: 'post',
    data: params
  })
}

export function modifyDuty(params) {
  return request({
    url: '/sys/mdduty',
    method: 'post',
    data: params
  })
}

export function removeDuty(id) {
  return request({
    url: '/sys/rmDuty/' + id,
    method: 'post'
  })
}

export function batchrmDutys(params) {
  return request({
    url: '/sys/bhrmduty/',
    method: 'post',
    data: params
  })
}

export function newDuty(params) {
  return request({
    url: '/sys/addDuty',
    method: 'post',
    data: params
  })
}

/**
 *
 * @param {分页查询二级部门} param
 */
export function queryPagedSecondDep(param) {
  return request({
    url: '/sys/queryAllSecondDep',
    method: 'post',
    data: param
  })
}
export function modifyDepSec(params) {
  return request({
    url: '/sys/updateChildDep',
    method: 'post',
    data: params
  })
}
export function removeSecDep(id) {
  return request({
    url: '/sys/' + id + '/removeChildDep',
    method: 'post'
  })
}

export function addDepSec(params) {
  return request({
    url: '/sys/addsecdep',
    method: 'post',
    data: params
  })
}
