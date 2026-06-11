import { createRouter, createWebHistory } from 'vue-router';
import { isAdminLoggedIn } from '../utils/auth';
import AdminLayout from '../layouts/AdminLayout.vue';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Cats from '../views/Cats.vue';
import HelpPosts from '../views/HelpPosts.vue';
import Comments from '../views/Comments.vue';
import Users from '../views/Users.vue';
import Banners from '../views/Banners.vue';
import Configs from '../views/Configs.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'Login', component: Login, meta: { public: true } },
    {
      path: '/',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/dashboard' },
        { path: 'dashboard', name: 'Dashboard', component: Dashboard, meta: { title: '后台首页' } },
        { path: 'cats', name: 'Cats', component: Cats, meta: { title: '猫咪管理' } },
        { path: 'help-posts', name: 'HelpPosts', component: HelpPosts, meta: { title: '求助领养管理' } },
        { path: 'comments', name: 'Comments', component: Comments, meta: { title: '评论管理' } },
        { path: 'users', name: 'Users', component: Users, meta: { title: '用户管理' } },
        { path: 'banners', name: 'Banners', component: Banners, meta: { title: '轮播图管理' } },
        { path: 'configs', name: 'Configs', component: Configs, meta: { title: '基础配置' } }
      ]
    },
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
  ]
});

router.beforeEach((to) => {
  if (to.meta.public && isAdminLoggedIn()) {
    return { path: '/dashboard' };
  }
  if (to.meta.requiresAuth && !isAdminLoggedIn()) {
    return { path: '/login', query: { redirect: to.fullPath } };
  }
  return true;
});

export default router;
