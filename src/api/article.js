import request from '@/utils/request'

// export function fetchList(query) {
//   return request({
//     url: '/vue-element-admin/article/list',
//     method: 'get',
//     params: query
//   })
// }

export function fetchList(query) {
  return request({
    url: '/website/findAll',
    method: 'get',
    params: query
  })
}


//新加

export function createArticle(data) {
  return request({
    url: '/website/addwebsite',
    method: 'post',
    data
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}



export function updateArticle(data) {
  return request({
    url: '/website/updatewebsite',
    method: 'post',
    data
  })
}

export function deletewebsite(data) {
  return request({
    url: '/website/deletewebsite',
    method: 'post',
    data
  })
}
