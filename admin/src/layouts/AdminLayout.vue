<template>
  <el-container class="admin-shell">
    <el-aside width="216px" class="admin-aside">
      <div class="brand">校园拾喵驿站</div>
      <el-menu
        router
        :default-active="route.path"
        background-color="#1f2937"
        text-color="#d1d5db"
        active-text-color="#ffffff"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataBoard /></el-icon>
          <span>后台首页</span>
        </el-menu-item>
        <el-menu-item index="/cats">
          <el-icon><Collection /></el-icon>
          <span>猫咪管理</span>
        </el-menu-item>
        <el-menu-item index="/help-posts">
          <el-icon><Tickets /></el-icon>
          <span>求助领养管理</span>
        </el-menu-item>
        <el-menu-item index="/comments">
          <el-icon><ChatDotRound /></el-icon>
          <span>评论管理</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/banners">
          <el-icon><Picture /></el-icon>
          <span>轮播图管理</span>
        </el-menu-item>
        <el-menu-item index="/configs">
          <el-icon><Setting /></el-icon>
          <span>基础配置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="admin-header">
        <div class="header-title">{{ route.meta.title || '后台管理' }}</div>
        <div class="header-user">
          <span>{{ adminName }}</span>
          <el-button :icon="SwitchButton" @click="logout">退出登录</el-button>
        </div>
      </el-header>
      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ChatDotRound,
  Collection,
  DataBoard,
  Picture,
  Setting,
  SwitchButton,
  Tickets,
  User
} from '@element-plus/icons-vue';
import { clearAdminAuth, getAdminInfo } from '../utils/auth';

const route = useRoute();
const router = useRouter();
const adminName = computed(() => getAdminInfo()?.nickname || '管理员');

function logout() {
  clearAdminAuth();
  router.replace('/login');
}
</script>

<style scoped>
.admin-shell {
  min-height: 100vh;
}

.admin-aside {
  background: #1f2937;
  color: #fff;
}

.brand {
  height: 58px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  font-size: 18px;
  font-weight: 700;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 58px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-main {
  padding: 18px;
}
</style>
