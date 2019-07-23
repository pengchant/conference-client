import Cookies from 'js-cookie'

const TokenKey = 'x-token'

/**
 * 获取当前用户的token
 */
export function getToken() {
  return Cookies.get(TokenKey)
}

/**
 * 设置token的值
 * @param {token值} token
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

/**
 * 移除token的值
 */
export function removeToken() {
  return Cookies.remove(TokenKey)
}
