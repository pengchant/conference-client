import Mock from 'mockjs'

export default {
  // 模拟返回list格式数据（随机生成的）
  list: () => {
    const items = Mock.mock({
      'items|30': [{
        id: '@id',
        title: '@sentence(10, 20)',
        'status|1': ['published', 'draft', 'deleted'],
        author: 'name',
        display_time: '@datetime',
        pageviews: '@integer(300, 5000)'
      }]
    })
    return {
      code: 20000,
      data: items
    }
  }
}
