import Cookies from 'js-cookie'

const TokenKey = 'x-token'
const AccidKey = 'user-id'

/**
 * 获取账户的编号
 */
export function getAccid() {
  return Cookies.get(AccidKey)
}

/**
 * 获取当前用户的token
 */
export function getToken() {
  return Cookies.get(TokenKey)
}

/**
 * 设置账户的编号
 * @param {账户编号} accid
 */
export function setAccid(accid) {
  return Cookies.set(AccidKey, accid)
}

/**
 * 设置token的值
 * @param {token值} token
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

/**
 * 删除账户的cookie
 */
export function removeAccid() {
  return Cookies.remove(AccidKey)
}

/**
 * 移除token的值
 */
export function removeToken() {
  return Cookies.remove(TokenKey)
}

