import request from './request';

export function getComments(params) {
  return request.get('/admin/comments', { params });
}

export function deleteComment(id) {
  return request.delete(`/admin/comments/${id}`);
}
