const getters = {
  sidebar: state => state.app.sidebar, // 侧边栏
  device: state => state.app.device, // 设备
  token: state => state.user.token, // 令牌
  avatar: state => state.user.avatar,
  name: state => state.user.name, // 用户名
  roles: state => state.user.roles, // 权限列表
  currentmenues: state => state.menu.currentmenues // 菜单
}
export default getters
