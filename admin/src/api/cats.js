import request from './request';

export function getCats(params) {
  return request.get('/admin/cats', { params });
}

export function createCat(data) {
  return request.post('/admin/cats', data);
}

export function updateCat(id, data) {
  return request.put(`/admin/cats/${id}`, data);
}

export function deleteCat(id) {
  return request.delete(`/admin/cats/${id}`);
}
