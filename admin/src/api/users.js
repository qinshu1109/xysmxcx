import request from './request';

export function getUsers(params) {
  return request.get('/admin/users', { params });
}

export function updateUser(id, data) {
  return request.put(`/admin/users/${id}`, data);
}

export function deleteUser(id) {
  return request.delete(`/admin/users/${id}`);
}
