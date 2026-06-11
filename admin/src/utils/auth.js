const TOKEN_KEY = 'campus_cat_admin_token';
const ADMIN_KEY = 'campus_cat_admin_info';

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function setAdminToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getAdminInfo() {
  const raw = localStorage.getItem(ADMIN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    clearAdminInfo();
    return null;
  }
}

export function setAdminInfo(admin) {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin || {}));
}

export function clearAdminInfo() {
  localStorage.removeItem(ADMIN_KEY);
}

export function clearAdminAuth() {
  clearAdminToken();
  clearAdminInfo();
}

export function isAdminLoggedIn() {
  return Boolean(getAdminToken());
}
