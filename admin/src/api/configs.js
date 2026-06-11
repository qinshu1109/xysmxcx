import request from './request';

export function getConfigs() {
  return request.get('/admin/configs');
}

export function updateConfig(key, data) {
  return request.put(`/admin/configs/${key}`, data);
}
