import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

// export function login(data) {
//   return request({
//     url: '/user/userlogin',  //地址指向新的接口
//     method: 'post',
//     data
//   })
// }

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}
// export function getInfo(token) {
//   return request({
//     url: '/user/GetUserinfo',
//     method: 'post',
//     params: { token }
//   })
// }



export function logout() {
  // return request({
  //   url: '/vue-element-admin/user/logout',
  //   method: 'post'
  // })
  return {
    code: 20000,
    data: 'success'
  }
}
