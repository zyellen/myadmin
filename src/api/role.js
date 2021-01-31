import request from '@/utils/request'

// export function getRoutes() {
//   return request({
//     url: '/vue-element-admin/routes',
//     method: 'get'
//   })
// }
export function getRoutes() {
  return request({
    url: '/user/getRoutes',
    method: 'get'
  })
}

// export function getRoles() {
//   return request({
//     url: '/vue-element-admin/roles',
//     method: 'get'
//   })
// }

export function addUser(data) {
  // console.log('提交的',data)
  return request({
    url: '/user/addUser',
    method: 'post',
    data
  })
}
export function findAll() {
  // console.log('提交的',data)
  return request({
    url: '/user/findAll',
    method: 'get'
  })
}


export function updateRole(id, data) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'put',
    data
  })
}

// export function deleteRole(id) {
//   return request({
//     url: '/user/deleteUser',
//     method: 'post',
//     id
//   })
// }
export function deleteRole(data) {
  console.log('提交的2',data)
  return request({
    url: '/user/deleteUser',
    method: 'post',
    data
  })
}
