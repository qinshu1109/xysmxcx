import request from './request';

export function getHelpPosts(params) {
  return request.get('/admin/help-posts', { params });
}

export function createHelpPost(data) {
  return request.post('/admin/help-posts', data);
}

export function updateHelpPost(id, data) {
  return request.put(`/admin/help-posts/${id}`, data);
}

export function updateHelpPostStatus(id, status) {
  return request.patch(`/admin/help-posts/${id}/status`, { status });
}

export function deleteHelpPost(id) {
  return request.delete(`/admin/help-posts/${id}`);
}
