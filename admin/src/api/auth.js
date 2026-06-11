import request from './request';

export function loginAdmin(data) {
  return request.post('/admin/auth/login', data);
}
