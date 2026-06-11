const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/AppError');

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function verifyToken(token, secret, expectedRoles) {
  try {
    const payload = jwt.verify(token, secret);
    const roles = Array.isArray(expectedRoles) ? expectedRoles : [expectedRoles];
    if (!roles.includes(payload.role)) {
      throw new AppError('无权限', 403, 403);
    }
    return payload;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('未登录或 token 无效', 401, 401);
  }
}

function authenticateUser(req, res, next) {
  try {
    const token = getBearerToken(req);
    if (!token) throw new AppError('未登录或 token 无效', 401, 401);
    req.user = verifyToken(token, process.env.JWT_SECRET || 'local-user-secret', ['user', 'admin']);
    next();
  } catch (error) {
    next(error);
  }
}

function authenticateAdmin(req, res, next) {
  try {
    const token = getBearerToken(req);
    if (!token) throw new AppError('未登录或 token 无效', 401, 401);
    req.admin = verifyToken(token, process.env.ADMIN_JWT_SECRET || 'local-admin-secret', 'admin');
    next();
  } catch (error) {
    next(error);
  }
}

function authenticateUserOrAdmin(req, res, next) {
  try {
    const token = getBearerToken(req);
    if (!token) throw new AppError('未登录或 token 无效', 401, 401);

    try {
      req.user = verifyToken(token, process.env.JWT_SECRET || 'local-user-secret', ['user', 'admin']);
      return next();
    } catch (userError) {
      if (userError.code !== 401 && userError.code !== 403) throw userError;
    }

    req.admin = verifyToken(token, process.env.ADMIN_JWT_SECRET || 'local-admin-secret', 'admin');
    return next();
  } catch (error) {
    return next(error);
  }
}

function signUserToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, nickname: user.nickname, role: user.role || 'user' },
    process.env.JWT_SECRET || 'local-user-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function signAdminToken(admin) {
  return jwt.sign(
    { id: admin.id, username: admin.username, nickname: admin.nickname, role: 'admin', source: admin.source },
    process.env.ADMIN_JWT_SECRET || 'local-admin-secret',
    { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '7d' }
  );
}

module.exports = {
  authenticateUser,
  authenticateAdmin,
  authenticateUserOrAdmin,
  signUserToken,
  signAdminToken
};
