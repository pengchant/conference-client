export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  // 将url后带参数的字符串封装成json格式的字符串
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  )
}
