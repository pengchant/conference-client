
/**
 * 判断是否为外部路径
 * @param {路径} path
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
